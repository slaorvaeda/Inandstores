import React, { useState } from 'react';
import { FaTimes, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';

const Alert = ({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const types = {
    info: {
      icon: FaInfoCircle,
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      iconClasses: 'text-blue-400',
    },
    success: {
      icon: FaCheckCircle,
      classes: 'bg-green-50 border-green-200 text-green-800',
      iconClasses: 'text-green-400',
    },
    warning: {
      icon: FaExclamationTriangle,
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconClasses: 'text-yellow-400',
    },
    error: {
      icon: FaExclamationCircle,
      classes: 'bg-red-50 border-red-200 text-red-800',
      iconClasses: 'text-red-400',
    },
  };

  const alertType = types[type];
  const Icon = alertType.icon;

  if (!isVisible) return null;

  return (
    <div className={`border rounded-lg p-4 ${alertType.classes} ${className}`} {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${alertType.iconClasses}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {children && (
            <div className={`text-sm ${title ? 'mt-2' : ''}`}>
              {children}
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={handleDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${alertType.classes.replace('bg-', 'hover:bg-').replace('50', '100')}`}
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert; 