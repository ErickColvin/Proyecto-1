import { useAuth } from '../context/AuthContext';

export const useApi = () => {
  const { authenticatedRequest } = useAuth();

  const apiRequest = async (url, options = {}) => {
    try {
      const response = await authenticatedRequest(url, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la petición');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en API request:', error);
      throw error;
    }
  };

  // Métodos HTTP específicos
  const get = (url) => apiRequest(url);
  
  const post = (url, data) => apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  const put = (url, data) => apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  const delete_ = (url) => apiRequest(url, {
    method: 'DELETE',
  });

  return {
    get,
    post,
    put,
    delete: delete_,
    apiRequest
  };
}; 