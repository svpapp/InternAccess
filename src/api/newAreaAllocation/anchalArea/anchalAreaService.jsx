import instance from '../../auth/AxiosInstance';

export const getNewAnchalAreaAllocationService = async () => {
  try {
    const response = await instance.get(
      '/api/v1/areaAllocation/anchalArea/get-anchal-area-allocation',
    );

    if (response.data?.result !== true) {
      throw new Error(response.data?.message || 'Failed to fetch Anchal data');
    }

    if (
      !response.data?.responseData ||
      !Array.isArray(response.data.responseData)
    ) {
      throw new Error('Invalid response data format.');
    }

    return response.data.responseData || [];
  } catch (error) {
    console.error('Error fetching Anchal Area:', error.message || error);
    throw new Error('Anchal Area fetch failed. Please try again later.');
  }
};

export const postNewAnchalAreaAllocationService = async data => {
  try {
    const response = await instance.post(
      '/api/v1/areaAllocation/anchalArea/post-anchal-area-allocation',
      data,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAnchalAreaAreaAllocationByIdService = async (id, data) => {
  try {
    const response = await instance.get(
      `/api/v1/areaAllocation/anchalArea/get-anchal-area-allocation-id/${id}`,
      data,
    );

    if (response.data?.result !== true) {
      throw new Error(
        response.data?.message || 'Failed to Get Anchal data By Id',
      );
    }

    return response.data.responseData;
  } catch (error) {
    console.error('Error Getting Anchal Area By Id:', error.message || error);
    throw new Error(
      'Anchal Area Getting  By Id failed. Please try again later.',
    );
  }
};

export const updateAnchalAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.put(
      `/api/v1/areaAllocation/anchalArea/update-anchal-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating Anchal Area:', error.message || error);

    throw error.response?.data || error;
  }
};

export const deleteAnchalAreaAllocationService = async (id, data) => {
  try {
    const response = await instance.delete(
      `/api/v1/areaAllocation/anchalArea/delete-anchal-area-allocation-id/${id}`,
      data,
    );

    return response.data;
  } catch (error) {
    console.error('Error Deleting Anchal Area:', error.message || error);
    throw error.response?.data || error;
  }
};
