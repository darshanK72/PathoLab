import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, Plus, PenTool } from 'lucide-react';
import ReportPreview from './ReportPreview';

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

const ReportFormatSettings = ({ settings, onUpdate }) => {
    const [localSettings, setLocalSettings] = useState(settings?.reportFormat || {
        headerText: '',
        headerImage: null,
        headerMode: 'text',
        footerText: '',
        showSignature: true,
        signatures: [],
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 40,
        marginRight: 40,
        footerImage: null,
        footerMode: 'text',
        patientDetails: ['patientName', 'ageSex', 'referredBy', 'phone', 'patientId', 'reportId', 'collectionDate', 'reportDate'], // Default enabled fields
        reportNote: 'This is an electronically generated report.',
        showEndMarker: true
    });

    const handleChange = (field, value) => {
        const updated = { ...localSettings, [field]: value };
        setLocalSettings(updated);
    };

    const handleSaveClick = () => {
        onUpdate({ ...settings, reportFormat: localSettings });
        alert('Report format settings saved successfully!');
    };

    const togglePatientField = (fieldId) => {
        const current = localSettings.patientDetails || [];
        const updated = current.includes(fieldId)
            ? current.filter(id => id !== fieldId)
            : [...current, fieldId];
        handleChange('patientDetails', updated);
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange(field, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addSignature = () => {
        const newSig = {
            id: Date.now(),
            name: 'New Doctor',
            role: 'Pathologist',
            image: null
        };
        const updatedSigs = [...(localSettings.signatures || []), newSig];
        handleChange('signatures', updatedSigs);
    };

    const updateSignature = (id, field, value) => {
        const updatedSigs = localSettings.signatures.map(sig =>
            sig.id === id ? { ...sig, [field]: value } : sig
        );
        handleChange('signatures', updatedSigs);
    };

    const removeSignature = (id) => {
        const updatedSigs = localSettings.signatures.filter(sig => sig.id !== id);
        handleChange('signatures', updatedSigs);
    };

    return (
        <div className="flex gap-10 h-full overflow-hidden">
            {/* Editor Panel */}
            <div className="w-[500px] shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Header Configuration</h3>

                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => handleChange('headerMode', 'text')}
                            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-all ${localSettings.headerMode !== 'image' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Text & Logo
                        </button>
                        <button
                            onClick={() => handleChange('headerMode', 'image')}
                            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-all ${localSettings.headerMode === 'image' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Full Image
                        </button>
                    </div>

                    {localSettings.headerMode === 'image' ? (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Full Header Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                {localSettings.headerImage ? (
                                    <div className="relative w-full aspect-[4/1] mb-4">
                                        <img src={localSettings.headerImage} alt="Header" className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => handleChange('headerImage', null)}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-gray-500">Upload header image (Letterhead)</p>
                                    </div>
                                )}
                                <label className="block w-full">
                                    <span className="sr-only">Choose file</span>
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'headerImage')} className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer
                                "/>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Lab Name / Header Text</label>
                                <input
                                    type="text"
                                    value={localSettings.headerText}
                                    onChange={(e) => handleChange('headerText', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Header Logo</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                        {localSettings.headerImage ? (
                                            <img src={localSettings.headerImage} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="flex-1">
                                        <span className="sr-only">Choose file</span>
                                        <input type="file" onChange={(e) => handleImageUpload(e, 'headerImage')} className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-xs file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100
                                    "/>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Page Margins (px)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="text-xs text-gray-500">Top</span>
                                <input
                                    type="number"
                                    value={localSettings.marginTop || 40}
                                    onChange={(e) => handleChange('marginTop', Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Bottom</span>
                                <input
                                    type="number"
                                    value={localSettings.marginBottom || 40}
                                    onChange={(e) => handleChange('marginBottom', Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Left</span>
                                <input
                                    type="number"
                                    value={localSettings.marginLeft || 40}
                                    onChange={(e) => handleChange('marginLeft', Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Right</span>
                                <input
                                    type="number"
                                    value={localSettings.marginRight || 40}
                                    onChange={(e) => handleChange('marginRight', Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 border-b pb-2 pt-4">Patient Details Configuration</h3>
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-2">Select fields to show in the patient info section (2-column layout)</p>
                        <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_FIELDS.map(field => (
                                <label key={field.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={(localSettings.patientDetails || []).includes(field.id)}
                                        onChange={() => togglePatientField(field.id)}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs font-medium">{field.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 border-b pb-2 pt-4">Report Content</h3>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Report Note</label>
                        <textarea
                            value={localSettings.reportNote}
                            onChange={(e) => handleChange('reportNote', e.target.value)}
                            rows={2}
                            placeholder="Enter a default note for the report..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                checked={localSettings.showEndMarker}
                                onChange={(e) => handleChange('showEndMarker', e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Show "End of Report" marker</span>
                        </label>
                    </div>

                    <h3 className="font-semibold text-gray-800 border-b pb-2 pt-4">Footer Configuration</h3>

                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-3">
                        <button
                            onClick={() => handleChange('footerMode', 'text')}
                            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-all ${localSettings.footerMode !== 'image' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Text & details
                        </button>
                        <button
                            onClick={() => handleChange('footerMode', 'image')}
                            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-all ${localSettings.footerMode === 'image' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Full Image
                        </button>
                    </div>

                    {localSettings.footerMode === 'image' ? (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Full Footer Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                {localSettings.footerImage ? (
                                    <div className="relative w-full aspect-[4/1] mb-4">
                                        <img src={localSettings.footerImage} alt="Footer" className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => handleChange('footerImage', null)}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-gray-500">Upload footer image</p>
                                    </div>
                                )}
                                <label className="block w-full">
                                    <span className="sr-only">Choose file</span>
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'footerImage')} className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer
                                "/>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Footer Text</label>
                                <textarea
                                    value={localSettings.footerText}
                                    onChange={(e) => handleChange('footerText', e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Footer Image / Seal</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                        {localSettings.footerImage ? (
                                            <img src={localSettings.footerImage} alt="Footer" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="flex-1">
                                        <span className="sr-only">Choose file</span>
                                        <input type="file" onChange={(e) => handleImageUpload(e, 'footerImage')} className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-xs file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100
                                    "/>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <h3 className="font-semibold text-gray-800 border-b pb-2 pt-4 flex justify-between items-center">
                        <span>Signatures</span>
                        <button onClick={addSignature} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add
                        </button>
                    </h3>

                    <div className="space-y-4 pb-10">
                        {localSettings.signatures?.map((sig) => (
                            <div key={sig.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                                <button onClick={() => removeSignature(sig.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white rounded-full p-1 shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white border border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden shrink-0">
                                            {sig.image ? (
                                                <img src={sig.image} alt="Sig" className="w-full h-full object-contain" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                        <label className="flex-1">
                                            <span className="text-xs text-blue-600 block mb-1">Upload Signature</span>
                                            <input type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => updateSignature(sig.id, 'image', reader.result);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={sig.name}
                                        onChange={(e) => updateSignature(sig.id, 'name', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium"
                                        placeholder="Doctor Name"
                                    />
                                    <input
                                        type="text"
                                        value={sig.role}
                                        onChange={(e) => updateSignature(sig.id, 'role', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-500"
                                        placeholder="Designation"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 border-t bg-gray-50 flex items-center justify-between rounded-b-xl relative">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <PenTool className="w-3 h-3" />
                        <span>Changes are previewed live but not saved yet</span>
                    </div>
                    <button
                        onClick={handleSaveClick}
                        className="px-6 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Preview Panel - Show local live changes */}
            <ReportPreview settings={{ ...settings, reportFormat: localSettings }} />
        </div>
    );
};

export default ReportFormatSettings;