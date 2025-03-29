import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import {changePasswordSchema} from '../../utils/ValidationSchema';
import Input from '../../components/common/Input/Input';
import GradientButton from '../../components/common/button/GradientButton';
import FormField from '../../components/common/formData/FormField';

const ChangePasswordForm = ({onSubmit}) => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prev => !prev);
  };

  const handleSubmit = async (values, {resetForm}) => {
    try {
      await onSubmit(values);
      Alert.alert('Password Change Successful');
      resetForm();
    } catch (error) {
      console.error('Change password failed', error);
    }
  };
  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={changePasswordSchema}
      onSubmit={handleSubmit}
      validateOnMount>
      {({handleSubmit, isValid}) => (
        <View style={styles.container}>
          <FormField name="currentPassword">
            <Input
              placeholder="Enter your Current Password"
              type="text"
              style={styles.input}
            />
          </FormField>
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
            title="Change Password"
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

export default ChangePasswordForm;
