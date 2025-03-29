import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import ResetPasswordForm from '../../components/forms/ResetPasswordForm';
import {resetPasswordService} from '../../api/auth/authService';

const ResetPasswordScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {otp, svpEmail} = route.params;

  const handleResetPassword = async ({newPassword, confirmPassword}) => {
    if (!svpEmail?.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    if (!otp?.trim()) {
      Alert.alert('Error', 'OTP is required');
      return;
    }

    if (!newPassword?.trim() || !confirmPassword?.trim()) {
      Alert.alert('Error', 'Please provide new and confirm password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordService({
        svpEmail: svpEmail.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      console.log('Password reset successful:', result);

      Alert.alert('Success', 'Password Reset Successful', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      const errorMessages = {
        missing_fields: 'All fields (email, OTP, and passwords) are required!',
        invalid_email: 'Please provide a valid email address!',
        invalid_otp_format: 'OTP must be a six-digit number',
        password_mismatch: 'New password and confirm password do not match!',
        password_complexity:
          'Password must include at least one uppercase letter, one number, and one special character.',
        user_not_found: 'User not found',
        invalid_otp: 'Invalid OTP! Please check the code and try again.',
        otp_expired: 'OTP has expired. Please request a new one.',
        password_reset_successful:
          'Password reset successful! You can now log in with your new password.',
        default: 'An unexpected error occurred. Please try again later.',
      };

      const errorCode =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message;

      const errorMessage =
        errorMessages[errorCode] ||
        error?.response?.data?.responseData ||
        errorMessages.default;

      Alert.alert('Error', errorMessage);
      console.error('Password reset error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Please reset your password to continue
        </Text>
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default ResetPasswordScreen;
