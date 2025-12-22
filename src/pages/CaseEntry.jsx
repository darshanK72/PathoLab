import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, UserPlus, Users, Plus, Trash2, Calendar, Clock, Beaker, ClipboardList } from 'lucide-react';
import { api } from '../lib/api';
import CustomDropdown from '../components/CustomDropdown';

const CaseEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialPatient = location.state?.patientId || '';
    const [selectedPatient, setSelectedPatient] = useState(initialPatient);
    const [patients, setPatients] = useState([]);
    const [availableTests, setAvailableTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTests, setSelectedTests] = useState([]);

    const [caseData, setCaseData] = useState({
        referral: 'Self',
        sampleType: 'Blood',
        collectionDate: new Date().toISOString().split('T')[0],
        collectionTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [patientsData, testsData] = await Promise.all([
                    api.getPatients(),
                    api.getTests()
                ]);
                setPatients(patientsData);
                setAvailableTests(testsData);
            } catch (error) {
                console.error('Failed to load initial data', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const patientOptions = patients.map(p => ({
        value: p.id,
        label: `${p.patientName} (${p.ageYears}/${p.gender?.charAt(0)}) - ${p.phone}`
    }));

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

    const handleCaseInputChange = (e) => {
        const { name, value } = e.target;
        setCaseData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTest = (test) => {
        if (selectedTests.find(t => t.id === test.id)) return;
        setSelectedTests([...selectedTests, test]);
        setSearchQuery('');
    };

    const handleRemoveTest = (id) => {
        setSelectedTests(selectedTests.filter(t => t.id !== id));
    };

    const filteredTests = availableTests.filter(t =>
        t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateCase = async () => {
        try {
            const patient = patients.find(p => p.id === selectedPatient);
            const newCase = {
                id: `CASE-${Date.now().toString().slice(-6)}`,
                patientId: selectedPatient,
                patientName: patient?.patientName || '',
                ...caseData,
                tests: selectedTests.map(t => ({
                    id: t.id,
                    testName: t.testName,
                    parameters: t.parameters.map(p => ({ ...p, value: '' })),
                    interpretation: t.interpretation
                })),
                date: new Date().toISOString(),
                status: 'Draft'
            };

            const savedCase = await api.createCase(newCase);
            navigate(`/case-details/${savedCase.id}`);
        } catch (error) {
            console.error('Failed to create case', error);
            alert('Failed to create case');
        }
    };

    const handleCreateNewPatient = () => {
        navigate('/patient-entry');
    };

    return (
        <div className="p-10 mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Create New Case</h1>
                <p className="text-gray-500">Select an existing patient or register a new one to start a case.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Existing Patient Selection */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 w-full text-left">
                        <h2 className="text-xl text-center font-semibold text-gray-800">Existing Patient</h2>
                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Search Patient</label>
                            <CustomDropdown
                                options={patientOptions}
                                value={selectedPatient}
                                onChange={setSelectedPatient}
                                placeholder={loading ? "Loading patients..." : "Search by name or mobile..."}
                                searchable={true}
                                className="w-full"
                                disabled={loading}
                            />
                        </div>
                    </div>
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

            {/* Case Configuration Panel (Full Width if patient selected) */}
            <div className={`bg-white border border-gray-200 rounded-xl p-8 shadow-sm transition-all duration-300 ${selectedPatient ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Clinical Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <ClipboardList className="w-5 h-5 text-blue-600" /> Clinical Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Referred By</label>
                                <CustomDropdown
                                    options={referralOptions}
                                    value={caseData.referral}
                                    onChange={(val) => setCaseData(prev => ({ ...prev, referral: val }))}
                                    searchable={true}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Sample Type</label>
                                <CustomDropdown
                                    options={sampleTypeOptions}
                                    value={caseData.sampleType}
                                    onChange={(val) => setCaseData(prev => ({ ...prev, sampleType: val }))}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="collectionDate"
                                    value={caseData.collectionDate}
                                    onChange={handleCaseInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Time
                                </label>
                                <input
                                    type="time"
                                    name="collectionTime"
                                    value={caseData.collectionTime}
                                    onChange={handleCaseInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <Beaker className="w-5 h-5 text-blue-600" /> Select Tests
                        </h3>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tests..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {filteredTests.map(test => (
                                        <button
                                            key={test.id}
                                            onClick={() => handleAddTest(test)}
                                            className="w-full px-4 py-2 hover:bg-blue-50 text-left flex items-center justify-between border-b last:border-0"
                                        >
                                            <span className="text-sm font-medium">{test.testName}</span>
                                            <Plus className="w-4 h-4 text-blue-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {selectedTests.map(test => (
                                <div key={test.id} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border border-blue-100">
                                    {test.testName}
                                    <button onClick={() => handleRemoveTest(test.id)}>
                                        <Trash2 className="w-3 h-3 text-blue-400 hover:text-red-500" />
                                    </button>
                                </div>
                            ))}
                            {selectedTests.length === 0 && <p className="text-xs text-gray-400 italic">No tests selected yet</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t flex justify-end">
                    <button
                        onClick={handleCreateCase}
                        disabled={!selectedPatient || selectedTests.length === 0}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-3"
                    >
                        Create Case & Enter Results
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaseEntry;
