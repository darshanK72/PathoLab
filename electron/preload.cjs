const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveReportAsPDF: (options) => ipcRenderer.invoke('save-pdf', options)
});
