import {View, Text, StyleSheet, Alert} from 'react-native';
import React from 'react';
import ChangePasswordForm from '../../components/forms/ChangePasswordForm';
import useAuth from '../../hooks/auth/useAuth';

const ChangePasswordScreen = ({navigation}) => {
  const {changePassword, logout} = useAuth();

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please provide current,new and confirm password');
      return;
    }

    try {
      const result = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      Alert.alert('Success', `Password Change Successfully`);
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      const errorMessages = {
        missing_credentials: 'Please provide all password fields!',
        newpass_confirmpass_not_matched:
          'New password and confirm password do not match!',
        new_pass_8_16_char: 'New password must be between 8 and 16 characters!',
        temp_pass_expired:
          'Your temporary password has expired. Please request a new one.',
        current_pass_incorrect: 'Current password is incorrect!',
        pass_change_success:
          'Password changed successfully! You can now log in with your new password.',
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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Please Change Password continue</Text>
        <ChangePasswordForm onSubmit={handleChangePassword} />
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

export default ChangePasswordScreen;
