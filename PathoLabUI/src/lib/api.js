const API_BASE_URL = '/api';

export const api = {
    // Patients
    getPatients: async () => {
        const response = await fetch(`${API_BASE_URL}/Patients`);
        return await response.json();
    },

    getPatient: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Patients/${id}`);
        return await response.json();
    },

    createPatient: async (patientData) => {
        const response = await fetch(`${API_BASE_URL}/Patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });
        return await response.json();
    },

    updatePatient: async (id, patientData) => {
        const response = await fetch(`${API_BASE_URL}/Patients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...patientData })
        });
        return { success: response.ok };
    },

    deletePatient: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Patients/${id}`, {
            method: 'DELETE'
        });
        return { success: response.ok };
    },

    // Cases
    getCases: async () => {
        const response = await fetch(`${API_BASE_URL}/Cases`);
        return await response.json();
    },

    getCase: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Cases/${id}`);
        return await response.json();
    },

    createCase: async (caseData) => {
        const response = await fetch(`${API_BASE_URL}/Cases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caseData)
        });
        return await response.json();
    },

    updateCase: async (id, caseData) => {
        const response = await fetch(`${API_BASE_URL}/Cases/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...caseData })
        });
        return { success: response.ok };
    },

    deleteCase: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Cases/${id}`, {
            method: 'DELETE'
        });
        return { success: response.ok };
    },

    // Tests (TestsMaster)
    getTests: async () => {
        const response = await fetch(`${API_BASE_URL}/TestsMaster`);
        return await response.json();
    },

    getTest: async (id) => {
        const response = await fetch(`${API_BASE_URL}/TestsMaster/${id}`);
        return await response.json();
    },

    createTest: async (testData) => {
        const response = await fetch(`${API_BASE_URL}/TestsMaster`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        return await response.json();
    },

    updateTest: async (id, testData) => {
        const response = await fetch(`${API_BASE_URL}/TestsMaster/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...testData })
        });
        return { success: response.ok };
    },

    deleteTest: async (id) => {
        const response = await fetch(`${API_BASE_URL}/TestsMaster/${id}`, {
            method: 'DELETE'
        });
        return { success: response.ok };
    },

    // Doctors
    getDoctors: async () => {
        const response = await fetch(`${API_BASE_URL}/Doctors`);
        return await response.json();
    },

    getDoctor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Doctors/${id}`);
        return await response.json();
    },

    createDoctor: async (doctorData) => {
        const response = await fetch(`${API_BASE_URL}/Doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctorData)
        });
        return await response.json();
    },

    updateDoctor: async (id, doctorData) => {
        const response = await fetch(`${API_BASE_URL}/Doctors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...doctorData })
        });
        return { success: response.ok };
    },

    deleteDoctor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Doctors/${id}`, {
            method: 'DELETE'
        });
        return { success: response.ok };
    },

    // Settings
    getSettings: async () => {
        const response = await fetch(`${API_BASE_URL}/Settings`);
        const data = await response.json();
        // Transform array of { key, value } to object
        const result = {};
        data.forEach(item => {
            result[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
        });
        return result;
    },

    updateSettings: async (settingsData) => {
        // settingsData is { key: value, ... }
        const promises = Object.entries(settingsData).map(([key, value]) => 
            fetch(`${API_BASE_URL}/Settings/${key}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: JSON.stringify(value) })
            })
        );
        await Promise.all(promises);
        return { success: true };
    },

    // Auth methods (Simplified for now)
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (!response.ok) return { success: false, message: data.message || 'Login failed' };
            return data;
        } catch (err) {
            return { success: false, message: 'Server connection error' };
        }
    },

    getCurrentUser: async () => {
        const response = await fetch(`${API_BASE_URL}/Auth/me`);
        if (!response.ok) return null;
        return await response.json();
    },

    logout: async () => {
        await fetch(`${API_BASE_URL}/Auth/logout`, { method: 'POST' });
        return { success: true };
    },

    // Licensing methods (Mocked for web)
    getMachineId: async () => "WEB-BROWSER",
    verifyAndActivate: async (key) => ({ success: true }),
    checkLicenseStatus: async () => ({ status: 'active' }),

    // User management
    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/Users`);
        return await response.json();
    },

    createUser: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) return { success: false, message: data.message || 'Failed to create user' };
            return data;
        } catch (err) {
            return { success: false, message: 'Server connection error' };
        }
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
            method: 'DELETE'
        });
        return { success: response.ok };
    },
};
