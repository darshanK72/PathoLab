import React from 'react';

const AVAILABLE_FIELDS = [
    { id: 'patientName', label: 'Patient Name' },
    { id: 'ageSex', label: 'Age / Gender' },
    { id: 'referredBy', label: 'Referred By' },
    { id: 'phone', label: 'Phone No.' },
    { id: 'patientId', label: 'Patient ID' },
    { id: 'reportId', label: 'Report ID' },
    { id: 'collectionDate', label: 'Collection Date' },
    { id: 'reportDate', label: 'Report Date' }
];

const A4Page = ({
    children,
    reportFormat,
    pageNumber,
    totalPages,
    isFirst = false,
    isLast = false,
    formatPatientValue,
}) => {
    return (
        <div
            className="bg-white flex flex-col print:shadow-none print:m-0 mx-auto print:mx-0 print:border-none print:w-[210mm] print:h-[297mm] report-a4-sheet border border-gray-100 print:border-none"
            style={{
                width: '210mm',
                height: '297mm',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden',
                backgroundColor: 'white',
                position: 'relative',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
            }}
        >
            {/* Header Section */}
            <div className="w-full relative shrink-0">
                {reportFormat.headerMode === 'image' && reportFormat.headerImage ? (
                    <img
                        src={reportFormat.headerImage}
                        alt="Header"
                        className="w-full object-cover block"
                        style={{ height: 'auto', maxHeight: '200px' }}
                    />
                ) : (
                    <div className="border-b-2 border-gray-800 flex justify-between items-start pb-4 px-[40px] pt-[40px]">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{reportFormat.headerText || 'LAB NAME'}</h1>
                            <p className="text-sm text-gray-500 mt-1">Laboratory Report</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div
                className="flex-1 flex flex-col"
                style={{
                    paddingLeft: `${reportFormat.marginLeft || 40}px`,
                    paddingRight: `${reportFormat.marginRight || 40}px`,
                    paddingTop: `${reportFormat.marginTop || 20}px`,
                    paddingBottom: `${reportFormat.marginBottom || 40}px`
                }}
            >
                {/* Patient Details */}
                {isFirst && (
                    <div className="border border-gray-800 p-3 mb-6 bg-white relative z-10">
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                            <div className="space-y-1">
                                {['patientName', 'ageSex', 'referredBy', 'phone']
                                    .filter(id => (reportFormat.patientDetails || []).includes(id))
                                    .map(id => (
                                        <div key={id} className="flex">
                                            <span className="text-gray-700 w-24 shrink-0 uppercase text-[9px] tracking-wider">{AVAILABLE_FIELDS.find(f => f.id === id).label}</span>
                                            <span className="mx-2">:</span>
                                            <span className="text-gray-900 font-bold">{formatPatientValue(id)}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="space-y-1">
                                {['patientId', 'reportId', 'collectionDate', 'reportDate']
                                    .filter(id => (reportFormat.patientDetails || []).includes(id))
                                    .map(id => (
                                        <div key={id} className="flex">
                                            <span className="text-gray-700 w-28 shrink-0 uppercase text-[9px] tracking-wider">{AVAILABLE_FIELDS.find(f => f.id === id).label}</span>
                                            <span className="mx-2">:</span>
                                            <span className="text-gray-900 font-bold">{formatPatientValue(id)}</span>
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

                {/* Signatures */}
                {isLast && reportFormat.signatures && reportFormat.signatures.length > 0 && (
                    <div className="mt-auto mb-2 pt-2">
                        <div className="flex justify-between items-end gap-10 flex-wrap px-4">
                            {reportFormat.signatures.map((sig) => (
                                <div key={sig.id} className="text-center" style={{ minWidth: '35mm', maxWidth: '45mm' }}>
                                    <div className="flex items-center justify-center mb-1 overflow-hidden" style={{ height: '14mm' }}>
                                        {sig.image ? (
                                            <img
                                                src={sig.image}
                                                alt={sig.name}
                                                className="object-contain"
                                                style={{ maxHeight: '14mm', maxWidth: '40mm', height: 'auto', width: 'auto' }}
                                            />
                                        ) : (
                                            <p className="font-serif italic text-lg text-blue-900 opacity-50">{sig.name}</p>
                                        )}
                                    </div>
                                    <p className="font-bold text-[12px] text-gray-900 leading-tight">{sig.name}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{sig.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Meta */}
                <div className="text-center mt-2 opacity-40 flex justify-between items-center px-4">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Printed: {new Date().toLocaleString()}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Page {pageNumber} of {totalPages}</span>
                </div>
            </div>

            {/* Footer Graphics - Relative flex item to prevent overlap */}
            <div className="w-full relative shrink-0">
                {reportFormat.footerMode === 'image' && reportFormat.footerImage ? (
                    <img
                        src={reportFormat.footerImage}
                        alt="Footer"
                        className="w-full object-cover block"
                        style={{ height: 'auto', maxHeight: '120px' }}
                    />
                ) : (
                    <div className="text-center text-[9px] text-gray-400 py-4 border-t border-gray-100 bg-white">
                        <p>{reportFormat.footerText || "Report Generated Electronically - No Signature Required"}</p>
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
    const formatPatientValue = (fieldId) => {
        if (!patient) return '';

        switch (fieldId) {
            case 'patientName': return `${patient.designation} ${patient.patientName}`;
            case 'ageSex': {
                const age = [
                    patient.ageYears ? `${patient.ageYears}Y` : null,
                    patient.ageMonths ? `${patient.ageMonths}M` : null
                ].filter(Boolean).join(' ') || '0Y';
                return `${age} / ${patient.gender || ''}`;
            }
            case 'referredBy': return patient.referral || 'Self';
            case 'phone': return patient.phone || '';
            case 'patientId': return patient.id || '';
            case 'reportId': return isDraft ? 'DRAFT' : 'RE-' + patient.id?.slice(-4);
            case 'collectionDate': return `${patient.collectionDate} ${patient.collectionTime || ''}`;
            case 'reportDate': return new Date().toLocaleDateString();
            default: return '';
        }
    };

    const reportFormat = settings?.reportFormat || {};
    const pages = results.length > 0 ? results.map(test => [test]) : [[]];

    return (
        <div className="flex-1 flex flex-col items-center bg-gray-100 print:bg-white overflow-y-auto no-scrollbar print:overflow-visible">
            <div className="py-12 print:p-0 flex flex-col gap-8">
                {pages.map((pageResults, pIdx) => (
                    <div key={pIdx} className="print:m-0 print:static print:w-[210mm] print:h-[297mm] shadow-2xl print:shadow-none">
                        <A4Page
                            reportFormat={reportFormat}
                            pageNumber={pIdx + 1}
                            totalPages={pages.length}
                            isFirst={true}
                            isLast={true}
                            formatPatientValue={formatPatientValue}
                        >
                            <div className="space-y-6 px-2">
                                {pageResults.map((testResult, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <h2 className="text-center font-bold text-lg underline text-gray-800 uppercase tracking-tight">{testResult.testName}</h2>

                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-gray-800 font-bold text-gray-800 text-[11px]">
                                                    <th className="text-left py-2 px-1">TEST DESCRIPTION</th>
                                                    {testResult.columns?.filter(c => !['name', 'unit', 'refRange', 'value'].includes(c.id)).map(col => (
                                                        <th key={col.id} className="text-center py-2 px-1 uppercase">{col.label}</th>
                                                    ))}
                                                    <th className="text-center py-2 px-1">RESULT</th>
                                                    <th className="text-center py-2 px-1">IND</th>
                                                    <th className="text-center py-2 px-1">UNIT</th>
                                                    <th className="text-right py-2 px-1">REFERENCE RANGE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {testResult.parameters?.map((param, pIdx) => (
                                                    <tr key={pIdx}>
                                                        <td className="py-2 px-1 text-gray-700 font-medium text-[12px]">{param.name}</td>
                                                        {testResult.columns?.filter(c => !['name', 'unit', 'refRange', 'value'].includes(c.id)).map(col => (
                                                            <td key={col.id} className="py-2 px-1 text-center text-gray-600 font-medium text-[11px] italic">{param[col.id] || '-'}</td>
                                                        ))}
                                                        <td className="py-2 px-1 text-center font-black text-gray-900">{param.value || '---'}</td>
                                                        <td className={`py-2 px-1 text-center font-black text-[11px] ${param.indicator === 'H' || param.indicator === 'L' ? 'text-red-600' : 'text-gray-400'
                                                            }`}>{param.indicator || ''}</td>
                                                        <td className="py-2 px-1 text-center text-gray-600 text-[11px] italic font-bold">{param.unit}</td>
                                                        <td className="py-2 px-1 text-right text-gray-600 font-bold text-[11px]">{param.refRange}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {testResult.interpretation && (
                                            <div className="space-y-1 mt-4">
                                                <h3 className="font-bold text-gray-800 text-xs border-b pb-1 inline-block uppercase tracking-wider">Interpretation</h3>
                                                <div
                                                    className="text-[11px] text-gray-600 leading-relaxed italic"
                                                    dangerouslySetInnerHTML={{ __html: testResult.interpretation }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {reportFormat.reportNote && (
                                    <div className="mt-8 p-3 bg-gray-50 border border-gray-100 rounded-lg text-[10px] text-gray-600 italic">
                                        <span className="font-black uppercase tracking-tighter mr-2 text-gray-400">Note:</span>
                                        {reportFormat.reportNote}
                                    </div>
                                )}

                                {reportFormat.showEndMarker && (
                                    <div className="mt-12 text-center">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">~~~ End of Report ~~~</p>
                                    </div>
                                )}
                            </div>
                        </A4Page>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportPreview;
