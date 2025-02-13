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
    w-full px-4 py-2 rounded-lg border-2 appearance-none transition-colors duration-200
    bg-white
    ${touched && error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-indigo-500'
    }
    focus:outline-none focus:ring-2
    ${touched && error
      ? 'focus:ring-red-200'
      : 'focus:ring-indigo-200'
    }
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
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
        <ChevronDown size={18} />
      </div>
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
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">New Patient Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
            
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClasses('dateOfBirth')}
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>
              
              <div className="flex-1">
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
                {touched.gender && errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Contact Information</h3>
            
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses('address')}
                placeholder="123 Main St, City, Country"
              />
            </div>
          </div>

          {/* Test Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Test Information</h3>
            
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
              {touched.testType && errors.testType && (
                <p className="mt-1 text-sm text-red-500">{errors.testType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                className={inputClasses('notes')}
                placeholder="Any additional information about the patient or test..."
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
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;