const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

// Disable hardware acceleration to prevent potential rendering issues
app.disableHardwareAcceleration();

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'PathoLab Manager',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // Often needed for complex electron apps with local DB
    },
    autoHideMenuBar: true
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle new window creation
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}

// PDF Handler
ipcMain.handle('save-pdf', async (event, data) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const patientName = data.patientName || 'Patient';
  const fileName = `${patientName}_Report_${Date.now()}.pdf`;

  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Save Lab Report',
    defaultPath: fileName,
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  });

  if (!filePath) {
    return { success: false, error: 'Cancelled' };
  }

  try {
    const pdfData = await win.webContents.printToPDF({
      marginsType: 1, // No margins
      pageSize: 'A4',
      printBackground: true,
      landscape: false
    });

    fs.writeFileSync(filePath, pdfData);
    return { success: true, path: filePath };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(async () => {
  try {
    const userDataPath = app.getPath('userData');
    
    // Dynamically import ESM handlers
    const { setupHandlers } = await import('./db/handlers.js');
    const { setupAuthHandlers } = await import('./db/auth.js');
    const { setupLicenseHandlers } = await import('./license.js');

    // Initialize handlers
    console.log('Initializing handlers...');
    // setupHandlers expects userDataPath to init DB
    const db = await setupHandlers(userDataPath); 
    setupAuthHandlers();
    setupLicenseHandlers();
    console.log('Handlers initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize handlers:', error);
    dialog.showErrorBox('Startup Error', `Failed to initialize application.\n\n${error.message}\n\n${error.stack}`);
  }

  createWindow();

  // Register a shortcut to toggle DevTools in production
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});