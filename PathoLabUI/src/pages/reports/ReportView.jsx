import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Download,
    Edit3,
    CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/api';
import ReportPreview from '../../components/reports/ReportPreview';

const ReportView = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();

    const [currentCase, setCurrentCase] = useState(null);
    const [patient, setPatient] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [caseData, settingsData] = await Promise.all([
                    api.getCase(caseId),
                    api.getSettings()
                ]);
                const patientData = await api.getPatient(caseData.patientId);

                setCurrentCase(caseData);
                setPatient(patientData);
                setSettings(settingsData);
            } catch (error) {
                console.error('Failed to load data', error);
                alert('Error loading report preview.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [caseId]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        alert('PDF generation is handled via the Print option in the web version. Please use "Print Report" and select "Save as PDF".');
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col print:bg-white print:block">
            {/* Header / Action Bar */}
            <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50 no-print">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(`/case-details/${caseId}`)}
                        className="group flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-all font-bold"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to Editor</span>
                    </button>
                    <div className="h-8 w-px bg-gray-100" />
                    <div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <h1 className="text-sm font-black text-gray-800 uppercase tracking-widest">Report Workstation</h1>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Patient: {patient?.designation} {patient?.patientName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/case-details/${caseId}`)}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <Edit3 className="w-4 h-4 inline-block mr-2" />
                        Modify Results
                    </button>
                    <div className="h-8 w-px bg-gray-100 mx-2" />
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-black transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-gray-200"
                    >
                        <Download className="w-4 h-4" />
                        Save as PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                    >
                        <Printer className="w-4 h-4" />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Main Preview Container */}
            <div className="flex-1 bg-gray-100 flex justify-center print:bg-white print:block print:p-0">
                <ReportPreview
                    settings={settings}
                    patient={patient}
                    results={currentCase?.tests || []}
                    isDraft={false}
                />
            </div>

            <style>
                {`
                @media print {
                    @page {
                        margin: 0;
                        size: A4;
                    }
                    .no-print { display: none !important; }
                    body, html { 
                        overflow: visible !important; 
                        height: auto !important;
                        background: white !important;
                    }
                    .min-h-screen { 
                        min-height: 0 !important; 
                        height: auto !important; 
                        background: white !important;
                        display: block !important;
                    }
                    /* Ensure containers don't clip content */
                    .flex-1, div { 
                        overflow: visible !important; 
                        height: auto !important;
                        max-height: none !important;
                    }
                    /* Reset workstation theme for print */
                    .bg-gray-100 { background: white !important; }
                    
                    /* Force colors */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
                
                /* Hide scrollbars for workstation look */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </div>
    );
};

export default ReportView;
