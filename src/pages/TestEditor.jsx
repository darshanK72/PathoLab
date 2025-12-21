import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Plus,
    Trash2,
    GripVertical,
    Save,
    ArrowLeft,
    X,
    Check
} from 'lucide-react';
import { api } from '../lib/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COMMON_UNITS = [
    'mg/dL', 'g/dL', 'mmol/L', 'µmol/L', 'IU/L', 'mIU/L', 'U/L',
    'ng/mL', 'pg/mL', 'ng/dL', 'µg/dL',
    '%', 'g/L', 'mg/L',
    '10^6/µL', '10^3/µL', '/HPF',
    'fl', 'mm/hr', 'mm', 'cm',
    'years', 'months', 'days', 'weeks',
    'ratio', 'index', 'seconds', 'minutes'
];

const UnitSelector = ({ value, onChange, placeholder, className }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState(COMMON_UNITS);

    // Filter suggestions based on input
    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(val);
        const filtered = COMMON_UNITS.filter(u =>
            u.toLowerCase().includes(val.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
    };

    const handleSelect = (unit) => {
        onChange(unit);
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                placeholder={placeholder}
                className={className}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 w-32 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((unit) => (
                        <div
                            key={unit}
                            onMouseDown={() => handleSelect(unit)} // onMouseDown fires before onBlur
                            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        >
                            {unit}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SortableRow = ({ param, index, columns, handleParamChange, removeParameter }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: param.tempId || index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex gap-4 items-center bg-gray-50/50 p-2 rounded-lg group hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <div {...attributes} {...listeners} className="w-8 flex justify-center text-gray-300 cursor-move outline-none">
                <GripVertical className="w-5 h-5" />
            </div>

            {columns.map((col) => (
                <div key={col.id} className="flex-1">
                    {col.id === 'unit' ? (
                        <UnitSelector
                            value={param[col.id] || ''}
                            onChange={(val) => handleParamChange(index, col.id, val)}
                            placeholder={col.label}
                            className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 outline-none"
                        />
                    ) : (
                        <input
                            type={col.type === 'number' ? 'number' : 'text'}
                            value={param[col.id] || ''}
                            onChange={(e) => handleParamChange(index, col.id, e.target.value)}
                            placeholder={col.label}
                            className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 outline-none"
                        />
                    )}
                </div>
            ))}

            <div className="w-8 flex justify-center">
                <button
                    onClick={() => removeParameter(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const TestEditor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const existingTest = location.state?.test;
    const isEditMode = !!existingTest;

    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnType, setNewColumnType] = useState('text');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [testData, setTestData] = useState(() => {
        // Fix: Create a deep copy or new object to avoid mutating prop/location state
        const initial = existingTest ? JSON.parse(JSON.stringify(existingTest)) : {
            testName: '',
            department: '',
            price: '',
            parameters: [
                { name: '', unit: '', refRange: '' }
            ],
            interpretation: '',
            columns: [
                { id: 'name', label: 'Parameter Name', isStatic: true, type: 'text' },
                { id: 'unit', label: 'Unit', isStatic: true, type: 'text' },
                { id: 'refRange', label: 'Reference Range / Values', isStatic: true, type: 'text' }
            ]
        };

        // Backward compatibility
        if (!initial.columns) {
            initial.columns = [
                { id: 'name', label: 'Parameter Name', isStatic: true, type: 'text' },
                { id: 'unit', label: 'Unit', isStatic: true, type: 'text' },
                { id: 'refRange', label: 'Reference Range / Values', isStatic: true, type: 'text' }
            ];
        }


        // Ensure parameters have temporary IDs for DnD
        if (initial.parameters) {
            initial.parameters = initial.parameters.map(p => ({ ...p, tempId: p.tempId || `param_${Date.now()}_${Math.random()}` }));
        }

        return initial;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleParamChange = (index, field, value) => {
        const newParams = [...testData.parameters];
        newParams[index][field] = value;
        setTestData(prev => ({ ...prev, parameters: newParams }));
    };

    const addParameter = () => {
        setTestData(prev => ({
            ...prev,
            parameters: [...prev.parameters, {
                name: '',
                unit: '',
                refRange: '',
                tempId: `param_${Date.now()}_${Math.random()}`
            }]
        }));
    };

    const removeParameter = (index) => {
        const newParams = testData.parameters.filter((_, i) => i !== index);
        setTestData(prev => ({ ...prev, parameters: newParams }));
    };

    const addColumn = () => {
        setIsAddingColumn(true);
    };

    const confirmAddColumn = () => {
        if (!newColumnName.trim()) return;

        const id = `col_${Date.now()}`;
        setTestData(prev => ({
            ...prev,
            columns: [...prev.columns, {
                id,
                label: newColumnName,
                isStatic: false,
                type: newColumnType
            }]
        }));
        setNewColumnName('');
        setNewColumnType('text');
        setIsAddingColumn(false);
    };

    const cancelAddColumn = () => {
        setNewColumnName('');
        setNewColumnType('text');
        setIsAddingColumn(false);
    };

    const removeColumn = (colId) => {
        if (window.confirm("Delete this column? This cannot be undone.")) {
            setTestData(prev => ({
                ...prev,
                columns: prev.columns.filter(c => c.id !== colId)
            }));
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTestData((prev) => {
                const oldIndex = prev.parameters.findIndex((p) => (p.tempId || p.index) === active.id);
                const newIndex = prev.parameters.findIndex((p) => (p.tempId || p.index) === over.id);

                return {
                    ...prev,
                    parameters: arrayMove(prev.parameters, oldIndex, newIndex),
                };
            });
        }
    };

    const handleSubmit = async () => {
        try {
            if (!testData.testName) {
                alert('Test Name is required');
                return;
            }

            if (isEditMode) {
                await api.updateTest(existingTest.id, testData);
            } else {
                const newTest = {
                    id: `T${Date.now().toString().slice(-4)}`,
                    ...testData
                };
                await api.createTest(newTest);
            }
            navigate('/tests');
        } catch (error) {
            console.error(error);
            alert('Failed to save test');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/tests')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Test Format' : 'Create New Test'}
                    </h1>
                    <p className="text-gray-500 text-sm">Define report structure and parameters</p>
                </div>
            </div>

            {/* Basic Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Test Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Test Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="testName"
                            value={testData.testName}
                            onChange={handleInputChange}
                            placeholder="e.g. Lipid Profile"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={testData.department}
                            onChange={handleInputChange}
                            placeholder="e.g. Biochemistry"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={testData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Report Format Builder */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Report Parameters</h3>
                    <button
                        onClick={addParameter}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Field
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex gap-4 px-2 text-xs font-semibold text-gray-500 uppercase items-center">
                        <div className="w-8"></div>
                        {testData.columns.map((col) => (
                            <div key={col.id} className="flex-1 flex items-center justify-between group/header">
                                <span>{col.label}</span>
                                {!col.isStatic && (
                                    <button
                                        onClick={() => removeColumn(col.id)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover/header:opacity-100 transition-opacity"
                                        title="Remove Column"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="w-8 flex justify-center">
                            <div className="w-8 flex justify-center">
                                <button
                                    onClick={addColumn}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Add New Column"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Parameters Rows */}
                    {/* Parameters Rows - DnD Context */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={testData.parameters.map(p => p.tempId || p.index)}
                            strategy={verticalListSortingStrategy}
                        >
                            {testData.parameters.map((param, index) => (
                                <SortableRow
                                    key={param.tempId || index}
                                    param={param}
                                    index={index}
                                    columns={testData.columns}
                                    handleParamChange={handleParamChange}
                                    removeParameter={removeParameter}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {testData.parameters.length === 0 && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                            <p>No parameters defined. Add fields to build the report format.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Interpretation Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Interpretation / Comments</h3>
                <div className="prose-editor">
                    <ReactQuill
                        theme="snow"
                        value={testData.interpretation || ''}
                        onChange={(value) => setTestData(prev => ({ ...prev, interpretation: value }))}
                        className="h-64 mb-12"
                    />
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={() => navigate('/tests')}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors text-sm"
                >
                    <Save className="w-4 h-4" />
                    Save Test Format
                </button>
            </div>
            {/* Add Column Modal */}
            {isAddingColumn && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-96 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Add New Column</h3>
                            <button onClick={cancelAddColumn} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Column Name</label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g. Method, Notes"
                                value={newColumnName}
                                onChange={(e) => setNewColumnName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newColumnName.trim()) confirmAddColumn();
                                    if (e.key === 'Escape') cancelAddColumn();
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Data Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setNewColumnType('text')}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${newColumnType === 'text' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Text
                                </button>
                                <button
                                    onClick={() => setNewColumnType('number')}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${newColumnType === 'number' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Number
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={cancelAddColumn}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAddColumn}
                                disabled={!newColumnName.trim()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Column
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestEditor;
