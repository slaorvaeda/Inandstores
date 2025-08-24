import React from 'react';

const Badge = ({ 
  children, 
  color = 'gray',
  size = 'md',
  variant = 'solid',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const colors = {
    gray: {
      solid: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-300 text-gray-700'
    },
    red: {
      solid: 'bg-red-100 text-red-800',
      outline: 'border border-red-300 text-red-700'
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800',
      outline: 'border border-yellow-300 text-yellow-700'
    },
    green: {
      solid: 'bg-green-100 text-green-800',
      outline: 'border border-green-300 text-green-700'
    },
    blue: {
      solid: 'bg-blue-100 text-blue-800',
      outline: 'border border-blue-300 text-blue-700'
    },
    purple: {
      solid: 'bg-purple-100 text-purple-800',
      outline: 'border border-purple-300 text-purple-700'
    },
    pink: {
      solid: 'bg-pink-100 text-pink-800',
      outline: 'border border-pink-300 text-pink-700'
    }
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };

  const classes = `${baseClasses} ${colors[color][variant]} ${sizes[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
