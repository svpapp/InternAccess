

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

import ProfileScreen from '../../../../screens/auth/ProfileScreen';
import ChangePasswordScreen from '../../../../screens/auth/ChangePasswordScreen';
import LoginScreen from '../../../../screens/auth/LoginScreen';
const Stack = createNativeStackNavigator();

const {width} = Dimensions.get('window');
const isMobile = width <= 768;

const UpsachivProfileTab = () => {
  return (
    <View style={{flex: 1}}>
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
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerTitle: 'Profile',
          }}
        />

        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{
            headerTitle: 'Change Password',
          }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: 'Login',
          }}
        />
      </Stack.Navigator>
    </View>
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

export default UpsachivProfileTab;
