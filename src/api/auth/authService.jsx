import instance from './AxiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = '/api/v1/userRole';

export const loginService = async (svpEmail, password) => {
  try {
    const endpoint = `${API_URL}/post-login-svp-role-all`;
    const response = await instance.post(endpoint, {svpEmail, password});

    if (response.data.success) {
      await storeUserData(response.data.token, response.data.user);
    }
    return response.data;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

export const logoutService = async () => {
  try {
    const endpoint = `${API_URL}/get-logout-all-role`;
    await instance.get(endpoint);
    await clearUserData();
  } catch (error) {
    console.error('Logout service error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const endpoint = `${API_URL}/get-my-profile-svp-role`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const changePasswordService = async (
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  try {
    const endpoint = `${API_URL}/post-changePassword-svp-role-all`;
    const response = await instance.post(endpoint, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Change Password service error:', error);
    throw error;
  }
};

export const forgotPasswordService = async svpEmail => {
  try {
    const endpoint = `${API_URL}/post-forgotPassword-all-role`;
    const response = await instance.post(endpoint, {svpEmail});
    return response.data;
  } catch (error) {
    console.error('Forgot Password service error:', error);
    throw error;
  }
};

export const resetPasswordService = async (
  svpEmail,
  otp,
  newPassword,
  confirmPassword,
) => {
  try {
    const endpoint = `${API_URL}/post-resetPassword-all-role`;
    const response = await instance.post(endpoint, {
      svpEmail,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Reset Password error:', error);
    throw error;
  }
};

export const resendOtpService = async svpEmail => {
  try {
    const endpoint = `${API_URL}/post-resendOtp-all-role`;
    const response = await instance.post(endpoint, {svpEmail});
    return response.data;
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
};

export const storeUserData = async (token, user) => {
  try {
    await AsyncStorage.multiSet([
      ['userToken', token],
      ['userInfo', JSON.stringify(user)],
    ]);
    return true;
  } catch (error) {
    console.error('Store user data error:', error);
    throw error;
  }
};

export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Get user token error:', error);
    return null;
  }
};

export const getUserInfo = async () => {
  try {
    const userStr = await AsyncStorage.getItem('userInfo');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Get user info error:', error);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    return true;
  } catch (error) {
    console.error('Clear user data error:', error);
    throw error;
  }
};
