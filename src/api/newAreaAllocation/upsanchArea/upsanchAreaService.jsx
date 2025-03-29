import instance from '../../auth/AxiosInstance';

export const getNewUpsanchAreaAllocationService = async () => {
  try {
    const response = await instance.get(
      '/api/v1/areaAllocation/upSanchArea/get-upSanch-area-allocation',
    );

    if (response.data?.result !== true) {
      throw new Error(response.data?.message || 'Failed to fetch Upsanch data');
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData || [];
  } catch (error) {
    console.error('Error fetching Upsanch Area:', error.message || error);
    throw new Error('Upsanch Area fetch failed. Please try again later.');
  }
};

export const postNewUpsanchAreaAllocationService = async data => {
  try {
    const response = await instance.post(
      '/api/v1/areaAllocation/upSanchArea/post-upSanch-area-allocation',
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error posting upsanch area:', error);
    throw error.response?.data || error;
  }
};

export const getUpsanchAreaAreaAllocationByIdService = async (id, data) => {
  try {
    const response = await instance.get(
      `/api/v1/areaAllocation/upSanchArea/get-upSanch-area-allocation-id/${id}`,
      data,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Failed to Get Upsanch data By Id',
      );
    }

    return response.data.responseData;
  } catch (error) {
    console.error('Error Getting Upsanch Area By Id:', error.message || error);
    throw new Error(
      'Upsanch Area Getting  By Id failed. Please try again later.',
    );
  }
};

export const updateUpsanchAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.put(
      `/api/v1/areaAllocation/upSanchArea/update-up-sanch-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating Upsanch Area:', error.message || error);

    throw error.response?.data || error;
  }
};

export const deleteUpsanchAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.delete(
      `/api/v1/areaAllocation/upSanchArea/delete-upSanch-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error Deleting Upsanch Area:', error.message || error);
    throw error.response?.data || error;
  }
};
