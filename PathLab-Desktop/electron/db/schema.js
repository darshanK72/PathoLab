import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const patients = sqliteTable('patients', {
  id: text('id').primaryKey(),
  designation: text('designation'),
  patientName: text('patient_name').notNull(),
  ageYears: text('age_years'),
  ageMonths: text('age_months'),
  ageDays: text('age_days'),
  gender: text('gender'),
  phone: text('phone'),
  email: text('email'),
  collectionDate: text('collection_date'),
  address: text('address'),
  referral: text('referral'),
  sampleType: text('sample_type'),
  collectionTime: text('collection_time')
});

export const cases = sqliteTable('cases', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').references(() => patients.id),
  patientName: text('patient_name'),
  referral: text('referral'),
  sampleType: text('sample_type'),
  collectionDate: text('collection_date'),
  collectionTime: text('collection_time'),
  date: text('date'),
  status: text('status'),
  tests: text('tests', { mode: 'json' })
});

export const testsMaster = sqliteTable('tests_master', {
  id: text('id').primaryKey(),
  testName: text('test_name').notNull(),
  price: integer('price'),
  department: text('department'),
  parameters: text('parameters', { mode: 'json' }),
  columns: text('columns', { mode: 'json' }),
  interpretation: text('interpretation')
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' })
});

export const doctors = sqliteTable('doctors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type'),
  specialization: text('specialization'),
  phone: text('phone'),
  email: text('email'),
  address: text('address')
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP')
});