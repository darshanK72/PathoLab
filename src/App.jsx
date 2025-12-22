import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PatientEntry from './pages/PatientEntry';
import CaseEntry from './pages/CaseEntry';
import CaseDetails from './pages/CaseDetails';
import Patients from './pages/Patients';
import Tests from './pages/Tests';
import TestEditor from './pages/TestEditor';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patient-entry" element={<PatientEntry />} />
          <Route path="case-entry" element={<CaseEntry />} />
          <Route path="case-details/:caseId" element={<CaseDetails />} />
          <Route path="tests" element={<Tests />} />
          <Route path="test-editor" element={<TestEditor />} />
          <Route path="settings" element={<Navigate to="settings/report" replace />} />
          <Route path="settings/:tab" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
