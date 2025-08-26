# ChatGPT Desktop Client

A modern, feature-rich desktop application that provides seamless access to ChatGPT with enhanced functionality for Linux desktop environments. Optimized for Ubuntu 24.04/25.04 AMD64 with improved OAuth authentication and desktop integration.

[![Get it from the Snap Store](https://snapcraft.io/en/dark/install.svg)](https://snapcraft.io/chatgpt-desktop-client)

![ChatGPT Desktop Client](https://raw.githubusercontent.com/xanmoy/chatgpt-desktop-client/refs/heads/main/screenshots/chatgpt.webp)

## 🆕 **Latest Updates (v1.0.2)**

### Authentication Fixes
- ✅ **Fixed OAuth Authentication**: Resolved Google OAuth login issues by removing URL blocking and implementing proper session handling
- ✅ **Updated Security**: Latest Electron v37.3.1 with enhanced security features
- ✅ **Removed Deprecated Dependencies**: Eliminated deprecated `electron-oauth2` package

### New Features
- 🎯 **System Tray Integration**: Minimize to tray with context menu and quick access
- ⌨️ **Keyboard Shortcuts**: Comprehensive keyboard navigation and shortcuts
- 📁 **Conversation Export**: Export your chats to text files (Ctrl+E)
- 🎨 **Enhanced UI**: Custom CSS styling optimized for desktop use
- 🔍 **Better Search**: Quick search with Ctrl+K
- 📱 **Multiple Build Targets**: AppImage, Snap, and DEB packages
- 🌙 **Theme Toggle**: Quick theme switching (Ctrl+Shift+T)
- 💾 **Session Management**: Improved session persistence and cleanup options

## 🛠 **Features**

ChatGPT Desktop is a lightweight, Electron-based application that brings the power of OpenAI's ChatGPT to your desktop with enhanced features:

1. **Fixed OAuth Authentication**: Seamless login with Google accounts
2. **Desktop Integration**: System tray, notifications, and native menus
3. **Keyboard Shortcuts**: Full keyboard navigation support
4. **Conversation Export**: Save your important conversations
5. **Enhanced Security**: Latest Electron with security best practices
6. **Custom Styling**: Optimized interface for desktop use
7. **Multi-format Builds**: AppImage, Snap, and DEB packages
8. **Linux Optimized**: Specifically tested on Ubuntu 24.04/25.04

## ⌨️ **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New Chat |
| `Ctrl+K` | Focus Search |
| `Ctrl+E` | Export Conversation |
| `Ctrl+Shift+T` | Toggle Theme |
| `Escape` | Focus Message Input |
| `Ctrl+/` | Show/Hide Shortcuts |
| `F11` | Toggle Fullscreen |
| `Ctrl+Plus` | Zoom In |
| `Ctrl+Minus` | Zoom Out |
| `Ctrl+0` | Reset Zoom |

## 📦 **Installation**

### Option 1: Snap Package (Recommended)
```bash
sudo snap install chatgpt-desktop-client --beta
```

### Option 2: AppImage (Universal Linux Package)
1. Download the latest AppImage from the [releases page](https://github.com/MK-986123/chatgpt-desktop-client/releases)
2. Make it executable and run:
```bash
chmod +x "ChatGPT Desktop-1.0.2.AppImage"
./ChatGPT\ Desktop-1.0.2.AppImage
```

### Option 3: Build From Source

1. **Clone the repository**:
```bash
git clone https://github.com/MK-986123/chatgpt-desktop-client.git
cd chatgpt-desktop-client
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the application**:
```bash
npm start
```

4. **Build packages**:
```bash
# Build all Linux packages
npm run dist

# Build specific formats
npm run dist:appimage  # AppImage
npm run dist:snap      # Snap
npm run dist:deb       # DEB package
```

### System Requirements
- Ubuntu 20.04+ (tested on 24.04/25.04)
- x86_64 (AMD64) architecture
- 4GB RAM minimum
- 200MB disk space

## ↩️ **Uninstallation**

### Snap Package
```bash
sudo snap remove chatgpt-desktop-client
```

### AppImage
Simply delete the AppImage file and any desktop integration files.

## 📖 **Usage Instructions**

### **Launching the App**:

**Snap installation:**
```bash
chatgpt-desktop-client
```

**AppImage:**
Double-click the AppImage file or run from terminal.

### **First-time Setup**:
1. Launch the application
2. Log in with your OpenAI account (Google OAuth is now fully supported)
3. Start chatting with ChatGPT!

### **Tips**:
- Use `Ctrl+/` to see all keyboard shortcuts
- Right-click the system tray icon for quick actions
- Export important conversations with `Ctrl+E`
- Use `Ctrl+K` for quick search functionality

## 🔧 **Troubleshooting**

### OAuth Login Issues
If you experience login problems:
1. Clear session data via Tools menu
2. Restart the application
3. Try logging in again

### Performance Issues
- Close and reopen the app to clear memory
- Use `Ctrl+0` to reset zoom if UI appears distorted
- Check system resources (4GB RAM minimum recommended)

## 🚀 **What's New in v1.0.2**

- ✅ Fixed Google OAuth authentication issues
- ✅ Updated to Electron 37.3.1 for better security
- ✅ Added comprehensive keyboard shortcuts
- ✅ System tray integration with context menu
- ✅ Conversation export functionality
- ✅ Enhanced desktop UI with custom styling
- ✅ Multi-format builds (AppImage, Snap, DEB)
- ✅ Improved Linux compatibility for Ubuntu 24.04/25.04
- ✅ Better session management and cleanup

## 🤝 **Contributing**

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## 📜 **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Electron** - Framework used to build the application.
