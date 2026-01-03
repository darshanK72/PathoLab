import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CustomDropdown = ({
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    label,
    searchable = false,
    className,
    error
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full bg-white border rounded-md px-3 py-2 text-sm text-left cursor-pointer flex items-center justify-between focus:outline-none ring-offset-2 transition-all",
                    isOpen ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300 hover:border-gray-400",
                    error && "border-red-500 focus:ring-red-500",
                    !selectedOption && "text-gray-500"
                )}
            >
                <span className="truncate block">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "transform rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
                    {searchable && (
                        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}
                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={cn(
                                        "px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between",
                                        value === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && <Check className="w-4 h-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-400 text-center">No results found</div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default CustomDropdown;
