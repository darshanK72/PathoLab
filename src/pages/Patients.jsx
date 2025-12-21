import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    FlaskConical,
    FileText
} from 'lucide-react';

import { api } from '../lib/api';

const Patients = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch patients on mount
    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setLoading(true);
            const data = await api.getPatients();
            // Sort by ID desc or latest
            setPatients(data.reverse());
        } catch (err) {
            setError('Failed to load patients. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm) ||
        patient.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.deletePatient(id);
                setPatients(patients.filter(p => p.id !== id));
            } catch (err) {
                alert('Failed to delete patient');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-500 text-sm">Manage your patient records</p>
                </div>
                <button
                    onClick={() => navigate('/patient-entry')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add New Patient
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <p>{error}</p>
                    <button onClick={loadPatients} className="text-sm underline hover:text-red-800">Retry</button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Name, ID, or Phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Placeholder for more filters if needed */}
            </div>

            {/* Patients List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4">Patient ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Age / Gender</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Last Visit</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{patient.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{patient.designation} {patient.patientName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{patient.ageYears} Y / {patient.gender}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{patient.phone || '-'}</div>
                                            <div className="text-xs text-gray-500">{patient.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{patient.collectionDate || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">

                                                <button
                                                    title="Create Case"
                                                    onClick={() => navigate('/case-entry')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <FlaskConical className="w-4 h-4" />
                                                </button>

                                                <button
                                                    title="Edit"
                                                    onClick={() => navigate('/patient-entry', { state: { patient } })}
                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDelete(patient.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="w-8 h-8 text-gray-300" />
                                            <p>No patients found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Static) */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {filteredPatients.length} of {patients.length} patients</span>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 rounded border border-gray-200 bg-white disabled:opacity-50">Previous</button>
                        <button disabled className="px-3 py-1 rounded border border-gray-200 bg-white disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patients;
