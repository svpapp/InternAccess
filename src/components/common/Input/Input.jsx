
// import React, {useState} from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Entypo';

// const Input = ({
//   value,
//   onChangeText,
//   onBlur,
//   placeholder,
//   secureTextEntry,
//   keyboardType = 'default',
//   autoCapitalize = 'none',
//   isPasswordVisible,
//   togglePasswordVisibility,
//   autoCapitalizeWords = false,
//   preventNumbers = false,
//   minLength,
//   maxLength,
//   minValue,
//   maxValue,
//   name,
//   style,
//   error,
//   label,
//   ...props
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleChangeText = text => {
//     let newValue = text;

//     if (keyboardType === 'phone-pad' || keyboardType === 'decimal-pad') {
//       // Handle empty input
//       if (newValue === '') {
//         onChangeText && onChangeText('');
//         return;
//       }

//       // Convert to number and check bounds
//       const numValue = parseFloat(newValue);

//       // Don't update if the value is not a valid number
//       if (isNaN(numValue)) return;

//       // Enforce min/max constraints
//       if (maxValue !== undefined && numValue > maxValue) {
//         newValue = maxValue.toString();
//       }
//       if (minValue !== undefined && numValue < minValue) {
//         newValue = minValue.toString();
//       }
//     } else {
//       // Handle text input logic
//       if (preventNumbers) {
//         newValue = newValue.replace(/[0-9]/g, '');
//       }

//       if (autoCapitalizeWords) {
//         newValue = newValue
//           .split(' ')
//           .map(word =>
//             word.length > 0
//               ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//               : '',
//           )
//           .join(' ');
//       }

//       if (maxLength && newValue.length > maxLength) {
//         newValue = newValue.slice(0, maxLength);
//       }
//     }

//     onChangeText && onChangeText(newValue);
//   };

//   const handleFocus = () => {
//     setIsFocused(true);
//   };

//   const handleBlur = e => {
//     setIsFocused(false);
//     onBlur && onBlur();
//   };

//   return (
//     <View style={[styles.container, style]}>
//       {label && <Text style={styles.label}>{label}</Text>}
//       <View
//         style={[
//           styles.inputContainer,
//           isFocused && styles.focusedInput,
//           error && styles.errorInput,
//         ]}>
//         <TextInput
//           style={styles.input}
//           placeholder={placeholder}
//           value={value}
//           onChangeText={handleChangeText}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           secureTextEntry={secureTextEntry && !isPasswordVisible}
//           autoCapitalize={autoCapitalizeWords ? 'words' : autoCapitalize}
//           keyboardType={keyboardType}
//           placeholderTextColor="#9CA3AF"
//           {...props}
//         />
//         {secureTextEntry && (
//           <TouchableOpacity
//             onPress={togglePasswordVisibility}
//             style={styles.eyeIcon}>
//             <Icon
//               name={isPasswordVisible ? 'eye' : 'eye-with-line'}
//               size={20}
//               color="#6B7280"
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#4B5563',
//     marginBottom: 8,
//   },
//   inputContainer: {
//     position: 'relative',
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   focusedInput: {
//     borderColor: '#4F46E5',
//   },
//   errorInput: {
//     borderColor: '#EF4444',
//   },
//   input: {
//     height: 56,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     fontSize: 16,
//     color: '#1F2937',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 16,
//     top: '50%',
//     transform: [{translateY: -10}],
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 4,
//     marginLeft: 4,
//   },
// });

// export default Input;


//!v
import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const Input = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCapitalizeWords = false,
  preventNumbers = false,
  minLength,
  maxLength,
  minValue,
  maxValue,
  name,
  style,
  error,
  label,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const handleChangeText = text => {
    let newValue = text;

    if (keyboardType === 'phone-pad' || keyboardType === 'decimal-pad') {
      // Handle empty input
      if (newValue === '') {
        onChangeText && onChangeText(newValue);
        return;
      }

      // Convert to number and check bounds
      const numValue = parseFloat(newValue);

      // Don't update if the value is not a valid number
      if (isNaN(numValue)) return;

      // Enforce min/max constraints
      if (maxValue !== undefined && numValue > maxValue) {
        newValue = maxValue.toString();
      }
      if (minValue !== undefined && numValue < minValue) {
        newValue = minValue.toString();
      }
    } else {
      // Handle text input logic
      if (preventNumbers) {
        newValue = newValue.replace(/[0-9]/g, '');
      }

      if (autoCapitalizeWords) {
        newValue = newValue
          .split(' ')
          .map(word =>
            word.length > 0
              ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              : '',
          )
          .join(' ');
      }

      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }
    }

    onChangeText && onChangeText(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
          autoCapitalize={autoCapitalizeWords ? 'words' : autoCapitalize}
          keyboardType={keyboardType}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
            activeOpacity={0.7}>
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-with-line'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusedInput: {
    borderColor: '#4F46E5',
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;