import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    FileText,
    ClipboardList,
    Filter,
    ArrowRight
} from 'lucide-react';

import { api } from '../../lib/api';
import Pagination from '../../components/common/Pagination';

const Cases = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch cases on mount
    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
        try {
            setLoading(true);
            const data = await api.getCases();
            // Sort by Date desc (latest first)
            setCases(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            setError('Failed to load cases. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this case? This will remove all associated results.')) {
            try {
                await api.deleteCase(id);
                setCases(cases.filter(c => c.id !== id));
            } catch (err) {
                alert('Failed to delete case');
            }
        }
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch =
            c.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const paginatedCases = filteredCases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'draft':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-10 mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                        <ClipboardList className="w-7 h-7 text-blue-600" /> Cases Management
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Monitor and manage all lab report cases</p>
                </div>
                <button
                    onClick={() => navigate('/case-entry')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm font-black uppercase tracking-wider"
                >
                    <Plus className="w-4 h-4" />
                    New Case
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in transition-all">
                    <p className="font-bold text-sm">{error}</p>
                    <button onClick={loadCases} className="text-sm underline font-black hover:text-red-800 uppercase tracking-widest">Retry</button>
                </div>
            )}

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Patient Name or Case ID..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-1">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        className="bg-transparent text-sm font-bold text-gray-600 focus:outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Draft">Draft</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">Case ID</th>
                                <th className="px-6 py-4">Patient Name</th>
                                <th className="px-6 py-4">Referral</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex justify-center flex-col items-center gap-2 text-gray-400">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Loading Records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedCases.length > 0 ? (
                                paginatedCases.map((caseItem) => (
                                    <tr key={caseItem.id} className="hover:bg-blue-50/20 transition-colors group border-transparent">
                                        <td className="px-6 py-4 font-black text-blue-600 text-xs">#{caseItem.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{caseItem.patientName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-bold text-xs">{caseItem.referral || 'Self'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(caseItem.status)}`}>
                                                    {caseItem.status || 'Draft'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium text-xs">
                                            {new Date(caseItem.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    title="Edit Results"
                                                    onClick={() => navigate(`/case-details/${caseItem.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    title="Preview Report"
                                                    onClick={() => navigate(`/report-view/${caseItem.id}`)}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-transparent hover:border-emerald-100"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>

                                                <button
                                                    title="Delete Case"
                                                    onClick={() => handleDelete(caseItem.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400 bg-gray-50/20">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <ClipboardList className="w-6 h-6 text-gray-300" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-900">No cases found</p>
                                                <p className="text-xs font-medium">Try adjusting your filters or create a new case</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    totalItems={filteredCases.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    );
};

export default Cases;
