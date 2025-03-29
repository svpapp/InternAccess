import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import {verifyOtp} from '../../utils/ValidationSchema';
import Input from '../../components/common/Input/Input';
import GradientButton from '../../components/common/button/GradientButton';
import FormField from '../../components/common/formData/FormField';

const VerifyOtpForm = ({onSubmit}) => {
  const handleReset = async (values, {resetForm}) => {
    try {
      await onSubmit(values);
      Alert.alert('OTP verify Successful');
      resetForm();
    } catch (error) {
      console.error('OTP verify failed', error);
    }
  };
  return (
    <Formik
      initialValues={{
        otp: '',
      }}
      validationSchema={verifyOtp}
      onSubmit={handleReset}
      validateOnMount>
      {({handleSubmit, isValid}) => (
        <View style={styles.container}>
          <FormField name="otp">
            <Input placeholder="Enter Otp" type="text" style={styles.input} />
          </FormField>

          <GradientButton
            title="Verify OTP"
            onPress={handleSubmit}
            disabled={!isValid}
            gradientColors={['#4F46E5', '#7C3AED']}
            style={styles.button}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default VerifyOtpForm;
