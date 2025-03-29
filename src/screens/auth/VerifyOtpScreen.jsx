import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import VerifyOtpForm from '../../components/forms/VerifyOtpForm';
import {
  resendOtpService,
  resetPasswordService,
} from '../../api/auth/authService';

const TIMER_DURATION = 5 * 60;
const RESEND_COOLDOWN = 30;

const VerifyOtpScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  const route = useRoute();
  const navigation = useNavigation();
  const {svpEmail} = route.params || {};

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleTimerExpired = useCallback(() => {
    setIsTimerExpired(true);
    Alert.alert(
      'OTP Expired',
      'Your OTP has expired. Please click "Resend OTP" to get a new code.',
      [{text: 'OK', style: 'default'}],
    );
  }, []);

  useEffect(() => {
    let timerInterval;

    if (timeRemaining > 0 && !isTimerExpired) {
      timerInterval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleTimerExpired();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timeRemaining, isTimerExpired, handleTimerExpired]);

  useEffect(() => {
    let cooldownInterval;

    if (resendCooldown > 0) {
      setCanResend(false);
      cooldownInterval = setInterval(() => {
        setResendCooldown(prevTime => {
          if (prevTime <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
      }
    };
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (!canResend) {
      Alert.alert(
        'Please Wait',
        `You can request a new OTP in ${formatTime(resendCooldown)}`,
      );
      return;
    }

    try {
      setIsLoading(true);
      await resendOtpService(svpEmail);

      setTimeRemaining(TIMER_DURATION);
      setIsTimerExpired(false);
      setResendCooldown(RESEND_COOLDOWN);

      Alert.alert('Success', 'New OTP has been sent to your email');
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Failed to resend OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async ({otp}) => {
    if (isTimerExpired) {
      Alert.alert('Error', 'OTP has expired. Please request a new one.');
      return;
    }

    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please provide a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      navigation.replace('ResetPasswordScreen', {
        otp: otp,
        svpEmail: svpEmail,
      });
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Failed to verify OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getResendButtonText = () => {
    if (!canResend) {
      return `Resend OTP in ${formatTime(resendCooldown)}`;
    }
    return isLoading ? 'Sending...' : 'Resend OTP';
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Please enter the OTP sent to {svpEmail}
        </Text>

        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timerText,
              timeRemaining < 60 && styles.timerWarning,
            ]}>
            Time Remaining: {formatTime(timeRemaining)}
          </Text>
        </View>

        <VerifyOtpForm
          onSubmit={handleVerifyOtp}
          isLoading={isLoading}
          isDisabled={isTimerExpired}
        />

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={!canResend || isLoading}
          style={[
            styles.resendButton,
            (!canResend || isLoading) && styles.resendButtonDisabled,
          ]}>
          <Text
            style={[
              styles.resendButtonText,
              (!canResend || isLoading) && styles.resendButtonTextDisabled,
            ]}>
            {getResendButtonText()}
          </Text>
        </TouchableOpacity>
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  timerWarning: {
    color: '#DC2626',
  },
  resendButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
  },
  resendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  resendButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  resendButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default VerifyOtpScreen;
