import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from '../../navigations/RootNavigation';

const instance = axios.create({
  baseURL: 'http://192.168.1.27:5001',
  // baseURL: 'http://192.168.137.1:5001',
  // baseURL: 'http://192.168.1.123:5001',
  // baseURL: 'https://demo-ityk.onrender.com',

});

instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data) {
      config.headers['Content-Type'] =
        config.data instanceof FormData
          ? 'multipart/form-data'
          : 'application/json';
    }

    return config;
  },
  error => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        await AsyncStorage.clear();

        if (navigationRef.isReady()) {
          navigationRef.navigate('Login');
        } else {
          console.error('NavigationRef is not ready.');
        }

        return Promise.reject(
          new Error('Session expired. Please login again.'),
        );
      }

      const message = getErrorMessage(status);
      console.error(`Error ${status}: ${message}`);
    } else {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  },
);

const getErrorMessage = status =>
  ({
    400: 'Bad Request: Please check your input.',
    401: 'Unauthorized: Please login again.',
    403: "Forbidden: You don't have permission.",
    404: "Not Found: The requested resource doesn't exist.",
    500: 'Server Error: Please try again later.',
  }[status] || 'An unexpected error occurred.');

export default instance;
