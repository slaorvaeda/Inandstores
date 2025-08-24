// API Configuration using environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL.replace('/api', '')}/login`,
  SIGNUP: `${API_BASE_URL.replace('/api', '')}/signup`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  USER_AVATAR: `${API_BASE_URL.replace('/api', '')}/avatar`,
  
  // Google Auth
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google/login`,
  
  // Client endpoints
  CLIENTS: `${API_BASE_URL}/clients`,
  CLIENT_BY_ID: (id) => `${API_BASE_URL}/clients/${id}`,
  CLIENT_UPDATE: (id) => `${API_BASE_URL}/clients/update/${id}`,
  
  // Item endpoints
  ITEMS: `${API_BASE_URL}/items`,
  ITEM_BY_ID: (id) => `${API_BASE_URL}/items/${id}`,
  UPLOAD_MULTIPLE: `${API_BASE_URL}/upload-multiple`,
  
  // Vendor endpoints
  VENDORS: `${API_BASE_URL}/vendors`,
  VENDOR_BY_ID: (id) => `${API_BASE_URL}/vendors/${id}`,
  
  // Purchase Bill endpoints
  PURCHASE_BILLS: `${API_BASE_URL}/purchasebills`,
  PURCHASE_BILL_BY_ID: (id) => `${API_BASE_URL}/purchasebills/${id}`,
  PURCHASE_BILL_CREATE: `${API_BASE_URL}/purchasebills/create`,
  PURCHASE_BILL_NEXT_NUMBER: `${API_BASE_URL}/purchasebills/next-number`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
  ORDER_CREATE: `${API_BASE_URL}/orders/create`,
  
  // Invoice endpoints
  INVOICES: `${API_BASE_URL.replace('/api', '')}/invoices`,
  INVOICE_BY_ID: (id) => `${API_BASE_URL.replace('/api', '')}/invoices/${id}`,
  INVOICE_NEXT_NUMBER: `${API_BASE_URL}/invoices/next-number`,
  
  // Dashboard endpoints
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  
  // Khata endpoints
  KHATA: `${API_BASE_URL}/khata`,
};

// Helper function to get API URL with user ID
export const getApiUrlWithUserId = (baseUrl) => {
  const userId = localStorage.getItem('userId');
  return userId ? `${baseUrl}?userId=${userId}` : baseUrl;
};

// Default axios configuration
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_ENDPOINTS;
