import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {resetPasswordSchema} from '../../utils/ValidationSchema';
import Input from '../../components/common/Input/Input';
import GradientButton from '../../components/common/button/GradientButton';
import FormField from '../../components/common/formData/FormField';

const ResetPasswordForm = ({onSubmit, isLoading}) => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(prev => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prev => !prev);
  };

  const handleReset = async (values, {resetForm}) => {
    try {
      await onSubmit(values);

      resetForm();
    } catch (error) {
      console.error('Reset password failed', error);
    }
  };
  return (
    <Formik
      initialValues={{
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={resetPasswordSchema}
      onSubmit={handleReset}
      validateOnMount>
      {({handleSubmit, isValid}) => (
        <View style={styles.container}>
          <FormField name="newPassword">
            <Input
              placeholder="Enter New Password"
              secureTextEntry={true}
              isPasswordVisible={isNewPasswordVisible}
              togglePasswordVisibility={toggleNewPasswordVisibility}
              style={styles.input}
            />
          </FormField>
          <FormField name="confirmPassword">
            <Input
              placeholder="Enter Confirm Password"
              secureTextEntry={true}
              isPasswordVisible={isConfirmPasswordVisible}
              togglePasswordVisibility={toggleConfirmPasswordVisibility}
              style={styles.input}
            />
          </FormField>
          <GradientButton
            title="Reset Password"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!isValid || isLoading}
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

export default ResetPasswordForm;
