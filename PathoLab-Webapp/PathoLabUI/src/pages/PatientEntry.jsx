import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import CustomDropdown from '../components/CustomDropdown';

const PatientEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const existingPatient = location.state?.patient;
    const isEditMode = !!existingPatient;

    // State to manage form fields
    const [formData, setFormData] = useState(existingPatient || {
        designation: 'Mr.',
        patientName: '',
        ageYears: '',
        ageMonths: '',
        ageDays: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.patientName) {
                alert('Patient Name is required');
                return;
            }

            if (isEditMode) {
                await api.updatePatient(existingPatient.id, formData);
            } else {
                const newPatient = {
                    id: `P${Date.now().toString().slice(-4)}`,
                    ...formData
                };
                await api.createPatient(newPatient);
            }

            navigate('/patients');
        } catch (error) {
            console.error(error);
            alert(`Failed to ${isEditMode ? 'update' : 'save'} patient`);
        }
    };

    const designationOptions = [
        { value: 'Mr.', label: 'Mr.' },
        { value: 'Mrs.', label: 'Mrs.' },
        { value: 'Ms.', label: 'Ms.' },
        { value: 'Dr.', label: 'Dr.' },
        { value: 'Master', label: 'Master' },
        { value: 'Baby', label: 'Baby' },
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    return (
        <div className="p-10 mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Patient' : 'New Patient Entry'}</h1>
                    <p className="text-gray-500 text-sm">Enter basic patient information.</p>
                </div>
            </div>

            {/* Patient Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Patient Details</h3>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Patient Name & Designation - Span 5 */}
                        <div className="md:col-span-5 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Patient Name <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <div className="w-24">
                                    <CustomDropdown
                                        options={designationOptions}
                                        value={formData.designation}
                                        onChange={(val) => handleDropdownChange('designation', val)}
                                        className="w-full"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        {/* Age - Span 4 */}
                        <div className="md:col-span-4 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Age <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="number"
                                        name="ageYears"
                                        value={formData.ageYears}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Yrs"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        name="ageMonths"
                                        value={formData.ageMonths}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Mths"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        name="ageDays"
                                        value={formData.ageDays}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Days"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gender - Span 3 */}
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <CustomDropdown
                                options={genderOptions}
                                value={formData.gender}
                                onChange={(val) => handleDropdownChange('gender', val)}
                            />
                        </div>

                        {/* Mobile Number - Span 6 */}
                        <div className="md:col-span-6 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                                placeholder="Enter mobile number"
                            />
                        </div>

                        {/* Email ID - Span 6 */}
                        <div className="md:col-span-6 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Address - Span 12 (Full Width) */}
                        <div className="md:col-span-12 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder:text-gray-400"
                                placeholder="Enter patient address"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/patients')}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors text-sm"
                >
                    {isEditMode ? 'Update Patient' : 'Save Patient'}
                </button>
            </div>
        </div>
    );
};

export default PatientEntry;
