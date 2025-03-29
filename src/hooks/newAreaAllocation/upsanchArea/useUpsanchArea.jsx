import { useState, useEffect } from 'react';
import {
  getNewUpsanchAreaAllocationService,
  postNewUpsanchAreaAllocationService,
  deleteUpsanchAreaAllocationService,
  getUpsanchAreaAreaAllocationByIdService,
  updateUpsanchAreaAllocationService,
} from '../../../api/newAreaAllocation/upsanchArea/upsanchAreaService';
export const usePostNewUpsanchAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const postUpsanchArea = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postNewUpsanchAreaAllocationService(data);
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
        responseData: err.responseData || 'Failed to post Upsanch Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postUpsanchArea, loading, error, responseData };
};

export const useGetNewUpsanchAreaAllocation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDataUpsanchArea = async () => {
      setLoading(true);
      try {
        const result = await getNewUpsanchAreaAllocationService();
        setData(result);
      } catch (error) {
        console.error('Error fetching Upsanch Area:', error);
        setError(
          error.message ||
            'Failed to fetch Upsanch Area. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDataUpsanchArea();
  }, []);

  return { data, loading, error };
};

export const useGetUpsanchAreaAllocationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const getUpsanchAreaById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUpsanchAreaAreaAllocationByIdService(id);
      if (response.result === false) {
        throw {
          message: response.message,
          responseData: response.responseData,
        };
      }
      setResponseData(response);
      console.log(response, 'res');

      return response;
    } catch (err) {
      const error = {
        message: err.message || 'Unknown error occurred',
        responseData: err.responseData || 'Failed to Get Upsanch Area By Id',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { getUpsanchAreaById, loading, error, responseData };
};

export const useUpdateUpsanchAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const updateUpsanchArea = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUpsanchAreaAllocationService(id, data);
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
        responseData: err.responseData || 'Failed to update Upsanch Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateUpsanchArea, loading, error, responseData };
};

export const useDeleteUpsanchAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const deleteUpsanchArea = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUpsanchAreaAllocationService(id);
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
        responseData: err.responseData || 'Failed to delete Upsanch Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUpsanchArea, loading, error, responseData };
};
