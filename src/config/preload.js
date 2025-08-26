// Preload script for ChatGPT Desktop Client
const { contextBridge, ipcRenderer } = require('electron');

// Enhanced preload script with useful features
window.addEventListener('DOMContentLoaded', async () => {
    // Load custom CSS via IPC (secure pattern - no direct fs access in preload)
    try {
        const customCSS = await ipcRenderer.invoke('get-custom-css');
        if (customCSS) {
            const style = document.createElement('style');
            style.textContent = customCSS;
            document.head.appendChild(style);
        }
    } catch (error) {
        console.warn('Could not load custom CSS:', error);
    }

    // Add additional desktop-specific styles
    const style = document.createElement('style');
    style.textContent = `
        /* Desktop app indicator */
        .desktop-app-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.5);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-family: monospace;
            z-index: 9999;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .desktop-app-indicator:hover {
            opacity: 0.8;
        }

        /* Enhanced keyboard navigation */
        [tabindex]:focus-visible {
            outline: 2px solid #0ea5e9 !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search (common in desktop apps)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="search"]') ||
                              document.querySelector('input[type="text"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to focus message input
        if (e.key === 'Escape') {
            const messageInput = document.querySelector('textarea[placeholder*="message"]') ||
                               document.querySelector('textarea');
            if (messageInput && document.activeElement !== messageInput) {
                messageInput.focus();
            }
        }

        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });

    // Add a subtle desktop indicator
    setTimeout(() => {
        if (!document.getElementById('desktop-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'desktop-indicator';
            indicator.className = 'desktop-app-indicator';
            indicator.textContent = 'Desktop App';
            indicator.title = 'ChatGPT Desktop Client\nPress Ctrl+/ for shortcuts';
            document.body.appendChild(indicator);
        }
    }, 2000);

    // Function to show keyboard shortcuts
    function showKeyboardShortcuts() {
        const existingModal = document.getElementById('shortcuts-modal');
        if (existingModal) {
            existingModal.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'shortcuts-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        content.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #333;">Keyboard Shortcuts</h3>
            <div style="color: #666; line-height: 1.6;">
                <div style="margin-bottom: 8px;"><kbd>Ctrl+N</kbd> - New Chat</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+K</kbd> - Focus Search</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+E</kbd> - Export Conversation</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+Shift+T</kbd> - Toggle Theme</div>
                <div style="margin-bottom: 8px;"><kbd>Escape</kbd> - Focus Message Input</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+/</kbd> - Show/Hide Shortcuts</div>
                <div style="margin-bottom: 8px;"><kbd>F11</kbd> - Toggle Fullscreen</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+Plus</kbd> - Zoom In</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+Minus</kbd> - Zoom Out</div>
                <div style="margin-bottom: 8px;"><kbd>Ctrl+0</kbd> - Reset Zoom</div>
            </div>
            <button id="close-shortcuts" style="
                margin-top: 16px;
                padding: 8px 16px;
                background: #0ea5e9;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            ">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Close on click outside or button click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.id === 'close-shortcuts') {
                modal.remove();
            }
        });

        // Close on Escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }
});

// Expose safe API to renderer if needed
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: process.versions
});
