import instance from '../auth/AxiosInstance';

const API_URL = '/api/v1/userRole';
export const anchalPramukhTempPassService = async () => {
  try {
    const response = await instance.get(
      `${API_URL}/get-anchal-pramukh-temporary-pass`,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Temp Pass Anchal Pramukh service error',
      );
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData;
  } catch (error) {
    console.error(
      'Error fetching Anchal Pramukh Temp Pass:',
      error.message || error,
    );
    throw new Error(
      'Error fetching Anchal Pramukh Temp Pass. Please try again later.',
    );
  }
};
export const sankulPramukhTempPassService = async () => {
  try {
    const response = await instance.get(
      `${API_URL}/get-sankul-pramukh-temporary-pass`,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Temp Pass Sankul Pramukh service error',
      );
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData;
  } catch (error) {
    console.error(
      'Error fetching Sankul Pramukh Temp Pass:',
      error.message || error,
    );
    throw new Error(
      'Error fetching Sankul Pramukh Temp Pass. Please try again later.',
    );
  }
};
export const sanchPramukhTempPassService = async () => {
  try {
    const response = await instance.get(
      `${API_URL}/get-sanch-pramukh-temporary-pass`,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Temp Pass Sanch Pramukh service error',
      );
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData;
  } catch (error) {
    console.error(
      'Error fetching Sanch Pramukh Temp Pass:',
      error.message || error,
    );
    throw new Error(
      'Error fetching Sanch Pramukh Temp Pass. Please try again later.',
    );
  }
};

export const upsanchPramukhTempPassService = async () => {
  try {
    const response = await instance.get(
      `${API_URL}/get-upsanch-pramukh-temporary-pass`,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Temp Pass Upsanch Pramukh service error',
      );
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData;
  } catch (error) {
    console.error(
      'Error fetching Upsanch Pramukh Temp Pass:',
      error.message || error,
    );
    throw new Error(
      'Error fetching Upsanch Pramukh Temp Pass. Please try again later.',
    );
  }
};
