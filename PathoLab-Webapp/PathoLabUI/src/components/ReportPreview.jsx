import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const AVAILABLE_FIELDS = [
    { id: 'patientName', label: 'Patient Name', example: 'Mr Dummy' },
    { id: 'ageSex', label: 'Age / Gender', example: '25 / Male' },
    { id: 'referredBy', label: 'Referred By', example: 'Self' },
    { id: 'phone', label: 'Phone No.', example: '9876543210' },
    { id: 'patientId', label: 'Patient ID', example: 'PN1' },
    { id: 'reportId', label: 'Report ID', example: 'RE2' },
    { id: 'collectionDate', label: 'Collection Date', example: '24/06/2023 09:17 PM' },
    { id: 'reportDate', label: 'Report Date', example: '24/06/2023 09:25 PM' }
];

const A4Page = ({
    children,
    reportFormat,
    patient,
    pageNumber,
    totalPages,
    isFirst = false,
    isLast = false,
    formatPatientValue,
    scale
}) => {
    return (
        <div
            className="bg-white shadow-2xl flex flex-col print:shadow-none print:m-0 mb-8 mx-auto print:mx-0 print:border-none print:w-[210mm] print:h-[297mm]"
            style={{
                width: '210mm',
                height: '297mm',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden',
                backgroundColor: 'white',
                position: 'relative'
            }}
        >
            {/* Header Section - Edge to Edge */}
            <div className="w-full relative shrink-0">
                {reportFormat.headerMode === 'image' && reportFormat.headerImage ? (
                    <img
                        src={reportFormat.headerImage}
                        alt="Header"
                        className="w-full object-cover block"
                        style={{ height: 'auto', maxHeight: '200px' }}
                    />
                ) : (
                    <div
                        className="border-b-2 border-gray-800 flex justify-between items-start pb-4 px-[40px] pt-[40px]"
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{reportFormat.headerText || 'LAB NAME'}</h1>
                            <p className="text-sm text-gray-500 mt-1">123, Medical Hub, Health City, NY 10001</p>
                        </div>
                        {reportFormat.headerImage && (
                            <img src={reportFormat.headerImage} alt="Logo" className="h-20 object-contain" />
                        )}
                    </div>
                )}
            </div>

            {/* Main Content Area - With individual margins */}
            <div
                className="flex-1 flex flex-col"
                style={{
                    paddingLeft: `${reportFormat.marginLeft || 40}px`,
                    paddingRight: `${reportFormat.marginRight || 40}px`,
                    paddingTop: `${reportFormat.marginTop || 40}px`,
                    paddingBottom: `${reportFormat.marginBottom || 40}px`
                }}
            >
                {/* Patient Details - Only on first page */}
                {isFirst && (
                    <div className="border border-gray-800 p-2 mb-4 bg-white relative z-10">
                        <div className="flex gap-4 text-xs font-semibold">
                            <div className="flex-1 space-y-1">
                                {['patientName', 'ageSex', 'referredBy', 'phone']
                                    .filter(id => (reportFormat.patientDetails || []).includes(id))
                                    .map(id => (
                                        <div key={id} className="flex">
                                            <span className="text-gray-700 w-24 shrink-0">{AVAILABLE_FIELDS.find(f => f.id === id).label}</span>
                                            <span className="mx-2">:</span>
                                            <span className="text-gray-900">{formatPatientValue(id)}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="flex-1 space-y-1">
                                {['patientId', 'reportId', 'collectionDate', 'reportDate']
                                    .filter(id => (reportFormat.patientDetails || []).includes(id))
                                    .map(id => (
                                        <div key={id} className="flex">
                                            <span className="text-gray-700 w-28 shrink-0">{AVAILABLE_FIELDS.find(f => f.id === id).label}</span>
                                            <span className="mx-2">:</span>
                                            <span className="text-gray-900">{formatPatientValue(id)}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>

                {/* Signatures - Only on last page */}
                {isLast && (
                    <div className="mt-8 mb-4">
                        <div className="flex justify-between items-end gap-4 flex-wrap">
                            {reportFormat.signatures?.map((sig) => (
                                <div key={sig.id} className="text-center min-w-[150px]">
                                    <div className="h-20 flex items-center justify-center mb-1">
                                        {sig.image ? (
                                            <img src={sig.image} alt={sig.name} className="h-full object-contain" />
                                        ) : (
                                            <p className="font-serif italic text-xl text-blue-900 opacity-50">{sig.name}</p>
                                        )}
                                    </div>
                                    <p className="font-bold text-sm text-gray-900">{sig.name}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{sig.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Page Numbering */}
                <div className="text-center border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Page {pageNumber} of {totalPages}</span>
                </div>
            </div>

            {/* Footer Section - Edge to Edge */}
            <div
                className="w-full mt-auto relative shrink-0 overflow-hidden"
            >
                {reportFormat.footerMode === 'image' && reportFormat.footerImage ? (
                    <img
                        src={reportFormat.footerImage}
                        alt="Footer"
                        className="w-full object-cover block"
                        style={{ height: 'auto', maxHeight: '120px' }}
                    />
                ) : (
                    <div
                        className="text-center text-[10px] text-gray-400 flex flex-col items-center gap-1 border-t pt-2 pb-4 px-[40px] bg-white"
                    >
                        <p className="font-medium">{reportFormat.footerText || "Report Generated Electronically"}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ReportPreview = ({
    settings,
    patient = null,
    results = [],
    isDraft = false
}) => {
    const [scale, setScale] = useState(0.55);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3));
    const handleResetZoom = () => setScale(0.55);

    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            setScale(prev => Math.min(Math.max(prev + delta, 0.3), 1.5));
        }
    };

    const formatPatientValue = (fieldId) => {
        if (!patient) return AVAILABLE_FIELDS.find(f => f.id === fieldId)?.example || '';

        switch (fieldId) {
            case 'patientName': return `${patient.designation} ${patient.patientName}`;
            case 'ageSex':
                const age = [
                    patient.ageYears ? `${patient.ageYears}Y` : null,
                    patient.ageMonths ? `${patient.ageMonths}M` : null
                ].filter(Boolean).join(' ') || '0Y';
                return `${age} / ${patient.gender || ''}`;
            case 'referredBy': return patient.referral || 'Self';
            case 'phone': return patient.phone || '';
            case 'patientId': return patient.id || '';
            case 'reportId': return isDraft ? 'DRAFT' : `R-${Date.now().toString().slice(-6)}`;
            case 'collectionDate': return `${patient.collectionDate} ${patient.collectionTime || ''}`;
            case 'reportDate': return new Date().toLocaleString();
            default: return '';
        }
    };

    const reportFormat = settings?.reportFormat || {};

    const pages = results.length > 0 ? results.map(test => [test]) : [[]];

    return (
        <div className="flex-1 relative flex flex-col h-full print:bg-white print:border-none print:shadow-none print:p-0 print:overflow-visible overflow-auto">
            {/* Toolbar */}
            <div className="absolute top-4 right-6 z-20 flex gap-2 bg-white/90 backdrop-blur shadow-sm p-1.5 rounded-lg border border-gray-200 no-print">
                <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Zoom Out">
                    <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono flex items-center px-1 min-w-[3rem] justify-center text-gray-500">
                    {Math.round(scale * 100)}%
                </span>
                <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Zoom In">
                    <ZoomIn className="w-5 h-5" />
                </button>
                <div className="w-px bg-gray-200 mx-1"></div>
                <button onClick={handleResetZoom} className="p-1 hover:bg-gray-100 rounded text-gray-600" title="Reset Zoom">
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Scrollable Container */}
            <div
                className="flex-1 px-12 pt-16 pb-4 custom-scrollbar relative bg-slate-50/50 print:p-0 print:overflow-visible flex flex-col items-center print:block print:w-[210mm]"
                onWheel={handleWheel}
                style={{ scrollBehavior: 'smooth' }}
            >
                {pages.map((pageResults, pIdx) => (
                    <div
                        key={pIdx}
                        className="report-page-wrapper print:m-0 shrink-0 mb-10 print:mb-0 print:static print:w-[210mm] print:h-[297mm]"
                        style={{
                            width: `calc(210mm * ${scale})`,
                            height: `calc(297mm * ${scale})`,
                            transition: 'width 0.2s, height 0.2s',
                            position: 'relative'
                        }}
                    >
                        <div
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'top center',
                                width: '210mm',
                                height: '297mm',
                                position: 'absolute',
                                left: '50%',
                                marginLeft: '-105mm'
                            }}
                            className="print:transform-none print:static print:m-0 print:w-[210mm] print:h-[297mm] print:block"
                        >
                            <A4Page
                                reportFormat={reportFormat}
                                patient={patient}
                                pageNumber={pIdx + 1}
                                totalPages={pages.length}
                                isFirst={true}
                                isLast={true}
                                formatPatientValue={formatPatientValue}
                                scale={1}
                            >
                                <div className="space-y-6">
                                    {pageResults.length > 0 ? (
                                        pageResults.map((testResult, idx) => (
                                            <div key={idx} className="space-y-4">
                                                <h2 className="text-center font-bold text-lg underline text-gray-800 uppercase">{testResult.testName}</h2>

                                                <table className="w-full text-sm border-collapse">
                                                    <thead>
                                                        <tr className="border-b-2 border-gray-800 font-bold text-gray-800">
                                                            <th className="text-left py-2 px-1">TEST DESCRIPTION</th>
                                                            <th className="text-center py-2 px-1">RESULT</th>
                                                            <th className="text-center py-2 px-1">UNIT</th>
                                                            <th className="text-right py-2 px-1">REFERENCE RANGE</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {testResult.parameters?.map((param, pIdx) => (
                                                            <tr key={pIdx} className="border-b border-gray-100">
                                                                <td className="py-2 px-1 text-gray-700">{param.name}</td>
                                                                <td className="py-2 px-1 text-center font-bold">{param.value || '---'}</td>
                                                                <td className="py-2 px-1 text-center text-gray-600">{param.unit}</td>
                                                                <td className="py-2 px-1 text-right text-gray-600 font-medium">{param.refRange}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                {testResult.interpretation && (
                                                    <div className="space-y-1">
                                                        <h3 className="font-bold text-gray-800 text-sm border-b pb-1 inline-block">Interpretation</h3>
                                                        <div
                                                            className="text-xs text-gray-600 leading-relaxed ql-editor !p-0"
                                                            dangerouslySetInnerHTML={{ __html: testResult.interpretation }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="border rounded bg-yellow-50 p-4 min-h-[200px] flex items-center justify-center text-gray-400 italic no-print">
                                            [Test Results Table Placeholder - Will be populated from Test Format]
                                        </div>
                                    )}

                                    {reportFormat.reportNote && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-700 border border-gray-100 italic">
                                            <strong>Note:</strong> {reportFormat.reportNote}
                                        </div>
                                    )}

                                    {reportFormat.showEndMarker && (
                                        <div className="mt-4 text-center">
                                            <p className="text-xs font-bold text-gray-400 tracking-widest">~~~~~~ END OF REPORT ~~~~~~</p>
                                        </div>
                                    )}
                                </div>
                            </A4Page>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ReportPreview;
