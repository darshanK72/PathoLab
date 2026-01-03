import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Trash2,
    Printer,
    Save,
    ArrowLeft,
    User,
    ClipboardList,
    Beaker,
    CheckCircle2,
    Calendar,
    Phone,
    Download
} from 'lucide-react';
import { api } from '../lib/api';
import ReportPreview from '../components/ReportPreview';

const CaseDetails = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const [currentCase, setCurrentCase] = useState(null);
    const [patient, setPatient] = useState(null);
    const [settings, setSettings] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        loadData();
    }, [caseId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const caseData = await api.getCase(caseId);
            const [patientData, settingsData] = await Promise.all([
                api.getPatient(caseData.patientId),
                api.getSettings()
            ]);

            setCurrentCase(caseData);
            setPatient(patientData);
            setSettings(settingsData);
            setSelectedTests(caseData.tests || []);
        } catch (error) {
            console.error('Failed to load data', error);
            alert('Error loading case details.');
        } finally {
            setLoading(false);
        }
    };

    const handleResultChange = (testId, paramIndex, value) => {
        setSelectedTests(selectedTests.map(test => {
            if (test.id === testId) {
                const updatedParams = [...test.parameters];
                updatedParams[paramIndex] = { ...updatedParams[paramIndex], value };
                return { ...test, parameters: updatedParams };
            }
            return test;
        }));
    };

    const handleSaveCase = async () => {
        try {
            setSaving(true);
            const updatedCase = {
                ...currentCase,
                tests: selectedTests,
                status: 'Draft' // Or keep current
            };
            await api.updateCase(caseId, updatedCase);
            alert('Case saved successfully!');
        } catch (error) {
            console.error('Failed to save case', error);
            alert('Failed to save case');
        } finally {
            setSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        try {
            if (!window.electronAPI) {
                alert('PDF generation is only available in the desktop application.');
                return;
            }

            setSaving(true);
            setIsPrinting(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const result = await window.electronAPI.saveReportAsPDF({
                patientName: patient?.patientName || 'Patient'
            });

            if (result.success) {
                alert(`PDF saved successfully to: ${result.path}`);
            }
        } catch (error) {
            console.error('Download failed', error);
            alert(`Download failed: ${error.message}`);
        } finally {
            setIsPrinting(false);
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const renderPrintView = () => {
        if (!isPrinting) return null;
        return createPortal(
            <div className="fixed inset-0 bg-white z-[99999] print-only-container">
                <ReportPreview
                    settings={settings}
                    patient={patient}
                    results={selectedTests}
                    isDraft={true}
                />
            </div>,
            document.body
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-50/50">
            {renderPrintView()}
            {/* Action Bar */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30 no-print action-bar">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/case-entry')}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">Result Entry</h1>
                        <p className="text-sm text-gray-500 mt-1">Case ID: {caseId} | Patient: {patient?.designation} {patient?.patientName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveCase}
                        disabled={saving || selectedTests.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Results'}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={saving || selectedTests.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-md shadow-emerald-500/20 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={selectedTests.length === 0}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md shadow-blue-500/20 disabled:opacity-50"
                    >
                        <Printer className="w-4 h-4" />
                        Print Report
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
                {/* Left Side: Editor */}
                <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col border-r border-gray-200 bg-white overflow-hidden no-print editor-section">
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                        {/* Patient Summary Card */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4" /> Patient Info
                            </h3>
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Mobile</p>
                                        <p className="text-sm font-semibold text-gray-900">{patient?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Age/Gender</p>
                                        <p className="text-sm font-semibold text-gray-900">{patient?.ageYears}Y / {patient?.gender}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Case Info Summary */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ClipboardList className="w-4 h-4" /> Case Details
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Referred By</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentCase?.referral}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Sample Type</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentCase?.sampleType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Collection Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentCase?.collectionDate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Collection Time</p>
                                    <p className="text-sm font-semibold text-gray-900">{currentCase?.collectionTime}</p>
                                </div>
                            </div>
                        </section>

                        {/* Test Result Forms */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Beaker className="w-4 h-4" /> Value Entry
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500">{selectedTests.length} TESTS</span>
                            </div>

                            {selectedTests.map((test) => (
                                <div key={test.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white animate-in slide-in-from-top-2">
                                    <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <h4 className="font-bold text-sm tracking-tight">{test.testName}</h4>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white space-y-4">
                                        {test.parameters.map((param, pIdx) => (
                                            <div key={pIdx} className="grid grid-cols-12 gap-3 items-center">
                                                <div className="col-span-5">
                                                    <p className="text-xs font-bold text-gray-700">{param.name}</p>
                                                    <p className="text-[10px] text-gray-400">Range: {param.refRange} {param.unit}</p>
                                                </div>
                                                <div className="col-span-7 relative">
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500/50 outline-none text-right font-bold text-gray-900"
                                                        placeholder="Enter value"
                                                        value={param.value}
                                                        onChange={(e) => handleResultChange(test.id, pIdx, e.target.value)}
                                                    />
                                                    <span className="absolute right-3 -top-2.5 px-1 bg-white text-[9px] font-bold text-gray-400">{param.unit}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>

                {/* Right Side: Report Preview - Workstation Canvas */}
                <div className="flex-1 overflow-hidden relative group print:overflow-visible print-only-container bg-gray-100">
                    <div className="h-full w-full bg-white border border-slate-200 shadow-xl relative overflow-hidden flex flex-col">
                        <ReportPreview
                            settings={settings}
                            patient={patient}
                            results={selectedTests}
                            isDraft={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseDetails;
