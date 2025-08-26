# Changelog

All notable changes to ChatGPT Desktop Client will be documented in this file.

## [1.0.2] - 2024-08-26

### 🚀 Major Features Added
- **System Tray Integration**: App now minimizes to system tray instead of closing
- **Keyboard Shortcuts**: Comprehensive keyboard navigation with help overlay (Ctrl+/)
- **Conversation Export**: Export chat conversations to text files (Ctrl+E)
- **Enhanced UI**: Custom CSS styling optimized for desktop use
- **Multi-format Builds**: Added AppImage and DEB package support alongside Snap

### 🔧 Authentication & Security Fixes
- **Fixed OAuth Authentication**: Resolved Google OAuth login issues that prevented sign-in
- **Updated Electron**: Upgraded from v33.2.0 to v37.3.1 for latest security patches
- **Removed Deprecated Dependencies**: Eliminated deprecated `electron-oauth2` package
- **Enhanced Session Management**: Better session persistence and cleanup options
- **Improved Security**: Updated all dependencies and fixed 5 security vulnerabilities

### 🎨 User Experience Improvements
- **Theme Toggle**: Quick theme switching with Ctrl+Shift+T
- **Better Focus Management**: Enhanced keyboard navigation with visible focus indicators
- **Desktop Optimization**: UI improvements specifically for desktop usage
- **Loading States**: Better visual feedback during app startup
- **Window Management**: Improved window state persistence across sessions

### 🐧 Linux Compatibility
- **Ubuntu 24.04/25.04 Support**: Tested and optimized for latest Ubuntu releases
- **Snap Configuration**: Updated to core24 base with enhanced plugs
- **AppImage Support**: Universal Linux package for broader compatibility
- **Desktop Integration**: Better integration with Linux desktop environments

### 📋 Full Keyboard Shortcuts
- `Ctrl+N` - New Chat
- `Ctrl+K` - Focus Search
- `Ctrl+E` - Export Conversation
- `Ctrl+Shift+T` - Toggle Theme
- `Escape` - Focus Message Input
- `Ctrl+/` - Show/Hide Shortcuts
- `F11` - Toggle Fullscreen
- `Ctrl+Plus/Minus/0` - Zoom controls

### 🔨 Technical Improvements
- **Preload Script Enhancement**: Better DOM manipulation and feature injection
- **Custom CSS Injection**: Automated styling for improved desktop experience
- **Build System**: Multiple build targets with electron-builder
- **Error Handling**: Improved error handling and user feedback
- **Performance**: Better memory management and resource usage

### 🐛 Bug Fixes
- Fixed OAuth URL blocking that prevented Google sign-in
- Fixed sandbox configuration for proper OAuth flow
- Fixed icon path resolution for system tray
- Fixed window state persistence on different displays
- Fixed session data clearing on app exit

### 📦 Package Changes
- Updated package.json with comprehensive build scripts
- Enhanced snap configuration for better permissions
- Added AppImage and DEB build configurations
- Updated package metadata and descriptions

## [1.0.1] - Previous Release
- Basic Electron-based ChatGPT wrapper
- Snap package distribution
- Basic window management

## [1.0.0] - Initial Release
- Initial ChatGPT desktop client
- Basic Electron implementation
- Snap package support