import path from 'path';
import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';
import bcrypt from 'bcryptjs';

let db;

export function initDb(userDataPath) {
  try {
    const dbPath = path.join(userDataPath, 'database.db');
    console.log(`Initializing database at: ${dbPath}`);
    
    // Ensure directory exists? Electron usually ensures userData exists.
    
    // Fix for production build (asar)
    let options = {};
    if (app.isPackaged) {
      options.nativeBinding = path.join(
        process.resourcesPath,
        'app.asar.unpacked',
        'node_modules',
        'better-sqlite3',
        'build',
        'Release',
        'better_sqlite3.node'
      );
    }

    const sqlite = new Database(dbPath, options);
    sqlite.pragma('journal_mode = WAL');
    
    db = drizzle(sqlite, { schema });
    
    initializeTables(sqlite);
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

function initializeTables(sqlite) {
  // Manual migration / table creation statements matching the schema
  // This replaces the obfuscated string concatenation
  
  const queries = [
    `CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      designation TEXT,
      patient_name TEXT NOT NULL,
      age_years TEXT,
      age_months TEXT,
      age_days TEXT,
      gender TEXT,
      phone TEXT,
      email TEXT,
      collection_date TEXT,
      address TEXT,
      referral TEXT,
      sample_type TEXT,
      collection_time TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_name TEXT,
      referral TEXT,
      sample_type TEXT,
      collection_date TEXT,
      collection_time TEXT,
      date TEXT,
      status TEXT,
      tests TEXT,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );`,
    `CREATE TABLE IF NOT EXISTS tests_master (
      id TEXT PRIMARY KEY,
      test_name TEXT NOT NULL,
      price INTEGER,
      department TEXT,
      parameters TEXT,
      columns TEXT,
      interpretation TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT,
      specialization TEXT,
      phone TEXT,
      email TEXT,
      address TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const query of queries) {
    sqlite.exec(query);
  }
  
  // Seed initial admin if not exists
  seedInitialAdmin(sqlite);
}

function seedInitialAdmin(sqlite) {
  try {
    const result = sqlite.prepare("SELECT COUNT(*) as count FROM users").get();
    if (result.count === 0) {
      console.log('Seeding initial admin user...');
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin@123', salt);
      const id = 'USER-' + Date.now();
      
      sqlite.prepare("INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)").run(
        id, 'admin', hash, 'Admin'
      );
      console.log('Default admin user created: admin / admin@123');
    }
  } catch (error) {
    console.error('Failed to seed admin:', error);
  }
}

export { db };