import React, { useState } from 'react';
import { Save, Download, ChevronDown, Search } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CBCFormData {
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  date: string;
  // CBC Parameters
  hemoglobin: string;
  hematocrit: string;
  rbc: string;
  mcv: string;
  mch: string;
  mchc: string;
  rdw: string;
  wbc: string;
  neutrophils: string;
  lymphocytes: string;
  monocytes: string;
  eosinophils: string;
  basophils: string;
  platelets: string;
  remarks: string;
  hemoglobinUnit: string;
  hematocritUnit: string;
  rbcUnit: string;
  mcvUnit: string;
  mchUnit: string;
  mchcUnit: string;
  rdwUnit: string;
  wbcUnit: string;
  neutrophilsUnit: string;
  lymphocytesUnit: string;
  monocytesUnit: string;
  eosinophilsUnit: string;
  basophilsUnit: string;
  plateletsUnit: string;
}

interface FormErrors {
  [key: string]: string;
}

// Add interface for Patient
interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
}

const CBCReportForm = () => {
  const [formData, setFormData] = useState<CBCFormData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
    hemoglobin: '',
    hematocrit: '',
    rbc: '',
    mcv: '',
    mch: '',
    mchc: '',
    rdw: '',
    wbc: '',
    neutrophils: '',
    lymphocytes: '',
    monocytes: '',
    eosinophils: '',
    basophils: '',
    platelets: '',
    remarks: '',
    hemoglobinUnit: 'g/dL',
    hematocritUnit: '%',
    rbcUnit: 'million/µL',
    mcvUnit: 'fL',
    mchUnit: 'pg',
    mchcUnit: 'g/dL',
    rdwUnit: '%',
    wbcUnit: 'K/µL',
    neutrophilsUnit: '%',
    lymphocytesUnit: '%',
    monocytesUnit: '%',
    eosinophilsUnit: '%',
    basophilsUnit: '%',
    plateletsUnit: 'K/µL',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  const referenceRanges = {
    hemoglobin: '13.5-17.5 g/dL',
    hematocrit: '41-53%',
    rbc: '4.5-5.9 million/µL',
    mcv: '80-96 fL',
    mch: '27-33 pg',
    mchc: '32-36 g/dL',
    rdw: '11.5-14.5%',
    wbc: '4.5-11.0 K/µL',
    neutrophils: '40-70%',
    lymphocytes: '20-40%',
    monocytes: '2-8%',
    eosinophils: '1-4%',
    basophils: '0.5-1%',
    platelets: '150-450 K/µL'
  };

  const unitOptions = {
    hemoglobin: ['g/dL', 'g/L'],
    hematocrit: ['%'],
    rbc: ['million/µL', 'million/mm³'],
    mcv: ['fL'],
    mch: ['pg'],
    mchc: ['g/dL'],
    rdw: ['%'],
    wbc: ['K/µL', 'cells/mm³'],
    neutrophils: ['%'],
    lymphocytes: ['%'],
    monocytes: ['%'],
    eosinophils: ['%'],
    basophils: ['%'],
    platelets: ['K/µL', 'cells/mm³'],
  };

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return 'This field is required';
    }
    if (['age', 'hemoglobin', 'hematocrit', 'rbc', 'mcv', 'mch', 'mchc', 'rdw', 'wbc', 'neutrophils', 'lymphocytes', 'monocytes', 'eosinophils', 'basophils', 'platelets'].includes(name)) {
      if (isNaN(Number(value))) {
        return 'Must be a number';
      }
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof CBCFormData]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Complete Blood Count (CBC) Report', 20, 20);
    
    // Patient Information
    doc.setFontSize(12);
    doc.text(`Patient ID: ${formData.patientId}`, 20, 40);
    doc.text(`Patient Name: ${formData.patientName}`, 20, 50);
    doc.text(`Age: ${formData.age}`, 20, 60);
    doc.text(`Gender: ${formData.gender}`, 100, 60);
    doc.text(`Date: ${formData.date}`, 20, 70);
    
    // CBC Parameters
    doc.setFontSize(14);
    doc.text('CBC Parameters', 20, 90);
    
    doc.setFontSize(10);
    let y = 100;
    const parameters = [
      { label: 'Hemoglobin', value: formData.hemoglobin, range: referenceRanges.hemoglobin },
      { label: 'Hematocrit', value: formData.hematocrit, range: referenceRanges.hematocrit },
      { label: 'RBC', value: formData.rbc, range: referenceRanges.rbc },
      { label: 'MCV', value: formData.mcv, range: referenceRanges.mcv },
      { label: 'MCH', value: formData.mch, range: referenceRanges.mch },
      { label: 'MCHC', value: formData.mchc, range: referenceRanges.mchc },
      { label: 'RDW', value: formData.rdw, range: referenceRanges.rdw },
      { label: 'WBC', value: formData.wbc, range: referenceRanges.wbc },
      { label: 'Neutrophils', value: formData.neutrophils, range: referenceRanges.neutrophils },
      { label: 'Lymphocytes', value: formData.lymphocytes, range: referenceRanges.lymphocytes },
      { label: 'Monocytes', value: formData.monocytes, range: referenceRanges.monocytes },
      { label: 'Eosinophils', value: formData.eosinophils, range: referenceRanges.eosinophils },
      { label: 'Basophils', value: formData.basophils, range: referenceRanges.basophils },
      { label: 'Platelets', value: formData.platelets, range: referenceRanges.platelets }
    ];
    
    parameters.forEach(param => {
      doc.text(param.label, 20, y);
      doc.text(param.value, 80, y);
      doc.text(param.range, 120, y);
      y += 10;
    });
    
    // Remarks
    if (formData.remarks) {
      doc.text('Remarks:', 20, y + 10);
      doc.text(formData.remarks, 20, y + 20);
    }
    
    doc.save('cbc-report.pdf');
  };

  const inputClasses = (name: string) => `
    w-full px-3 py-1.5 rounded border transition-colors duration-200
    ${touched[name] && errors[name]
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 hover:border-gray-400'
    }
    focus:outline-none
    disabled:bg-gray-50 disabled:text-gray-500
  `;

  // Mock patient search function - replace with actual API call
  const searchPatients = async (query: string) => {
    // Mock data - replace with actual API call
    const mockPatients: Patient[] = [
      { id: 'P001', name: 'John Doe', age: '45', gender: 'male' },
      { id: 'P002', name: 'Jane Smith', age: '32', gender: 'female' },
      // Add more mock data as needed
    ];

    return mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.id.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);

    if (query.trim()) {
      const results = await searchPatients(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender
    }));
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="p-4 [&_*:focus]:outline-none">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">CBC Report Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Search Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Patient Search</h3>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search patient by ID or name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 hover:border-gray-400 focus:outline-none"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {searchResults.map((patient) => (
                      <li
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium text-gray-800">{patient.name}</div>
                          <div className="text-sm text-gray-500">ID: {patient.id}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.age} yrs | {patient.gender}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Patient Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses('patientId')}
                />
                {touched.patientId && errors.patientId && (
                  <p className="mt-1 text-sm text-red-500">{errors.patientId}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses('patientName')}
                />
                {touched.patientName && errors.patientName && (
                  <p className="mt-1 text-sm text-red-500">{errors.patientName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses('age')}
                />
                {touched.age && errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses('gender')}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {touched.gender && errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* CBC Parameters */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">CBC Parameters</h3>

            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-gray-50 border-b">
                <div className="p-3 text-sm font-semibold text-gray-700 border-r">
                  Parameter
                </div>
                <div className="p-3 text-sm font-semibold text-gray-700 border-r">
                  Value
                </div>
                <div className="p-3 text-sm font-semibold text-gray-700 border-r">
                  Unit
                </div>
                <div className="p-3 text-sm font-semibold text-gray-700">
                  Reference Range
                </div>
              </div>

              {/* Table Body */}
              {Object.entries(referenceRanges).map(([key, range], index) => (
                <div 
                  key={key} 
                  className={`grid grid-cols-4 ${
                    index !== Object.entries(referenceRanges).length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Parameter Label */}
                  <div className="p-3 flex items-center border-r bg-gray-50">
                    <label className="text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>

                  {/* Value Input */}
                  <div className="p-3 border-r relative">
                    <div className="relative">
                      <input
                        type="text"
                        name={key}
                        value={formData[key as keyof CBCFormData]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${inputClasses(key)} w-full ${
                          touched[key] && errors[key] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                        }`}
                      />
                      {touched[key] && errors[key] && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2">
                          <div className="relative group">
                            <div className="w-4 h-4 text-red-500">
                              ⚠️
                            </div>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                              <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                                {errors[key]}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unit Selection */}
                  <div className="p-3 border-r">
                    <select
                      name={`${key}Unit`}
                      value={formData[`${key}Unit` as keyof CBCFormData]}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 hover:border-gray-400 focus:outline-none transition-colors duration-200"
                    >
                      {unitOptions[key as keyof typeof unitOptions].map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reference Range */}
                  <div className="p-3 flex items-center">
                    <span className="text-sm text-gray-600">
                      {range}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={inputClasses('remarks')}
                placeholder="Add any additional notes or observations..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={generatePDF}
              className="inline-flex items-center px-4 py-1.5 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center px-6 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CBCReportForm;