// import {View, Text} from 'react-native';
// import React from 'react';

// const Sadasya3HomeTab = () => {
//   return (
//     <View>
//       <Text>Sadasya3HomeTab</Text>
//     </View>
//   );
// };

// export default Sadasya3HomeTab;

import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Sadasya3HomeScreen from '../../../../screens/userRole/gramSamiti/sadasya3/Sadasya3HomeScreen';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const {width} = Dimensions.get('window');
const isMobile = width <= 768;

const Sadasya3HomeTab = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar backgroundColor="#ff6b6b" barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff6b6b',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Sadasya3HomeScreen"
          component={Sadasya3HomeScreen}
          options={{
            headerTitle: 'Sadasya-3 Home Dashboard',
          }}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

const logoWidth = isMobile ? width * 0.8 : 300;
const styles = StyleSheet.create({
  headerLogo: {
    width: logoWidth,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  headerLogoMobile: {
    width: width * 0.8,
  },
});

export default Sadasya3HomeTab;
