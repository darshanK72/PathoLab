const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveReportAsPDF: (data) => ipcRenderer.invoke('save-pdf', data),
  db: {
    // Patients
    getPatients: () => ipcRenderer.invoke('db:getPatients'),
    getPatient: (id) => ipcRenderer.invoke('db:getPatient', id),
    createPatient: (data) => ipcRenderer.invoke('db:createPatient', data),
    updatePatient: (id, data) => ipcRenderer.invoke('db:updatePatient', { id, data }),
    deletePatient: (id) => ipcRenderer.invoke('db:deletePatient', id),

    // Cases
    getCases: () => ipcRenderer.invoke('db:getCases'),
    getCase: (id) => ipcRenderer.invoke('db:getCase', id),
    createCase: (data) => ipcRenderer.invoke('db:createCase', data),
    updateCase: (id, data) => ipcRenderer.invoke('db:updateCase', { id, data }),
    deleteCase: (id) => ipcRenderer.invoke('db:deleteCase', id),

    // Tests
    getTests: () => ipcRenderer.invoke('db:getTests'),
    getTest: (id) => ipcRenderer.invoke('db:getTest', id),
    createTest: (data) => ipcRenderer.invoke('db:createTest', data),
    updateTest: (id, data) => ipcRenderer.invoke('db:updateTest', { id, data }),
    deleteTest: (id) => ipcRenderer.invoke('db:deleteTest', id),

    // Doctors
    getDoctors: () => ipcRenderer.invoke('db:getDoctors'),
    getDoctor: (id) => ipcRenderer.invoke('db:getDoctor', id),
    createDoctor: (data) => ipcRenderer.invoke('db:createDoctor', data),
    updateDoctor: (id, data) => ipcRenderer.invoke('db:updateDoctor', { id, data }),
    deleteDoctor: (id) => ipcRenderer.invoke('db:deleteDoctor', id),

    // Settings
    getSettings: () => ipcRenderer.invoke('db:getSettings'),
    updateSettings: (data) => ipcRenderer.invoke('db:updateSettings', data),

    // Auth
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    getCurrentUser: () => ipcRenderer.invoke('auth:get-current-user'),
    logout: () => ipcRenderer.invoke('auth:logout'),
    getUsers: () => ipcRenderer.invoke('auth:get-users'),
    createUser: (data) => ipcRenderer.invoke('auth:create-user', data),
    deleteUser: (id) => ipcRenderer.invoke('auth:delete-user', id),

    // Licensing (Bypassed)
    getMachineId: () => ipcRenderer.invoke('license:get-machine-id'),
    verifyAndActivate: (key) => ipcRenderer.invoke('license:verify-and-activate', key),
    checkLicenseStatus: () => ipcRenderer.invoke('license:check-status'),
  }
});