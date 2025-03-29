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

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreenSankulPramukh from '../../../screens/userRole/sankulPramukh/HomeScreenSankulPramukh';
import UpdateKifScreen from '../../../screens/userRole/anchalPramukh/UpdateKifScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const {width} = Dimensions.get('window');
const isMobile = width <= 768;

const SankulPramukhHomeTab = () => {
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
          name="HomeScreenSankulPramukh"
          component={HomeScreenSankulPramukh}
          options={{
            headerTitle: 'Sankul Pramukh Dashboard',
          }}
        />
         <Stack.Screen
          name="updateKif"
          component={UpdateKifScreen}
          options={{
            headerTitle: 'Update KIF',
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

export default SankulPramukhHomeTab;
