import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronDown, FaSearch, FaCheck } from 'react-icons/fa';

const Select = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
  showStock = false, // For items with stock information
  showDescription = false, // For options with descriptions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(multiple ? (Array.isArray(value) ? value : []) : []);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  // Calculate dropdown position when opening
  const calculateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          selectRef.current && !selectRef.current.contains(event.target)) {
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
    const searchLower = searchTerm.toLowerCase();
    return (
      option.label?.toLowerCase().includes(searchLower) ||
      option.value?.toLowerCase().includes(searchLower) ||
      option.name?.toLowerCase().includes(searchLower)
    );
  });

  // Get display value for single select
  const getDisplayValue = () => {
    if (multiple) return '';
    
    if (!value) return '';
    
    const selectedOption = options.find(option => 
      option.value === value || option._id === value
    );
    
    if (selectedOption) {
      let display = selectedOption.label || selectedOption.name || selectedOption.value;
      if (showStock && selectedOption.stockQuantity !== undefined) {
        display += ` (Stock: ${selectedOption.stockQuantity})`;
      }
      return display;
    }
    
    // If no exact match found, try to find by string comparison
    const selectedOptionByString = options.find(option => 
      String(option.value) === String(value) || String(option._id) === String(value)
    );
    
    if (selectedOptionByString) {
      let display = selectedOptionByString.label || selectedOptionByString.name || selectedOptionByString.value;
      if (showStock && selectedOptionByString.stockQuantity !== undefined) {
        display += ` (Stock: ${selectedOptionByString.stockQuantity})`;
      }
      return display;
    }
    
    return '';
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (multiple) {
      const optionValue = option.value || option._id;
      const isSelected = selectedOptions.some(selected => 
        selected.value === optionValue || selected._id === optionValue
      );
      
      let newSelectedOptions;
      if (isSelected) {
        newSelectedOptions = selectedOptions.filter(selected => 
          selected.value !== optionValue && selected._id !== optionValue
        );
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
      
      setSelectedOptions(newSelectedOptions);
      onChange?.(newSelectedOptions);
    } else {
      const optionValue = option.value || option._id;
      onChange?.(optionValue, option);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle remove selected option (for multiple select)
  const handleRemoveOption = (optionToRemove) => {
    const newSelectedOptions = selectedOptions.filter(option => 
      option.value !== optionToRemove.value && option._id !== optionToRemove._id
    );
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

              {/* Select Container */}
        <div
          ref={selectRef}
          className={`relative cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
        {/* Main Select Button */}
        <div
          onClick={() => {
            if (!disabled) {
              if (!isOpen) {
                calculateDropdownPosition();
              }
              setIsOpen(!isOpen);
            }
          }}
          className={`
            w-full px-4 py-3 border rounded-lg bg-white shadow-sm
            ${isOpen 
              ? 'border-blue-500 ring-2 ring-blue-200' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${error ? 'border-red-500' : ''}
            transition-all duration-200
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {multiple ? (
                // Multiple select display
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.length > 0 ? (
                    selectedOptions.map((option, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                      >
                        {option.label || option.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOption(option);
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">{placeholder}</span>
                  )}
                </div>
              ) : (
                // Single select display
                <span className={getDisplayValue() ? 'text-gray-900' : 'text-gray-500'}>
                  {getDisplayValue() || placeholder}
                </span>
              )}
            </div>
            <FaChevronDown 
              className={`ml-2 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Dropdown Options */}
        {isOpen && createPortal(
          <div 
            ref={dropdownRef}
            className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            {/* Search Input (if searchable) */}
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const optionValue = option.value || option._id;
                  const isSelected = multiple 
                    ? selectedOptions.some(selected => 
                        selected.value === optionValue || selected._id === optionValue
                      )
                    : (value === optionValue);

                  return (
                    <div
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className={`
                        px-4 py-3 cursor-pointer transition-colors duration-150
                        ${isSelected 
                          ? 'bg-blue-50 text-blue-900' 
                          : 'hover:bg-gray-50 text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            {multiple && (
                              <div className={`
                                w-4 h-4 border rounded mr-3 flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-blue-600 border-blue-600' 
                                  : 'border-gray-300'
                                }
                              `}>
                                {isSelected && <FaCheck className="text-white text-xs" />}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">
                                {option.label || option.name || option.value}
                              </div>
                              {showDescription && option.description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {option.description}
                                </div>
                              )}
                              {showStock && option.stockQuantity !== undefined && (
                                <div className="text-sm text-gray-500">
                                  Stock: {option.stockQuantity}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {!multiple && isSelected && (
                          <FaCheck className="text-blue-600 ml-2" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select; 