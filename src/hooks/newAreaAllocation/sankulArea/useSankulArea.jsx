import {useState, useEffect} from 'react';
import {
  getNewSankulAreaAllocationService,
  postNewSankulAreaAllocationService,
  deleteSankulAreaAllocationService,
  getSankulAreaAreaAllocationByIdService,
  updateSankulAreaAllocationService,
} from '../../../api/newAreaAllocation/sankulArea/sankulAreaService';

export const usePostNewSankulAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const postSankul = async data => {
    setLoading(true);
    setError(null);
    try {
      const response = await postNewSankulAreaAllocationService(data);
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
        responseData: err.responseData || 'Failed to post Sankul Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {postSankul, loading, error, responseData};
};

export const useGetNewSankulAreaAllocation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDataSankul = async () => {
      setLoading(true);
      try {
        const result = await getNewSankulAreaAllocationService();
        setData(result);
      } catch (error) {
        console.error('Error fetching Sankul Area:', error);
        setError(
          error.message ||
            'Failed to fetch Sankul Area. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDataSankul();
  }, []);

  return {data, loading, error};
};

export const useGetSankulAreaAllocationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const getSankulAreaById = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSankulAreaAreaAllocationByIdService(id);
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
        responseData: err.responseData || 'Failed to Get Sankul Area By Id',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {getSankulAreaById, loading, error, responseData};
};

export const useUpdateSankulAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const updateSankulArea = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateSankulAreaAllocationService(id, data);
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
        responseData: err.responseData || 'Failed to update Sankul Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {updateSankulArea, loading, error, responseData};
};

export const useDeleteSankulAreaAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const deleteSankulArea = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteSankulAreaAllocationService(id);
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
        responseData: err.responseData || 'Failed to delete Sankul Area',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {deleteSankulArea, loading, error, responseData};
};
