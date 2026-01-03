import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Building2,
    Stethoscope
} from 'lucide-react';

import { api } from '../../lib/api';
import Pagination from '../../components/common/Pagination';

const Doctors = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch doctors on mount
    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const data = await api.getDoctors();
            setDoctors(data.reverse());
        } catch (err) {
            setError('Failed to load doctors. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone?.includes(searchTerm) ||
        doctor.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Calculate pagination
    const paginatedDoctors = filteredDoctors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await api.deleteDoctor(id);
                setDoctors(doctors.filter(d => d.id !== id));
            } catch {
                alert('Failed to delete doctor');
            }
        }
    };

    return (
        <div className="p-10 mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
                    <p className="text-gray-500 text-sm">Manage Doctors, Clinics, and Hospitals</p>
                </div>
                <button
                    onClick={() => navigate('/doctor-entry')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Referral Source
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <p>{error}</p>
                    <button onClick={loadDoctors} className="text-sm underline hover:text-red-800">Retry</button>
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
                        placeholder="Search by Name, Type, Specialization or Phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Doctors List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Specialization</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedDoctors.length > 0 ? (
                                paginatedDoctors.map((doctor) => (
                                    <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                                    {doctor.type === 'Clinic' || doctor.type === 'Hospital' || doctor.type === 'Lab'
                                                        ? <Building2 className="w-4 h-4" />
                                                        : <Stethoscope className="w-4 h-4" />
                                                    }
                                                </div>
                                                <div className="font-medium text-gray-900">{doctor.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize text-gray-600">{doctor.type || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600">{doctor.specialization || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{doctor.phone || '-'}</div>
                                            <div className="text-xs text-gray-500">{doctor.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    title="Edit"
                                                    onClick={() => navigate('/doctor-entry', { state: { doctor } })}
                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDelete(doctor.id)}
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
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Stethoscope className="w-8 h-8 text-gray-300" />
                                            <p>No referrals found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    totalItems={filteredDoctors.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    );
};

export default Doctors;
