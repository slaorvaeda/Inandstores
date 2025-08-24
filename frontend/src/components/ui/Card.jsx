import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border';
  
  const variants = {
    default: 'border-gray-200',
    elevated: 'border-gray-200 shadow-lg',
    outlined: 'border-gray-300 shadow-none',
    flat: 'border-gray-100 shadow-none'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card sub-components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
