const db = window.electronAPI.db;

export const api = {
    // Patients
    getPatients: async () => {
        return await db.getPatients();
    },

    getPatient: async (id) => {
        return await db.getPatient(id);
    },

    createPatient: async (patientData) => {
        return await db.createPatient(patientData);
    },

    updatePatient: async (id, patientData) => {
        return await db.updatePatient(id, patientData);
    },

    deletePatient: async (id) => {
        return await db.deletePatient(id);
    },

    // Cases
    getCases: async () => {
        return await db.getCases();
    },

    getCase: async (id) => {
        return await db.getCase(id);
    },

    createCase: async (caseData) => {
        return await db.createCase(caseData);
    },

    updateCase: async (id, caseData) => {
        return await db.updateCase(id, caseData);
    },

    deleteCase: async (id) => {
        return await db.deleteCase(id);
    },

    // Tests
    getTests: async () => {
        return await db.getTests();
    },

    getTest: async (id) => {
        return await db.getTest(id);
    },

    createTest: async (testData) => {
        return await db.createTest(testData);
    },

    updateTest: async (id, testData) => {
        return await db.updateTest(id, testData);
    },

    deleteTest: async (id) => {
        return await db.deleteTest(id);
    },

    // Doctors
    getDoctors: async () => {
        return await db.getDoctors();
    },

    getDoctor: async (id) => {
        return await db.getDoctor(id);
    },

    createDoctor: async (doctorData) => {
        return await db.createDoctor(doctorData);
    },

    updateDoctor: async (id, doctorData) => {
        return await db.updateDoctor(id, doctorData);
    },

    deleteDoctor: async (id) => {
        return await db.deleteDoctor(id);
    },

    // Settings
    getSettings: async () => {
        return await db.getSettings();
    },

    updateSettings: async (settingsData) => {
        return await db.updateSettings(settingsData);
    },

    // Auth methods
    login: async (credentials) => {
        return await db.login(credentials);
    },

    getCurrentUser: async () => {
        return await db.getCurrentUser();
    },

    logout: async () => {
        return await db.logout();
    },

    // Licensing methods
    getMachineId: async () => {
        return await db.getMachineId();
    },

    verifyAndActivate: async (key) => {
        return await db.verifyAndActivate(key);
    },

    checkLicenseStatus: async () => {
        return await db.checkLicenseStatus();
    },

    // User management
    getUsers: async () => {
        return await db.getUsers();
    },

    createUser: async (userData) => {
        return await db.createUser(userData);
    },

    deleteUser: async (id) => {
        return await db.deleteUser(id);
    },
};
