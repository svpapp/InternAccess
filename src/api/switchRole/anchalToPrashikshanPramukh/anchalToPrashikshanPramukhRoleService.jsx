import instance from '../../../api/auth/AxiosInstance';

const API_URL = '/api/v1/userRole';

export const patchAnchalToPrashikshanPramukhService = async (id, data) => {
  try {
    const response = await instance.patch(
      `${API_URL}/toggle-role-anchal-prashikshan/${id}`,
      data,
    );

    // console.log(response.data, 'toggle data ');
    return response.data;
  } catch (error) {
    console.error('Toggle Anchal to Prashikshan and vice versa:', error);
    throw error;
  }
};

export const getAnchalToPrashikshanPramukhToggleHistoryById = async (
  id,
  data,
) => {
  try {
    const response = await instance.get(
      `${API_URL}/role-switch-history/${id}`,
      data,
    );
    // console.log(response.data, 'toggle  data hisory ');

    return response.data;
  } catch (error) {
    console.error('Toggle Anchal to Prashikshan and vice versa:', error);
    throw error;
  }
};
export const getAnchalToPrashikshanPramukhNewRoleStatusById = async (
  id,
  data,
) => {
  try {
    const response = await instance.get(
      `${API_URL}/get-current-role-switch-status/${id}`,
      data,
    );
    // console.log(response.data, 'toggle  data hisory ');

    return response.data;
  } catch (error) {
    console.error('New Role Status:', error);
    throw error;
  }
};
