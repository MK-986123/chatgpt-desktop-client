window.addEventListener('DOMContentLoaded', () => {
    const { ipcRenderer } = require('electron');
    window.ipcRenderer = ipcRenderer; // Example of exposing IPC to renderer
});
