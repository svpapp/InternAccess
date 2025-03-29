import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';

import {useNavigation} from '@react-navigation/native';
import {forgotPasswordService} from '../../api/auth/authService';
const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async ({svpEmail}) => {
    if (!svpEmail) {
      Alert.alert('Error', 'Please provide SVP email');
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPasswordService(svpEmail);
      Alert.alert('Success', 'SVP Email Verify Successful', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('VerifyOtpScreen', {
              svpEmail: svpEmail,
            });
          },
        },
      ]);
    } catch (error) {
      const errorMessages = {
        missing_credentials: 'Please provide SVP email!',
        invalid_role_svpEmail: 'No user found with this email',
        account_deleted: 'This account has been deleted',
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Please Verify SVP email to continue</Text>
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
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

export default ForgotPasswordScreen;
