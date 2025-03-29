import {useState, useEffect} from 'react';

import {
  patchAnchalToPrashikshanPramukhService,
  getAnchalToPrashikshanPramukhToggleHistoryById,
  getAnchalToPrashikshanPramukhNewRoleStatusById,
} from '../../api/switchRole/anchalToPrashikshanPramukh/anchalToPrashikshanPramukhRoleService';

export const useGetAnchalToPrashikshanRoleChangeHistoryById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const getAnchalPramukhDataById = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAnchalToPrashikshanPramukhToggleHistoryById(id);
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
        responseData:
          err.responseData || 'Failed to Get Anchal to Prashikshan By Id',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {getAnchalPramukhDataById, loading, error, responseData};
};
export const useGetAnchalToPrashikshanNewRoleStatusById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const getAnchalPramukhDataById = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAnchalToPrashikshanPramukhNewRoleStatusById(id);
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
        responseData:
          err.responseData || 'Failed to Get Anchal to Prashikshan By Id',
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {getAnchalPramukhDataById, loading, error, responseData};
};
export const useToggleAnchalToPrashikshanPramukhRole = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const toggleAnchalToPrashikshanPramukhData = async id => {
    setLoading(true);
    setError(null);
    try {
      const response = await patchAnchalToPrashikshanPramukhService(id);
      if (!response.result) {
        throw new Error(response.message || 'Failed to toggle role');
      }
      setResponseData(response);
      return response;
    } catch (err) {
      const errorDetails = {
        message: err.message || 'Unknown error occurred',
        responseData: err.responseData || 'Failed to toggle role',
      };
      setError(errorDetails);
      throw errorDetails;
    } finally {
      setLoading(false);
    }
  };

  return {toggleAnchalToPrashikshanPramukhData, loading, error, responseData};
};
