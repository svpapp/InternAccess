import instance from '../../auth/AxiosInstance';

export const getNewSanchAreaAllocationService = async () => {
  try {
    const response = await instance.get(
      '/api/v1/areaAllocation/sanchArea/get-sanch-area-allocation',
    );

    if (response.data?.result !== true) {
      throw new Error(response.data?.message || 'Failed to fetch Sanch data');
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData || [];
  } catch (error) {
    console.error('Error fetching Sanch Area:', error.message || error);
    throw new Error('Sanch Area fetch failed. Please try again later.');
  }
};

export const postNewSanchAreaAllocationService = async data => {
  try {
    const response = await instance.post(
      '/api/v1/areaAllocation/sanchArea/post-sanch-area-allocation',
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error posting sanch area:', error);
    throw error.response?.data || error;
  }
};

export const getSanchAreaAreaAllocationByIdService = async (id, data) => {
  try {
    const response = await instance.get(
      `/api/v1/areaAllocation/sanchArea/get-sanch-area-allocation-id/${id}`,
      data,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Failed to Get Sanch data By Id',
      );
    }

    return response.data.responseData;
  } catch (error) {
    console.error('Error Getting Sanch Area By Id:', error.message || error);
    throw new Error(
      'Sanch Area Getting  By Id failed. Please try again later.',
    );
  }
};

export const updateSanchAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.put(
      `/api/v1/areaAllocation/sanchArea/update-sanch-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating Sanch Area:', error.message || error);

    throw error.response?.data || error;
  }
};

export const deleteSanchAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.delete(
      `/api/v1/areaAllocation/sanchArea/delete-sanch-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error Deleting Sanch Area:', error.message || error);
    throw error.response?.data || error;
  }
};
