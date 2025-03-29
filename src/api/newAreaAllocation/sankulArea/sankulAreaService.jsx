import instance from '../../auth/AxiosInstance';

export const getNewSankulAreaAllocationService = async () => {
  try {
    const response = await instance.get(
      '/api/v1/areaAllocation/sankulArea/get-sankul-area-allocation',
    );

    if (response.data?.result !== true) {
      throw new Error(response.data?.message || 'Failed to fetch Sankul data');
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData || [];
  } catch (error) {
    console.error('Error fetching Sankul Area:', error.message || error);
    throw new Error('Sankul Area fetch failed. Please try again later.');
  }
};

export const postNewSankulAreaAllocationService = async data => {
  try {
    const response = await instance.post(
      '/api/v1/areaAllocation/sankulArea/post-sankul-area-allocation',
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error posting Sankul Area:', error);
    throw error.response?.data || error;
  }
};

export const getSankulAreaAreaAllocationByIdService = async (id, data) => {
  try {
    const response = await instance.get(
      `/api/v1/areaAllocation/sankulArea/get-sankul-area-allocation-id/${id}`,
      data,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Failed to Get Sankul data By Id',
      );
    }

    return response.data.responseData;
  } catch (error) {
    console.error('Error Getting Sankul Area By Id:', error.message || error);
    throw new Error(
      'Sankul Area Getting  By Id failed. Please try again later.',
    );
  }
};

export const updateSankulAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.put(
      `/api/v1/areaAllocation/sankulArea/update-sankul-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating Sankul Area:', error.message || error);

    throw error.response?.data || error;
  }
};

export const deleteSankulAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.delete(
      `/api/v1/areaAllocation/sankulArea/delete-sankul-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error Deleting Sankul Area:', error.message || error);
    throw error.response?.data || error;
  }
};
