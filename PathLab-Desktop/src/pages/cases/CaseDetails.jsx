import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    ArrowLeft,
    User,
    ClipboardList,
    Beaker,
    Calendar,
    Phone,
    FileText
} from 'lucide-react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import CustomDropdown from '../../components/common/CustomDropdown';
import * as math from 'mathjs';

const CaseDetails = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const [currentCase, setCurrentCase] = useState(null);
    const [patient, setPatient] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const caseData = await api.getCase(caseId);
                if (!caseData) {
                    throw new Error('Case not found');
                }
                const [patientData, allTestsMaster] = await Promise.all([
                    api.getPatient(caseData.patientId),
                    api.getTests()
                ]);

                // Ensure tests are an array (handle potential stringified JSON if driver didn't parse)
                const rawTests = typeof caseData.tests === 'string' ? JSON.parse(caseData.tests) : (caseData.tests || []);

                // We need to merge the master test data (like columns) with the case-specific test data (values)
                const initializedTests = rawTests.map(caseTest => {
                    const masterTest = allTestsMaster.find(t => t.id === caseTest.id);

                    // Map parameters to ensure we keep values but get updated metadata from master
                    const masterParams = masterTest?.parameters || [];
                    const caseParams = caseTest.parameters || [];

                    // Important: We want all parameters from master (in case new ones were added)
                    // but we want the VALUES from caseParams if they match.
                    const mergedParams = masterParams.map(mp => {
                        const cp = caseParams.find(p => p.name === mp.name);
                        return { ...mp, ...cp }; // cp values will overwrite mp defaults
                    });

                    // If for some reason master doesn't have it but case does, keep it? 
                    // Usually we only want master defined params.

                    return {
                        ...masterTest, // Get latest department, price, etc.
                        ...caseTest,   // Keep case-specific overrides
                        columns: masterTest?.columns || caseTest.columns,
                        parameters: mergedParams
                    };
                });

                setCurrentCase(caseData);
                setPatient(patientData);
                setSelectedTests(initializedTests);

                // Trigger initial calculations
                recalculateAllTests(initializedTests);
            } catch (error) {
                console.error('Failed to load data', error);
                alert('Error loading case details.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [caseId]);

    const evaluateExpression = (expr, context) => {
        try {
            if (!expr) return null;
            let processedExpr = expr;
            Object.keys(context).forEach(key => {
                const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\[${escapedKey}\\]`, 'g');
                processedExpr = processedExpr.replace(regex, context[key] || 0);
            });
            return math.evaluate(processedExpr);
        } catch (e) {
            return null;
        }
    };

    const getIndicator = (value, rangeMin, rangeMax, context) => {
        if (!value || isNaN(parseFloat(value))) return null;
        const min = rangeMin ? evaluateExpression(rangeMin, context) : null;
        const max = rangeMax ? evaluateExpression(rangeMax, context) : null;
        const numVal = parseFloat(value);
        if (min !== null && numVal < min) return 'L';
        if (max !== null && numVal > max) return 'H';
        if (min !== null || max !== null) return 'N';
        return null;
    };

    const recalculateAllTests = (tests) => {
        const updatedTests = tests.map(test => {
            let params = [...test.parameters];
            const context = {};
            params.forEach(p => { if (p.name) context[p.name] = p.value || 0; });

            params = params.map(p => {
                if (p.isCalculated && p.formula) {
                    const calced = evaluateExpression(p.formula, context);
                    const newValue = calced !== null ? String(Number(calced.toFixed(2))) : p.value;
                    if (p.name) context[p.name] = newValue;
                    return { ...p, value: newValue };
                }
                return p;
            });

            params = params.map(p => ({
                ...p,
                indicator: getIndicator(p.value, p.rangeMin, p.rangeMax, context)
            }));

            return { ...test, parameters: params };
        });
        setSelectedTests(updatedTests);
    };

    const handleResultChange = (testId, paramIndex, value) => {
        const newTests = selectedTests.map(test => {
            if (test.id === testId) {
                const newParams = [...test.parameters];
                newParams[paramIndex] = { ...newParams[paramIndex], value };
                return { ...test, parameters: newParams };
            }
            return test;
        });
        recalculateAllTests(newTests);
    };

    const handleSaveCase = async (isSilent = false) => {
        try {
            if (!isSilent) setSaving(true);
            // Exclude id from the data payload to avoid primary key update issues in some sqlite environments
            const { id, ...caseDataWithoutId } = currentCase;
            const updatedCaseData = {
                ...caseDataWithoutId,
                tests: selectedTests,
                status: currentCase.status || 'Draft'
            };

            await api.updateCase(caseId, updatedCaseData);
            if (!isSilent) alert('Case saved successfully!');
            return true;
        } catch (error) {
            console.error('Failed to save case', error);
            if (!isSilent) alert('Failed to save case');
            return false;
        } finally {
            if (!isSilent) setSaving(false);
        }
    };

    const handlePreviewReport = async () => {
        const saved = await handleSaveCase(true);
        if (saved) navigate(`/report-view/${caseId}`);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Header / Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/case-entry', {
                            state: {
                                caseId: caseId,
                                patientId: currentCase?.patientId,
                                referral: currentCase?.referral,
                                sampleType: currentCase?.sampleType,
                                selectedTests: selectedTests
                            }
                        })}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">Result Entry</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Case: <span className="font-bold text-gray-700">{caseId}</span> | Patient: <span className="font-bold text-blue-600">{patient?.designation} {patient?.patientName}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleSaveCase()}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Progress'}
                    </button>
                    <button
                        onClick={handlePreviewReport}
                        className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/20"
                    >
                        <FileText className="w-4 h-4" />
                        Preview Report
                    </button>
                </div>
            </div>

            <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" /> Patient Details
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Mobile</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><Phone className="w-3 h-3 text-blue-400" /> {patient?.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Age/Gender</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-3 h-3 text-blue-400" /> {patient?.ageYears}Y / {patient?.gender}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sample Type</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><Beaker className="w-3 h-3 text-blue-400" /> {currentCase?.sampleType}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm shadow-blue-500/5">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" /> Case Overview
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-xl">
                                <span className="text-[10px] text-blue-900/40 font-black uppercase tracking-widest">Status</span>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-[0.1em] shadow-sm">
                                    {currentCase?.status || 'Draft'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Referred By</span>
                                <span className="text-sm font-black text-gray-900">{currentCase?.referral}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Table Section */}
                <div className="space-y-8 pb-20">
                    {selectedTests.map((test) => (
                        <div key={test.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Test Header */}
                            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                        <Beaker className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-slate-900 font-black tracking-tight uppercase text-sm">{test.testName}</h2>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-gray-200">{test.parameters?.length || 0} Parameters</span>
                            </div>

                            {/* Detailed Entry Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Parameter Name</th>
                                            {/* Dynamic Columns from Master */}
                                            {test.columns?.filter(c => !['name', 'unit', 'refRange', 'value'].includes(c.id)).map(col => (
                                                <th key={col.id} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{col.label}</th>
                                            ))}
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right" style={{ width: '180px' }}>Value</th>
                                            <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ind</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference Range</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {test.parameters?.map((param, pIdx) => (
                                            <tr key={pIdx} className={`group hover:bg-blue-50/30 transition-colors ${param.isCalculated ? 'bg-blue-50/10' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-gray-800">{param.name}</p>
                                                </td>
                                                {/* Dynamic Values */}
                                                {test.columns?.filter(c => !['name', 'unit', 'refRange', 'value'].includes(c.id)).map(col => (
                                                    <td key={col.id} className="px-6 py-4 text-sm text-gray-500 font-medium">{param[col.id] || '-'}</td>
                                                ))}
                                                <td className="px-6 py-4">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            className={`w-full px-4 py-2 border rounded-xl text-sm font-black transition-all text-right outline-none focus:ring-2 ${param.isCalculated
                                                                ? 'bg-blue-50 border-blue-100 text-blue-900 cursor-not-allowed focus:ring-blue-200'
                                                                : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500/20 hover:border-blue-300'
                                                                }`}
                                                            placeholder={param.isCalculated ? 'FX' : '--'}
                                                            value={param.value || ''}
                                                            readOnly={param.isCalculated}
                                                            onChange={(e) => handleResultChange(test.id, pIdx, e.target.value)}
                                                        />
                                                        {param.isCalculated && (
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400 uppercase tracking-tighter">Calc</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {param.indicator && (
                                                        <div className={`w-8 h-8 flex items-center justify-center mx-auto rounded-lg font-black text-xs shadow-sm transition-all duration-300 ${param.indicator === 'H' ? 'bg-red-500 text-white animate-in zoom-in-50' :
                                                            param.indicator === 'L' ? 'bg-orange-500 text-white animate-in zoom-in-50' :
                                                                'bg-emerald-500 text-white opacity-80'
                                                            }`}>
                                                            {param.indicator}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-gray-400 italic">{param.unit}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                                        {param.refRange}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Optional Interpretation Field */}
                            {test.interpretation && (
                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Interpretation Note
                                    </h5>
                                    <p className="text-xs text-gray-600 leading-relaxed italic">{test.interpretation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CaseDetails;
