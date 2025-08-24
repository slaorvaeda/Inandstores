// Currency formatting
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '0.00';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0.00';

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return formatter.format(numAmount);
};

// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Date and time formatting
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Relative time formatting (e.g., "2 days ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Phone number formatting
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Indian phone numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

// Status formatting
export const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    overdue: 'Overdue',
    settled: 'Settled',
    suspended: 'Suspended',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed'
  };

  return statusMap[status] || status;
};

// Category formatting
export const formatCategory = (category) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Payment method formatting
export const formatPaymentMethod = (method) => {
  const methodMap = {
    cash: 'Cash',
    bank_transfer: 'Bank Transfer',
    cheque: 'Cheque',
    upi: 'UPI',
    card: 'Card',
    digital_wallet: 'Digital Wallet',
    other: 'Other'
  };

  return methodMap[method] || method;
};

// Number formatting with commas
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  const num = parseFloat(number);
  if (isNaN(num)) return '0';

  return new Intl.NumberFormat('en-IN').format(num);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  
  const num = parseFloat(value);
  if (isNaN(num)) return '0%';

  return `${num.toFixed(decimals)}%`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Format transaction ID for display
export const formatTransactionId = (transactionId) => {
  if (!transactionId) return 'N/A';
  
  // Add spaces every 4 characters for better readability
  return transactionId.replace(/(.{4})/g, '$1 ').trim();
};

// Format balance with color indication
export const formatBalance = (balance, currency = 'INR') => {
  const formatted = formatCurrency(balance, currency);
  
  if (balance === 0) {
    return { text: formatted, color: 'text-green-600' };
  } else if (balance > 0) {
    return { text: formatted, color: 'text-red-600' };
  } else {
    return { text: formatted, color: 'text-blue-600' };
  }
};
