import { ipcMain } from 'electron';
import { initDb } from './index.js';
import { patients, cases, testsMaster, settings, doctors } from './schema.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export function setupHandlers(userDataPath) {
  // Initialize DB
  const db = initDb(userDataPath);

  // --- Patients Handlers ---
  ipcMain.handle('db:getPatients', async () => {
    try {
      return await db.select().from(patients).all();
    } catch (e) {
      console.error('db:getPatients error', e);
      return [];
    }
  });

  ipcMain.handle('db:getPatient', async (event, id) => {
    try {
      const result = await db.select().from(patients).where(eq(patients.id, id)).get();
      return result;
    } catch (e) {
      console.error('db:getPatient error', e);
      return null;
    }
  });

  ipcMain.handle('db:createPatient', async (event, data) => {
    try {
      // Ensure ID is generated if not present, though frontend might send it
      if (!data.id) data.id = 'PAT-' + Date.now();
      await db.insert(patients).values(data);
      return { success: true, id: data.id };
    } catch (e) {
      console.error('db:createPatient error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:updatePatient', async (event, { id, data }) => {
    try {
      await db.update(patients).set(data).where(eq(patients.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:updatePatient error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:deletePatient', async (event, id) => {
    try {
      await db.delete(patients).where(eq(patients.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:deletePatient error', e);
      return { success: false, error: e.message };
    }
  });

  // --- Cases Handlers ---
  ipcMain.handle('db:getCases', async () => {
    try {
      return await db.select().from(cases).all();
    } catch (e) {
      console.error('db:getCases error', e);
      return [];
    }
  });

  ipcMain.handle('db:getCase', async (event, id) => {
    try {
      const result = await db.select().from(cases).where(eq(cases.id, id)).get();
      return result;
    } catch (e) {
      console.error('db:getCase error', e);
      return null;
    }
  });

  ipcMain.handle('db:createCase', async (event, data) => {
    try {
      if (!data.id) data.id = 'CASE-' + Date.now();
      await db.insert(cases).values(data);
      return { success: true, id: data.id };
    } catch (e) {
      console.error('db:createCase error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:updateCase', async (event, { id, data }) => {
    try {
      await db.update(cases).set(data).where(eq(cases.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:updateCase error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:deleteCase', async (event, id) => {
    try {
      await db.delete(cases).where(eq(cases.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:deleteCase error', e);
      return { success: false, error: e.message };
    }
  });

  // --- Tests Handlers ---
  ipcMain.handle('db:getTests', async () => {
    try {
      return await db.select().from(testsMaster).all();
    } catch (e) {
      console.error('db:getTests error', e);
      return [];
    }
  });

  ipcMain.handle('db:getTest', async (event, id) => {
    try {
      const result = await db.select().from(testsMaster).where(eq(testsMaster.id, id)).get();
      return result;
    } catch (e) {
      console.error('db:getTest error', e);
      return null;
    }
  });

  ipcMain.handle('db:createTest', async (event, data) => {
    try {
      if (!data.id) data.id = 'TEST-' + Date.now();
      await db.insert(testsMaster).values(data);
      return { success: true, id: data.id };
    } catch (e) {
      console.error('db:createTest error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:updateTest', async (event, { id, data }) => {
    try {
      await db.update(testsMaster).set(data).where(eq(testsMaster.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:updateTest error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:deleteTest', async (event, id) => {
    try {
      await db.delete(testsMaster).where(eq(testsMaster.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:deleteTest error', e);
      return { success: false, error: e.message };
    }
  });

  // --- Doctors Handlers ---
  ipcMain.handle('db:getDoctors', async () => {
    try {
      return await db.select().from(doctors).all();
    } catch (e) {
      console.error('db:getDoctors error', e);
      return [];
    }
  });

  ipcMain.handle('db:getDoctor', async (event, id) => {
    try {
      const result = await db.select().from(doctors).where(eq(doctors.id, id)).get();
      return result;
    } catch (e) {
      console.error('db:getDoctor error', e);
      return null;
    }
  });

  ipcMain.handle('db:createDoctor', async (event, data) => {
    try {
      if (!data.id) data.id = 'DOC-' + Date.now();
      await db.insert(doctors).values(data);
      return { success: true, id: data.id };
    } catch (e) {
      console.error('db:createDoctor error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:updateDoctor', async (event, { id, data }) => {
    try {
      await db.update(doctors).set(data).where(eq(doctors.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:updateDoctor error', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('db:deleteDoctor', async (event, id) => {
    try {
      await db.delete(doctors).where(eq(doctors.id, id));
      return { success: true };
    } catch (e) {
      console.error('db:deleteDoctor error', e);
      return { success: false, error: e.message };
    }
  });

  // --- Settings Handlers ---
  ipcMain.handle('db:getSettings', async () => {
    try {
      const allSettings = await db.select().from(settings).all();
      // Start with empty object
      const result = {};
      // Transform array to object { key: value }
      allSettings.forEach(item => {
        result[item.key] = item.value;
      });
      return result;
    } catch (e) {
      console.error('db:getSettings error', e);
      return {};
    }
  });

  ipcMain.handle('db:updateSettings', async (event, settingsData) => {
    try {
      // settingsData is expected to be { key: value, key2: value2 }
      const promises = Object.entries(settingsData).map(([key, value]) => {
        return db.insert(settings)
          .values({ key, value })
          .onConflictDoUpdate({
            target: settings.key,
            set: { value }
          });
      });
      
      await Promise.all(promises);
      return { success: true };
    } catch (e) {
      console.error('db:updateSettings error', e);
      return { success: false, error: e.message };
    }
  });

  return db;
}