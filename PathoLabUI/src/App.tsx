import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PatientForm from './pages/PatientForm';
import CBCReportForm from './pages/CBCReportForm';
import PatientsList from './pages/PatientsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="reports/cbc" element={<CBCReportForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;