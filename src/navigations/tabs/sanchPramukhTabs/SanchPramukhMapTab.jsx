//// WRK FNE
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import locationHomeScreen from '../../../screens/userRole/sanchPramukh/locationTracking/locationHomeScreen';
import store from '../../../redux/store/store';
import TravelScreen from '../../../screens/userRole/sanchPramukh/locationTracking/TravelScreen';

const Stack = createNativeStackNavigator();

const { width } = Dimensions.get('window');
const isMobile = width <= 768;

const SanchPramukhMapTab = () => {
  return (
    <Provider store={store}>

      <GestureHandlerRootView >
        <MenuProvider>

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
              name="locationHomeScreen"
              component={locationHomeScreen}
              options={{
                headerTitle: 'Sanch Pramukh Dashboard',
              }}
            />
            <Stack.Screen
              name="Travel"
              component={TravelScreen}
              options={{
                headerTitle: 'Sanch Pramukh Dashboard',
              }}
            />
          


          </Stack.Navigator>
        </MenuProvider>
      </GestureHandlerRootView>
    </Provider>
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

export default SanchPramukhMapTab;
