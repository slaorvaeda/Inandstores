import { useState, useEffect } from 'react';
import { khataService } from '../services/khataService';

export const useKhatas = (params = {}) => {
  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchKhatas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await khataService.getAllKhatas({
        ...params,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.success) {
        setKhatas(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch khatas');
      console.error('Error fetching khatas:', err);
    } finally {
      setLoading(false);
    }
  };

  const createKhata = async (khataData) => {
    try {
      setError(null);
      const response = await khataService.createKhata(khataData);
      
      if (response.success) {
        // Refresh the list
        await fetchKhatas();
        return response;
      }
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create khata');
      throw err;
    }
  };

  const updateKhata = async (khataId, khataData) => {
    try {
      setError(null);
      const response = await khataService.updateKhata(khataId, khataData);
      
      if (response.success) {
        // Update the local state
        setKhatas(prev => prev.map(khata => 
          khata._id === khataId ? { ...khata, ...khataData } : khata
        ));
        return response;
      }
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update khata');
      throw err;
    }
  };

  const closeKhata = async (khataId) => {
    try {
      setError(null);
      const response = await khataService.closeKhata(khataId);
      
      if (response.success) {
        // Update the local state
        setKhatas(prev => prev.map(khata => 
          khata._id === khataId ? { ...khata, status: 'closed' } : khata
        ));
        return response;
      }
      return response;
    } catch (err) {
      setError(err.message || 'Failed to close khata');
      throw err;
    }
  };

  const setPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchKhatas();
  }, [pagination.page, params.search, params.status]);

  return {
    khatas,
    loading,
    error,
    pagination,
    createKhata,
    updateKhata,
    closeKhata,
    setPage,
    refetch: fetchKhatas
  };
};
