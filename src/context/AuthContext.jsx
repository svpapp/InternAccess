import React, {createContext, useState, useEffect, useCallback} from 'react';
import * as authService from '../api/auth/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const login = async (svpEmail, password) => {
    setIsLoading(true);
    try {
      const response = await authService.loginService(svpEmail, password);
      if (response.success) {
        setUserToken(response.token);
        console.log('tokencheck',response.token);

        await AsyncStorage.setItem('token', response.token);  // Store token in AsyncStorage

        
        setUserInfo(response.user);
        console.log('userinfocheck',response.user);
        
        await fetchProfile();
        return {success: true, user: response.user};
      }
      return {success: false};
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
      return response;
    } catch (error) {
      console.error('Fetch profile error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUserToken(null);
      setUserInfo(null);
      setUserProfile(null);
      setIsLoading(false);
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const [token, user] = await Promise.all([
        authService.getUserToken(),
        authService.getUserInfo(),
      ]);

      if (token && user) {
        setUserToken(token);
        setUserInfo(user);
        try {
          await fetchProfile();
        } catch (error) {
          console.error('Session validation failed:', error);
          await logout();
        }
      }
    } catch (error) {
      console.error('Login status check error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, logout]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const changePassword = async (
    currentPassword,
    newPassword,
    confirmPassword,
  ) => {
    setIsLoading(true);
    try {
      const response = await authService.changePasswordService(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      return {success: true, data: response};
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async svpEmail => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPasswordService(svpEmail);
      return {success: true, data: response};
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async svpEmail => {
    setIsLoading(true);
    try {
      const response = await authService.resendOtpService(svpEmail);
      return {success: true, data: response};
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (svpEmail, otp, newPassword, confirmPassword) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPasswordService(
        svpEmail,
        otp,
        newPassword,
        confirmPassword,
      );
      return {success: true, data: response};
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        fetchProfile,
        changePassword,
        forgotPassword,
        resendOtp,
        resetPassword,
        userToken,
        userInfo,
        userProfile,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
