// import React from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const GradientButton = ({
//   onPress,
//   loading,
//   title,
//   disabled,
//   gradientColors = ['#0000FF', '#6495ED'],
//   style,
//   ...props
// }) => {
//   return (
//     <LinearGradient
//       colors={gradientColors}
//       style={[styles.button, style]}
//       {...props}>
//       <TouchableOpacity
//         onPress={onPress}
//         disabled={loading || disabled}
//         style={styles.touchable}>
//         <View style={styles.content}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#ffffff" />
//           ) : (
//             <Text style={styles.title}>{title}</Text>
//           )}
//         </View>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     borderRadius: 10,
//     overflow: 'hidden',
//     width: '100%',
//   },
//   touchable: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     opacity: props => (props.disabled ? 0.7 : 1),
//   },
//   content: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default GradientButton;







import React from 'react';
import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({
  onPress,
  loading,
  title,
  disabled,
  gradientColors = ['#4F46E5', '#7C3AED'],
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[styles.button, style, disabled && styles.disabled]}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GradientButton;