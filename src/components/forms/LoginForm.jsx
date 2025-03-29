


//!
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {loginSchema} from '../../utils/ValidationSchema';
import Input from '../../components/common/Input/Input';
import GradientButton from '../../components/common/button/GradientButton';
import FormField from '../../components/common/formData/FormField';

const LoginForm = ({onSubmit, isLoading}) => {
  const handleSubmit = async (values, {resetForm}) => {
    try {
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Formik
      initialValues={{svpEmail: '', password: ''}}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
      validateOnMount>
      {({handleSubmit, isValid}) => (
        <View style={styles.container}>
          <FormField name="svpEmail">
            <Input
              placeholder="SVP Email ID"
              keyboardType="email-address"
              style={styles.input}
            />
          </FormField>
          <FormField name="password">
            <Input
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
            />
          </FormField>
          <GradientButton
            title="Login"
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

export default LoginForm;

