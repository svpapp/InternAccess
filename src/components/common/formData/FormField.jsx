

// import React from 'react';
// import {View, StyleSheet} from 'react-native';
// import {useField} from 'formik';

// const FormField = ({name, children, label}) => {
//   const [field, meta] = useField(name);

//   const handleChange = value => {
//     field.onChange(name)(value);
//   };

//   return (
//     <View style={styles.container}>
//       {React.cloneElement(children, {
//         name: name,
//         onChangeText: handleChange,
//         onBlur: () => field.onBlur(name)(),
//         value: field.value,
//         error: meta.touched && meta.error ? meta.error : null,
//         label: label,
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//     width: '100%',
//   },
// });

// export default FormField;



//!
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useField} from 'formik';

const FormField = ({name, children}) => {
  const [field, meta] = useField(name);

  // Create a single handler that can be passed to the input component
  const handleChange = value => {
    field.onChange(name)(value);
  };

  const handleBlur = () => {
    field.onBlur(name)();
  };

  // Get error only if touched and has error
  const error = meta.touched && meta.error ? meta.error : null;

  return (
    <View style={styles.container}>
      {React.cloneElement(children, {
        name: name,
        onChangeText: handleChange,
        onBlur: handleBlur,
        value: field.value,
        error: error,
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
});

export default FormField;