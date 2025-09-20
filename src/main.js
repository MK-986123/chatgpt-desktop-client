import fs from 'fs';
import { app, BrowserWindow, shell, screen, session, Menu, dialog, nativeTheme, Tray, Notification, ipcMain } from 'electron';
import path from 'path';
import { config } from './config/index.js'; // Import platform-specific user agent
import { fileURLToPath } from 'url';

// Calculate __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define path for storing window state
const stateFilePath = path.join(app.getPath('userData'), 'window-state.json');
const appUrl = 'https://chat.openai.com/'; // ChatGPT URL

let window; // Declare window globally to be accessible in all parts of the app
let tray = null; // System tray

// Disable hardware acceleration to fix V-Sync issues (should be called before app is ready)
app.disableHardwareAcceleration();

// IPC handler for getting custom CSS content
ipcMain.handle('get-custom-css', async () => {
    try {
        const cssPath = path.join(__dirname, 'styles', 'custom.css');
        if (fs.existsSync(cssPath)) {
            return fs.readFileSync(cssPath, 'utf-8');
        }
        return '';
    } catch (error) {
        console.warn('Could not load custom CSS:', error);
        return '';
    }
});

/**
 * Loads saved window state and ensures it is within available screen bounds.
 */
function loadWindowState() {
    try {
        if (!fs.existsSync(stateFilePath)) {
            return getCenteredWindowState(800, 600);
        }

        const rawData = fs.readFileSync(stateFilePath, 'utf-8');
        const state = JSON.parse(rawData);

        if (!state.width || !state.height || isNaN(state.x) || isNaN(state.y)) {
            throw new Error("Invalid window state data");
        }

        const displays = screen.getAllDisplays();
        const display = displays.find(d => d.id === state.displayId);

        if (!display) {
            return getCenteredWindowState(state.width, state.height);
        }

        if (
            state.x < display.bounds.x || state.y < display.bounds.y ||
            state.x + state.width > display.bounds.x + display.bounds.width ||
            state.y + state.height > display.bounds.y + display.bounds.height
        ) {
            return getCenteredWindowState(state.width, state.height, display.bounds);
        }

        return state;
    } catch (error) {
        console.error("Error loading window state:", error);
        return getCenteredWindowState(800, 600);
    }
}

/**
 * Saves window state before closing.
 */
function saveWindowState() {
    if (window && !window.isMinimized() && !window.isFullScreen()) {
        try {
            const bounds = window.getBounds();
            const display = screen.getDisplayMatching(bounds);

            fs.writeFileSync(stateFilePath, JSON.stringify({
                ...bounds,
                displayId: display.id
            }));
        } catch (error) {
            console.error("Error saving window state:", error);
        }
    }
}

/**
 * Calculates a centered window state.
 */
function getCenteredWindowState(width, height, bounds = screen.getPrimaryDisplay().bounds) {
    return {
        width,
        height,
        x: Math.max(bounds.x, Math.floor(bounds.x + (bounds.width - width) / 2)),
        y: Math.max(bounds.y, Math.floor(bounds.y + (bounds.height - height) / 2)),
        displayId: screen.getPrimaryDisplay().id
    };
}

/**
 * Handles external links opening outside the app.
 */
function onNewWindow(details) {
    const { url } = details;
    
    // Allow OAuth flows for OpenAI and Google within the app with specific configuration
    if (url.includes('accounts.google.com') || 
        url.includes('chat.openai.com/auth') || 
        url.includes('auth0.openai.com') ||
        url.includes('openai.com/api/auth')) {
        return { 
            action: 'allow',
            overrideBrowserWindowOptions: {
                webPreferences: {
                    partition: 'persist:chatgpt-session', // Share session with main window
                    contextIsolation: true,
                    nodeIntegration: false,
                    sandbox: false, // Disable sandbox only for OAuth popup
                    webSecurity: true,
                    allowRunningInsecureContent: false
                    // Omit preload for security - OAuth popups don't need extra APIs
                }
            }
        };
    }
    
    // Open other external links in default browser
    console.log("Opening external link:", url);
    shell.openExternal(url);
    return { action: 'deny' };
}

/**
 * Creates the main application window.
 */
function createWindow() {
    const windowState = loadWindowState();

    window = new BrowserWindow({
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        icon: path.join(__dirname, '..', 'assets', 'icon.png'),
        autoHideMenuBar: true,
        show: false, // Don't show until ready
        webPreferences: {
            nodeIntegration: false,  // Security best practice
            contextIsolation: true,
            partition: 'persist:chatgpt-session', // Ensures cookies & session persist
            sandbox: true, // Restore secure sandbox behavior for main window
            preload: path.join(__dirname, 'config', 'preload.js'),
            webSecurity: true,
            allowRunningInsecureContent: false
        }
    });

    window.loadURL(appUrl, {
        userAgent: config.userAgent // Use the user agent from config
    });

    // Show window when ready to prevent visual flash
    window.once('ready-to-show', () => {
        window.show();
    });

    window.webContents.setWindowOpenHandler(onNewWindow);
    
    // Handle window close to minimize to tray instead of quit
    window.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            window.hide();
            
            // Show notification on first minimize
            if (!window.hasBeenMinimized) {
                if (Notification.isSupported()) {
                    new Notification({
                        title: 'ChatGPT Desktop',
                        body: 'Application was minimized to tray',
                        icon: path.join(__dirname, '..', 'assets', 'icon.png')
                    }).show();
                }
                window.hasBeenMinimized = true;
            }
        } else {
            saveWindowState();
        }
    });
    
    // Save window state on normal close
    window.on('closed', saveWindowState);
    
    // Set up menu and tray
    createMenu();
    createTray();
}

