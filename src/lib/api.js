const BASE_URL = 'http://localhost:3000';

export const api = {
    // Patients
    getPatients: async () => {
        const response = await fetch(`${BASE_URL}/patients`);
        if (!response.ok) throw new Error('Failed to fetch patients');
        return response.json();
    },

    getPatient: async (id) => {
        const response = await fetch(`${BASE_URL}/patients/${id}`);
        if (!response.ok) throw new Error('Failed to fetch patient');
        return response.json();
    },

    createPatient: async (patientData) => {
        const response = await fetch(`${BASE_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData),
        });
        if (!response.ok) throw new Error('Failed to create patient');
        return response.json();
    },

    updatePatient: async (id, patientData) => {
        const response = await fetch(`${BASE_URL}/patients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData),
        });
        if (!response.ok) throw new Error('Failed to update patient');
        return response.json();
    },

    deletePatient: async (id) => {
        const response = await fetch(`${BASE_URL}/patients/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete patient');
        return response.json();
    },

    // Cases can be added similarly

    // Tests
    getTests: async () => {
        const response = await fetch(`${BASE_URL}/tests`);
        if (!response.ok) throw new Error('Failed to fetch tests');
        return response.json();
    },

    getTest: async (id) => {
        const response = await fetch(`${BASE_URL}/tests/${id}`);
        if (!response.ok) throw new Error('Failed to fetch test');
        return response.json();
    },

    createTest: async (testData) => {
        const response = await fetch(`${BASE_URL}/tests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData),
        });
        if (!response.ok) throw new Error('Failed to create test');
        return response.json();
    },

    updateTest: async (id, testData) => {
        const response = await fetch(`${BASE_URL}/tests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData),
        });
        if (!response.ok) throw new Error('Failed to update test');
        return response.json();
    },

    deleteTest: async (id) => {
        const response = await fetch(`${BASE_URL}/tests/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete test');
        return response.json();
    },


    // Settings
    getSettings: async () => {
        // Since settings is a single object, we might fetch the whole db or a specific endpoint if supported.
        // JSON Server usually supports /endpoint.
        const response = await fetch(`${BASE_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    updateSettings: async (settingsData) => {
        const response = await fetch(`${BASE_URL}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsData),
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return response.json();
    },
};
