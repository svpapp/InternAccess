import {useState, useEffect} from 'react';
import {
  getNewAnchalAreaAllocationService,
  postNewAnchalAreaAllocationService,
  deleteAnchalAreaAllocationService,
  updateAnchalAreaAllocationService,
  getAnchalAreaAreaAllocationByIdService,
} from '../../../api/newAreaAllocation/anchalArea/anchalAreaService';

export const usePostNewAnchalAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const postAnchalArea = async data => {
    setLoading(true);
    setError(null);
    try {
      const response = await postNewAnchalAreaAllocationService(data);
      if (response.result === false) {
        throw {
          message: response.message,
          responseData: response.responseData,
        };
      }
      setResponseData(response);
      return response;
    } catch (err) {
      const error = {
        message: err.message || 'Unknown error occurred',
        responseData: err.responseData || 'Failed to post Anchal Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {postAnchalArea, loading, error, responseData};
};

export const useGetNewAnchalAreaAllocation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDataAnchalArea = async () => {
      setLoading(true);
      try {
        const result = await getNewAnchalAreaAllocationService();
        setData(result);
      } catch (error) {
        console.error('Error fetching Anchal Area:', error);
        setError(
          error.message ||
            'Failed to fetch Anchal Area. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDataAnchalArea();
  }, []);

  return {data, loading, error};
};

export const useGetAnchalAreaAllocationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const getAnchalAreaById = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAnchalAreaAreaAllocationByIdService(id);
      if (response.result === false) {
        throw {
          message: response.message,
          responseData: response.responseData,
        };
      }
      setResponseData(response);
      // console.log(response, 'res');

      return response;
    } catch (err) {
      const error = {
        message: err.message || 'Unknown error occurred',
        responseData: err.responseData || 'Failed to Get Anchal Area By Id',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {getAnchalAreaById, loading, error, responseData};
};

export const useUpdateAnchalAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const updateAnchalArea = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateAnchalAreaAllocationService(id, data);
      if (response.result === false) {
        throw {
          message: response.message,
          responseData: response.responseData,
        };
      }
      setResponseData(response);
      return response;
    } catch (err) {
      const error = {
        message: err.message || 'Unknown error occurred',
        responseData: err.responseData || 'Failed to update Anchal Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {updateAnchalArea, loading, error, responseData};
};

export const useDeleteAnchalAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const deleteAnchalArea = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteAnchalAreaAllocationService(id);
      if (response.result === false) {
        throw {
          message: response.message,
          responseData: response.responseData,
        };
      }
      setResponseData(response);
      return response;
    } catch (err) {
      const error = {
        message: err.message || 'Unknown error occurred',
        responseData: err.responseData || 'Failed to delete Anchal Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {deleteAnchalArea, loading, error, responseData};
};
