import {useState, useEffect} from 'react';
import {
  getNewSanchAreaAllocationService,
  postNewSanchAreaAllocationService,
  deleteSanchAreaAllocationService,
  getSanchAreaAreaAllocationByIdService,
  updateSanchAreaAllocationService,
} from '../../../api/newAreaAllocation/sanchArea/sanchAreaService';

export const usePostNewSanchAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const postSanchArea = async data => {
    setLoading(true);
    setError(null);
    try {
      const response = await postNewSanchAreaAllocationService(data);

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
        responseData: err.responseData || 'Failed to post Sanch Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {postSanchArea, loading, error, responseData};
};

export const useGetNewSanchAreaAllocation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDataSanchArea = async () => {
      setLoading(true);
      try {
        const result = await getNewSanchAreaAllocationService();
        setData(result);
      } catch (error) {
        console.error('Error fetching Sanch Area:', error);
        setError(
          error.message ||
            'Failed to fetch Sanch Area. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDataSanchArea();
  }, []);

  return {data, loading, error};
};

export const useGetSanchAreaAllocationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const getSanchAreaById = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSanchAreaAreaAllocationByIdService(id);
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
        responseData: err.responseData || 'Failed to Get Sanch Area By Id',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {getSanchAreaById, loading, error, responseData};
};

export const useUpdateSanchAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const updateSanchArea = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateSanchAreaAllocationService(id, data);
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
        responseData: err.responseData || 'Failed to update Sanch Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {updateSanchArea, loading, error, responseData};
};

export const useDeleteSanchAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const deleteSanchArea = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteSanchAreaAllocationService(id);
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
        responseData: err.responseData || 'Failed to delete Sanch Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {deleteSanchArea, loading, error, responseData};
};
