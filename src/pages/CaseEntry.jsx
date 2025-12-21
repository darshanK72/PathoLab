import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Users } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

const CaseEntry = () => {
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState('');

    // Mock patient data for the dropdown
    const patientOptions = [
        { value: 'p1', label: 'John Doe (35/M) - 9876543210' },
        { value: 'p2', label: 'Jane Smith (28/F) - 9876543211' },
        { value: 'p3', label: 'Robert Johnson (45/M) - 9876543212' },
    ];

    const handleCreateNewPatient = () => {
        navigate('/patient-entry');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 mt-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Create New Case</h1>
                <p className="text-gray-500">Select an existing patient or register a new one to start a case.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Existing Patient Selection */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 w-full">
                        <h2 className="text-xl font-semibold text-gray-800">Existing Patient</h2>
                        <div className="w-full text-left">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Search Patient</label>
                            <CustomDropdown
                                options={patientOptions}
                                value={selectedPatient}
                                onChange={setSelectedPatient}
                                placeholder="Search by name or mobile..."
                                searchable={true}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <button
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedPatient}
                    >
                        Proceed with Selected
                    </button>
                </div>

                {/* New Patient Creation */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">New Patient</h2>
                        <p className="text-sm text-gray-500">Register a new patient if they are not in the system.</p>
                    </div>
                    <div className="flex-1 w-full flex items-end">
                        <button
                            onClick={handleCreateNewPatient}
                            className="w-full py-2.5 bg-white border border-green-600 text-green-700 hover:bg-green-50 rounded-lg font-medium transition-colors"
                        >
                            Create New Patient
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseEntry;
