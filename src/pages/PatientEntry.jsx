import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import CustomDropdown from '../components/CustomDropdown';

const PatientEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const existingPatient = location.state?.patient;
    const isEditMode = !!existingPatient;

    // State to manage form fields (optional for MVP UI demo but good practice)
    const [formData, setFormData] = useState(existingPatient || {
        designation: 'Mr.',
        patientName: '',
        ageYears: '',
        ageMonths: '',
        ageDays: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        referral: 'Self',
        sampleType: 'Blood',
        collectionDate: new Date().toISOString().split('T')[0],
        collectionTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
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
                // Generate a simple ID for now
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

    const referralOptions = [
        { value: 'Self', label: 'Self' },
        { value: 'Dr. Smith', label: 'Dr. Smith' },
        { value: 'City Hospital', label: 'City Hospital' },
        { value: 'Dr. A. Kumar', label: 'Dr. A. Kumar' },
    ];

    const sampleTypeOptions = [
        { value: 'Blood', label: 'Blood' },
        { value: 'Urine', label: 'Urine' },
        { value: 'Serum', label: 'Serum' },
        { value: 'Plasma', label: 'Plasma' },
        { value: 'Swab', label: 'Swab' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Patient Entry</h1>
                    <p className="text-gray-500 text-sm">Enter patient details and select tests.</p>
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

                        {/* Mobile Number - Span 4 */}
                        <div className="md:col-span-4 space-y-1">
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

                        {/* Email ID - Span 4 */}
                        <div className="md:col-span-4 space-y-1">
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

                        {/* Referral - Span 4 */}
                        <div className="md:col-span-4 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Referred By</label>
                            <CustomDropdown
                                options={referralOptions}
                                value={formData.referral}
                                onChange={(val) => handleDropdownChange('referral', val)}
                                searchable={true}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pt-2">
                        {/* Sample Collection Date */}
                        <div className="lg:col-span-4 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Collection Date</label>
                            <input
                                type="date"
                                name="collectionDate"
                                value={formData.collectionDate}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Sample Collection Time */}
                        <div className="lg:col-span-4 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Collection Time</label>
                            <input
                                type="time"
                                name="collectionTime"
                                value={formData.collectionTime}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Sample Type */}
                        <div className="lg:col-span-4 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Sample Type</label>
                            <CustomDropdown
                                options={sampleTypeOptions}
                                value={formData.sampleType}
                                onChange={(val) => handleDropdownChange('sampleType', val)}
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Test Selection Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Test Selection</h3>
                <div className="space-y-4">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for tests (e.g. CBC, Lipid Profile...)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="h-48 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <svg className="w-10 h-10 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <p className="text-sm">No tests selected yet. Search to add tests.</p>
                    </div>
                </div>
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
                    Save & Next
                </button>
            </div>
        </div>
    );
};

export default PatientEntry;
