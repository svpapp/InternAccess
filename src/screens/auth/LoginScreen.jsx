import React, {useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import LoginForm from '../../components/forms/LoginForm';
import useAuth from '../../hooks/auth/useAuth';

const LoginScreen = ({navigation}) => {
  const {login, userInfo, isLoading} = useAuth();

  useEffect(() => {
    if (userInfo) {
    }
  }, [userInfo]);

  const handleLogin = async ({svpEmail, password}) => {
    if (!svpEmail || !password) {
      Alert.alert('Error', 'Please provide both email and password');
      return;
    }

    try {
      const result = await login(svpEmail, password);
      Alert.alert('Success', `Welcome ${result.user.userName}!`);
    } catch (error) {
      const errorMessages = {
        Unauthorized: 'Invalid email or password',
        incorrect_password: 'Incorrect password. Please try again.',
        invalid_email_or_password: 'Invalid SVP Email or password.',
        missing_credentials: 'Please provide both email and password to login.',
        invalid_role: 'Invalid role selected.',
        temp_password_expired:
          'Your temporary password has expired. Please reset your password.',
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

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please Login to continue</Text>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            onPress={handleForgotPassword}
            disabled={isLoading}
            style={styles.forgotBtn}>
            <Text style={styles.forgotBtnText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
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
  forgotPasswordContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  forgotBtnText: {
    color: 'blue',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LoginScreen;
