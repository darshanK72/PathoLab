import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Edit, FileText, Plus, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
}

interface SortConfig {
  key: keyof Patient | null;
  direction: 'asc' | 'desc';
}

interface FilterState {
  searchTerm: string;
  gender: string;
  ageRange: {
    min: string;
    max: string;
  };
  lastVisitRange: {
    start: string;
    end: string;
  };
}

const PatientsList = () => {
  // Sample data with 20 patients
  const [patients] = useState<Patient[]>([
    { id: 'P001', name: 'John Doe', age: '45', gender: 'Male', phone: '+1234567890', email: 'john.doe@example.com', lastVisit: '2024-03-15' },
    { id: 'P002', name: 'Jane Smith', age: '32', gender: 'Female', phone: '+1234567891', email: 'jane.smith@example.com', lastVisit: '2024-03-14' },
    { id: 'P003', name: 'Michael Johnson', age: '58', gender: 'Male', phone: '+1234567892', email: 'michael.j@example.com', lastVisit: '2024-03-13' },
    { id: 'P004', name: 'Sarah Williams', age: '29', gender: 'Female', phone: '+1234567893', email: 'sarah.w@example.com', lastVisit: '2024-03-12' },
    { id: 'P005', name: 'Robert Brown', age: '51', gender: 'Male', phone: '+1234567894', email: 'robert.b@example.com', lastVisit: '2024-03-11' },
    { id: 'P006', name: 'Emily Davis', age: '27', gender: 'Female', phone: '+1234567895', email: 'emily.d@example.com', lastVisit: '2024-03-10' },
    { id: 'P007', name: 'William Miller', age: '63', gender: 'Male', phone: '+1234567896', email: 'william.m@example.com', lastVisit: '2024-03-09' },
    { id: 'P008', name: 'Emma Wilson', age: '35', gender: 'Female', phone: '+1234567897', email: 'emma.w@example.com', lastVisit: '2024-03-08' },
    { id: 'P009', name: 'James Taylor', age: '42', gender: 'Male', phone: '+1234567898', email: 'james.t@example.com', lastVisit: '2024-03-07' },
    { id: 'P010', name: 'Olivia Anderson', age: '31', gender: 'Female', phone: '+1234567899', email: 'olivia.a@example.com', lastVisit: '2024-03-06' },
    { id: 'P011', name: 'David Martinez', age: '47', gender: 'Male', phone: '+1234567900', email: 'david.m@example.com', lastVisit: '2024-03-05' },
    { id: 'P012', name: 'Sophia Garcia', age: '25', gender: 'Female', phone: '+1234567901', email: 'sophia.g@example.com', lastVisit: '2024-03-04' },
    { id: 'P013', name: 'Joseph Rodriguez', age: '55', gender: 'Male', phone: '+1234567902', email: 'joseph.r@example.com', lastVisit: '2024-03-03' },
    { id: 'P014', name: 'Isabella Lopez', age: '38', gender: 'Female', phone: '+1234567903', email: 'isabella.l@example.com', lastVisit: '2024-03-02' },
    { id: 'P015', name: 'Thomas Lee', age: '49', gender: 'Male', phone: '+1234567904', email: 'thomas.l@example.com', lastVisit: '2024-03-01' },
    { id: 'P016', name: 'Mia Hernandez', age: '33', gender: 'Female', phone: '+1234567905', email: 'mia.h@example.com', lastVisit: '2024-02-29' },
    { id: 'P017', name: 'Christopher King', age: '61', gender: 'Male', phone: '+1234567906', email: 'chris.k@example.com', lastVisit: '2024-02-28' },
    { id: 'P018', name: 'Ava Wright', age: '28', gender: 'Female', phone: '+1234567907', email: 'ava.w@example.com', lastVisit: '2024-02-27' },
    { id: 'P019', name: 'Daniel Scott', age: '52', gender: 'Male', phone: '+1234567908', email: 'daniel.s@example.com', lastVisit: '2024-02-26' },
    { id: 'P020', name: 'Charlotte Adams', age: '36', gender: 'Female', phone: '+1234567909', email: 'charlotte.a@example.com', lastVisit: '2024-02-25' },
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    gender: '',
    ageRange: {
      min: '',
      max: ''
    },
    lastVisitRange: {
      start: '',
      end: ''
    }
  });

  const handleSort = (key: keyof Patient) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FilterState],
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      gender: '',
      ageRange: {
        min: '',
        max: ''
      },
      lastVisitRange: {
        start: '',
        end: ''
      }
    });
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Search term filter
      const searchMatch = filters.searchTerm === '' || 
        Object.values(patient).some(value => 
          value.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );

      // Gender filter
      const genderMatch = filters.gender === '' || 
        patient.gender.toLowerCase() === filters.gender.toLowerCase();

      // Age range filter
      const ageMatch = (filters.ageRange.min === '' || parseInt(patient.age) >= parseInt(filters.ageRange.min)) &&
        (filters.ageRange.max === '' || parseInt(patient.age) <= parseInt(filters.ageRange.max));

      // Last visit range filter
      const lastVisitMatch = (filters.lastVisitRange.start === '' || patient.lastVisit >= filters.lastVisitRange.start) &&
        (filters.lastVisitRange.end === '' || patient.lastVisit <= filters.lastVisitRange.end);

      return searchMatch && genderMatch && ageMatch && lastVisitMatch;
    });
  }, [patients, filters]);

  const sortedPatients = useMemo(() => {
    if (!sortConfig.key) return filteredPatients;

    return [...filteredPatients].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPatients, sortConfig]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPatients.slice(startIndex, startIndex + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPatients.length / pageSize);

  const SortIcon = ({ column }: { column: keyof Patient }) => {
    if (sortConfig.key !== column) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-indigo-500" /> : 
      <ChevronDown className="h-4 w-4 text-indigo-500" />;
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <Link
          to="/patients/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Patient
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search patients..."
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none hover:border-gray-400"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              {showFilters ? (
                <>Hide Filters <ChevronUp className="h-4 w-4 ml-1" /></>
              ) : (
                <>Show Filters <ChevronDown className="h-4 w-4 ml-1" /></>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {/* Gender Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none hover:border-gray-400"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Age Range Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Age Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="ageRange.min"
                      value={filters.ageRange.min}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none hover:border-gray-400"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      name="ageRange.max"
                      value={filters.ageRange.max}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none hover:border-gray-400"
                    />
                  </div>
                </div>

                {/* Last Visit Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Visit</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      name="lastVisitRange.start"
                      value={filters.lastVisitRange.start}
                      onChange={handleFilterChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none hover:border-gray-400"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="date"
                      name="lastVisitRange.end"
                      value={filters.lastVisitRange.end}
                      onChange={handleFilterChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(patients[0] || {}).map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Patient)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <SortIcon column={key as keyof Patient} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  {Object.values(patient).map((value, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {value}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <Link
                        to={`/patients/edit/${patient.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/reports/new/${patient.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FileText className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsList; 