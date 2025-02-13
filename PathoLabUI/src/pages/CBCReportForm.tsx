import React, { useState } from 'react';
import { Save, Download, ChevronDown } from 'lucide-react';
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
}

interface FormErrors {
  [key: string]: string;
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
    remarks: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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
    w-full px-4 py-2 rounded-lg border-2 transition-colors duration-200
    ${touched[name] && errors[name]
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-indigo-500'
    }
    focus:outline-none focus:ring-2
    ${touched[name] && errors[name]
      ? 'focus:ring-red-200'
      : 'focus:ring-indigo-200'
    }
  `;

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">CBC Report Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Patient Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">CBC Parameters</h3>

            {/* Grid container for labels, values, and units */}
            <div className="grid grid-cols-3 gap-4">
              {/* Headers for the columns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parameter</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Range</label>
              </div>

              {/* Map through the reference ranges to create rows */}
              {Object.entries(referenceRanges).map(([key, range]) => (
                <React.Fragment key={key}>
                  {/* Parameter Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>

                  {/* Input for Value */}
                  <div>
                    <input
                      type="text"
                      name={key}
                      value={formData[key as keyof CBCFormData]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClasses(key)}
                    />
                    {touched[key] && errors[key] && (
                      <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                    )}
                  </div>

                  {/* Display Reference Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {range}
                    </label>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                className={inputClasses('remarks')}
                placeholder="Add any additional notes or observations..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={generatePDF}
              className="inline-flex items-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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