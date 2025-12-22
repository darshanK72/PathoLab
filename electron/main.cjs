const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Disable sandbox to avoid SUID permission issues on Linux
app.commandLine.appendSwitch('no-sandbox');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "PathoLab Manager",
    // Premium look: hide default menu bar
    autoHideMenuBar: true,
  });

  if (isDev) {
    // In dev, load the vite dev server
    // We'll need to pass the port or assume 5173
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In prod, load the index.html from dist
    // Note: dist is usually one level up from electron folder in build structure, or we configure electron-builder to define resources
    // For now assuming build output is in dist/ and this file is in electron/ or dist-electron/
    // Let's assume standard electron-builder config where we read from file
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// PDF Generation Handler
ipcMain.handle('save-pdf', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Save Lab Report',
    defaultPath: `Report_${options.patientName || 'Patient'}.pdf`,
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  });

  if (!filePath) return { success: false, error: 'Cancelled' };

  try {
    const data = await win.webContents.printToPDF({
      marginsType: 1, // No margins, let CSS and @page handle it exactly
      pageSize: 'A4',
      printBackground: true,
      landscape: false
    });

    fs.writeFileSync(filePath, data);
    return { success: true, path: filePath };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return { success: false, error: error.message };
  }
});
