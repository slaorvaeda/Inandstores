import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  text,
  fullScreen = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variants = {
    default: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400',
    success: 'text-green-600',
    danger: 'text-red-600',
  };

  const spinnerClasses = `${sizes[size]} ${variants[variant]} animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <FaSpinner className={`${spinnerClasses} mx-auto mb-4`} />
          {text && <p className="text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <div className="text-center">
        <FaSpinner className={spinnerClasses} />
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner; 