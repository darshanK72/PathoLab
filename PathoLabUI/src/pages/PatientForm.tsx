import React, { useState } from 'react';
import { Save, Download, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  testType: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  touched?: boolean;
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  touched,
  placeholder
}) => {
  const selectClasses = `
    w-full px-3 py-1.5 rounded border transition-colors duration-200
    ${touched && error
      ? 'border-red-300 focus:border-red-500'
      : 'border-gray-300 hover:border-gray-400'
    }
    focus:outline-none
    disabled:bg-gray-50 disabled:text-gray-500
  `;

  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={selectClasses}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
        <ChevronDown size={18} />
      </div>
      {touched && error && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className="relative group">
            <div className="w-4 h-4 text-red-500">
              ⚠️
            </div>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PatientForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    testType: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const testTypeOptions = [
    { value: 'blood', label: 'Blood Test' },
    { value: 'urine', label: 'Urinalysis' },
    { value: 'covid', label: 'COVID-19 Test' },
    { value: 'other', label: 'Other' }
  ];

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : 'This field is required';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'phone':
        return /^\+?[\d\s-]{10,}$/.test(value) ? '' : 'Invalid phone number';
      case 'dateOfBirth':
        return value ? '' : 'Date of birth is required';
      case 'gender':
        return value ? '' : 'Please select a gender';
      case 'testType':
        return value ? '' : 'Please select a test type';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof FormData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
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
    doc.setFontSize(20);
    doc.text('Patient Information', 20, 20);
    
    doc.setFontSize(12);
    Object.entries(formData).forEach(([key, value], index) => {
      const yPos = 40 + (index * 10);
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 20, yPos);
    });
    
    doc.save('patient-information.pdf');
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
    <div className="p-4 [&_*:focus]:outline-none">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">New Patient Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses('firstName')}
                    placeholder="John"
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="relative group">
                        <div className="w-4 h-4 text-red-500">⚠️</div>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                            {errors.firstName}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses('lastName')}
                    placeholder="Doe"
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="relative group">
                        <div className="w-4 h-4 text-red-500">⚠️</div>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                            {errors.lastName}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses('dateOfBirth')}
                  />
                  {touched.dateOfBirth && errors.dateOfBirth && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="relative group">
                        <div className="w-4 h-4 text-red-500">⚠️</div>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                            {errors.dateOfBirth}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gender - Already using CustomSelect component */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <CustomSelect
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={genderOptions}
                  error={errors.gender}
                  touched={touched.gender}
                  placeholder="Select Gender"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses('email')}
                    placeholder="john.doe@example.com"
                  />
                  {touched.email && errors.email && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="relative group">
                        <div className="w-4 h-4 text-red-500">⚠️</div>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                            {errors.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses('phone')}
                    placeholder="+1 (555) 000-0000"
                  />
                  {touched.phone && errors.phone && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="relative group">
                        <div className="w-4 h-4 text-red-500">⚠️</div>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                            {errors.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClasses('address')}
                    placeholder="123 Main St, City, Country"
                  />
                  {touched.address && errors.address && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="relative group">
                        <div className="w-4 h-4 text-red-500">⚠️</div>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                          <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                            {errors.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Test Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
              <CustomSelect
                name="testType"
                value={formData.testType}
                onChange={handleChange}
                onBlur={handleBlur}
                options={testTypeOptions}
                error={errors.testType}
                touched={touched.testType}
                placeholder="Select Test Type"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <div className="relative">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={inputClasses('notes')}
                  placeholder="Any additional information about the patient or test..."
                />
                {touched.notes && errors.notes && (
                  <div className="absolute right-2 top-4">
                    <div className="relative group">
                      <div className="w-4 h-4 text-red-500">⚠️</div>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                        <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md border border-red-200 shadow-sm whitespace-nowrap">
                          {errors.notes}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;