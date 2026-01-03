import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Building2, Stethoscope, Phone, Mail, MapPin } from 'lucide-react';
import { api } from '../../lib/api';
import CustomDropdown from '../../components/common/CustomDropdown';

const DoctorEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editDoctor = location.state?.doctor;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: editDoctor?.id || `DOC-${Date.now()}`,
        name: editDoctor?.name || '',
        type: editDoctor?.type || 'Doctor',
        specialization: editDoctor?.specialization || '',
        phone: editDoctor?.phone || '',
        email: editDoctor?.email || '',
        address: editDoctor?.address || '',
    });

    const typeOptions = [
        { value: 'Doctor', label: 'Individual Doctor' },
        { value: 'Clinic', label: 'Medical Clinic' },
        { value: 'Hospital', label: 'Hospital' },
        { value: 'Lab', label: 'Other Laboratory' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return alert('Name is required');

        try {
            setLoading(true);
            if (editDoctor) {
                await api.updateDoctor(editDoctor.id, formData);
            } else {
                await api.createDoctor(formData);
            }
            navigate('/doctors');
        } catch (err) {
            console.error(err);
            alert('Failed to save referral source');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {editDoctor ? 'Edit Referral Source' : 'New Referral Source'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {editDoctor ? 'Update details of the doctor, clinic or lab' : 'Add a new medical professional or facility to your master list'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg shadow-sm transition-all text-sm font-medium"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Record'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                        <h2 className="font-semibold text-gray-900 text-lg">Identity Details</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Type</label>
                                <CustomDropdown
                                    options={typeOptions}
                                    value={formData.type}
                                    onChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Record ID</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    disabled={!!editDoctor}
                                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm outline-none cursor-not-allowed text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Referral Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Dr. Jane Smith or City Hospital"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="e.g., Cardiologist, Multi-Specialty"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <h2 className="font-semibold text-gray-900 text-lg">Contact & Location</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contact@example.com"
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="1"
                                    placeholder="Enter clinic or hospital address..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DoctorEntry;
