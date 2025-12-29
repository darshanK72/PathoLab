import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PatientEntry from './pages/patients/PatientEntry';
import CaseEntry from './pages/cases/CaseEntry';
import CaseDetails from './pages/cases/CaseDetails';
import Patients from './pages/patients/Patients';
import Tests from './pages/tests/Tests';
import TestEditor from './pages/tests/TestEditor';
import ReportView from './pages/reports/ReportView';
import Cases from './pages/cases/Cases';
import Doctors from './pages/doctors/Doctors';
import DoctorEntry from './pages/doctors/DoctorEntry';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import Activation from './pages/auth/Activation';
import { api } from './lib/api';
import './index.css';

const RequireActivation = ({ activated, children }) => {
  if (!activated) {
    return <Navigate to="/activate" replace />;
  }
  return children;
};

const RequireAuth = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // 1. Check License First
        const status = await api.checkLicenseStatus();
        setActivated(status.activated);

        // 2. Check Auth
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Initial check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm animate-pulse">Initializing Security Systems...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/activate" element={
          activated ? <Navigate to="/login" replace /> : <Activation onActivated={() => setActivated(true)} />
        } />

        <Route path="/login" element={
          <RequireActivation activated={activated}>
            <Login onLogin={setUser} />
          </RequireActivation>
        } />

        <Route path="/" element={
          <RequireActivation activated={activated}>
            <RequireAuth user={user}>
              <MainLayout user={user} onLogout={handleLogout} />
            </RequireAuth>
          </RequireActivation>
        }>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="cases" element={<Cases />} />
          <Route path="patient-entry" element={<PatientEntry />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctor-entry" element={<DoctorEntry />} />
          <Route path="case-entry" element={<CaseEntry />} />
          <Route path="case-details/:caseId" element={<CaseDetails />} />
          <Route path="report-view/:caseId" element={<ReportView />} />
          <Route path="tests" element={<Tests />} />
          <Route path="test-editor" element={<TestEditor />} />
          <Route path="settings" element={<Navigate to="settings/report" replace />} />
          <Route path="settings/:tab" element={<Settings user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