/**
 * Creates application menu with useful features
 */
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Chat',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        window.webContents.executeJavaScript(`
                            const newChatButton = document.querySelector('[data-testid="create-new-chat-button"]') || 
                                                 document.querySelector('button[title*="New chat"]') ||
                                                 document.querySelector('a[href="/"]');
                            if (newChatButton) newChatButton.click();
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectall' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
                { type: 'separator' },
                {
                    label: 'Toggle Theme',
                    accelerator: 'CmdOrCtrl+Shift+T',
                    click: () => {
                        // Toggle between light and dark themes
                        window.webContents.executeJavaScript(`
                            // Try to find and click theme toggle button
                            const themeButton = document.querySelector('[aria-label*="theme"]') ||
                                              document.querySelector('[title*="theme"]') ||
                                              document.querySelector('button[data-state]');
                            if (themeButton) themeButton.click();
                        `);
                    }
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Export Conversation',
                    accelerator: 'CmdOrCtrl+E',
                    click: async () => {
                        try {
                            const result = await dialog.showSaveDialog(window, {
                                title: 'Export Conversation',
                                defaultPath: `chatgpt-conversation-${new Date().toISOString().split('T')[0]}.txt`,
                                filters: [
                                    { name: 'Text Files', extensions: ['txt'] },
                                    { name: 'All Files', extensions: ['*'] }
                                ]
                            });
                            
                            if (!result.canceled && result.filePath) {
                                // Extract conversation text
                                const conversationText = await window.webContents.executeJavaScript(`
                                    const messages = document.querySelectorAll('[data-message-author-role]');
                                    let conversation = '';
                                    messages.forEach(msg => {
                                        const role = msg.getAttribute('data-message-author-role');
                                        const text = msg.textContent.trim();
                                        if (text) {
                                            conversation += (role === 'user' ? 'User: ' : 'Assistant: ') + text + '\\n\\n';
                                        }
                                    });
                                    conversation || 'No conversation found';
                                `);
                                
                                fs.writeFileSync(result.filePath, conversationText, 'utf-8');
                                dialog.showMessageBox(window, {
                                    type: 'info',
                                    title: 'Export Complete',
                                    message: 'Conversation exported successfully!'
                                });
                            }
                        } catch (error) {
                            console.error('Export failed:', error);
                            dialog.showErrorBox('Export Failed', 'Failed to export conversation');
                        }
                    }
                },
                {
                    label: 'Clear Session Data',
                    click: async () => {
                        const result = await dialog.showMessageBox(window, {
                            type: 'warning',
                            buttons: ['Cancel', 'Clear'],
                            defaultId: 0,
                            title: 'Clear Session Data',
                            message: 'This will log you out and clear all session data. Continue?'
                        });
                        
                        if (result.response === 1) {
                            const chatgptSession = session.fromPartition('persist:chatgpt-session');
                            await chatgptSession.clearStorageData();
                            window.reload();
                        }
                    }
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

/**
 * Creates system tray
 */
function createTray() {
    const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show ChatGPT',
            click: () => {
                window.show();
                window.focus();
            }
        },
        {
            label: 'New Chat',
            click: () => {
                window.show();
                window.focus();
                window.webContents.executeJavaScript(`
                    const newChatButton = document.querySelector('[data-testid="create-new-chat-button"]') || 
                                         document.querySelector('button[title*="New chat"]') ||
                                         document.querySelector('a[href="/"]');
                    if (newChatButton) newChatButton.click();
                `);
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => app.quit()
        }
    ]);
    
    tray.setToolTip('ChatGPT Desktop');
    tray.setContextMenu(contextMenu);
    
    // Double-click to show window
    tray.on('double-click', () => {
        window.show();
        window.focus();
    });
}

/**
 * Ensures only a single instance of the app runs.
 */
const appLock = app.requestSingleInstanceLock();
if (!appLock) {
    app.quit();
} else {
    app.on('second-instance', (event, args) => {
        if (window) {
            event.preventDefault();
            window.show();
            window.focus();
        }
    });

    // Handle app quit
    app.on('before-quit', () => {
        app.isQuitting = true;
    });

    // macOS specific: Keep app running when all windows are closed
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (window) {
            window.show();
            window.focus();
        }
    });

    app.whenReady().then(async () => {
        const chatgptSession = session.fromPartition('persist:chatgpt-session');

        // Configure session for better OAuth support
        chatgptSession.webRequest.onHeadersReceived((details, callback) => {
            // Remove X-Frame-Options to allow OAuth flows
            const responseHeaders = { ...details.responseHeaders };
            delete responseHeaders['x-frame-options'];
            delete responseHeaders['X-Frame-Options'];
            
            callback({
                responseHeaders: responseHeaders
            });
        });

        createWindow();
    });
}
