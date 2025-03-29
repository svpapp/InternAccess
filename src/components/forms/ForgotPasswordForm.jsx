import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {forgotPasswordSchema} from '../../utils/ValidationSchema';
import Input from '../../components/common/Input/Input';
import GradientButton from '../../components/common/button/GradientButton';
import FormField from '../../components/common/formData/FormField';

const ForgotPasswordForm = ({onSubmit}) => {
  const handleSubmit = async (values, {resetForm}) => {
    try {
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error('SVP Email verify failed', error);
    }
  };

  return (
    <Formik
      initialValues={{
        svpEmail: '',
      }}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleSubmit}
      validateOnMount>
      {({handleSubmit, isValid}) => (
        <View style={styles.container}>
          <FormField name="svpEmail">
            <Input
              placeholder="Enter your SVP email"
              type="email"
              style={styles.input}
            />
          </FormField>

          <GradientButton
            title="Verify SVP Email"
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

export default ForgotPasswordForm;
