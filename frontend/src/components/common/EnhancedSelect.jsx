import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdSearch, MdKeyboardArrowDown, MdClose } from 'react-icons/md';

const EnhancedSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  searchable = false,
  showDescription = false,
  showStock = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Find selected option
  useEffect(() => {
    const found = options.find(option => {
      const optionValue = option.value || option._id || option.id;
      return optionValue === value;
    });
    setSelectedOption(found || null);
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true;
    
    const optionValue = option.value || option._id || option.id;
    const optionLabel = option.label || option.name || option.title || String(optionValue);
    const optionDescription = option.description || option.desc || '';
    
    return (
      optionLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      optionDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelect = (option) => {
    const optionValue = option.value || option._id || option.id;
    const optionLabel = option.label || option.name || option.title || String(optionValue);
    
    setSelectedOption(option);
    setSearchTerm('');
    setIsOpen(false);
    
    if (onChange) {
      onChange(optionValue, option);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchTerm('');
    if (onChange) {
      onChange('', null);
    }
  };

  const getDisplayValue = () => {
    if (selectedOption) {
      const label = selectedOption.label || selectedOption.name || selectedOption.title;
      return label;
    }
    return placeholder;
  };

  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white cursor-pointer';
  const stateClasses = error 
    ? 'border-red-300 focus:ring-red-500' 
    : 'border-gray-300 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        {/* Main Select Button */}
        <div
          className={classes}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          {...props}
        >
          <div className="flex items-center justify-between">
            <span className={`${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
              {getDisplayValue()}
            </span>
            <div className="flex items-center space-x-2">
              {selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MdClose className="w-4 h-4" />
                </button>
              )}
              <MdKeyboardArrowDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden" style={{ minWidth: '200px' }}>
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const optionValue = option.value || option._id || option.id;
                  const optionLabel = option.label || option.name || option.title || String(optionValue);
                  const optionDescription = option.description || option.desc || '';
                  const optionStock = option.stockQuantity || option.stock || 0;
                  const optionRate = option.rate || option.price || 0;
                  
                  const isSelected = selectedOption && (selectedOption.value || selectedOption._id || selectedOption.id) === optionValue;

                  return (
                    <div
                      key={optionValue || index}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                        isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{optionLabel}</div>
                          {(showDescription && optionDescription) && (
                            <div className="text-xs text-gray-500 mt-1">{optionDescription}</div>
                          )}
                          {showStock && (
                            <div className="text-xs text-gray-500 mt-1">
                              Stock: {optionStock} | Rate: ₹{optionRate}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="ml-2 text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default EnhancedSelect;
