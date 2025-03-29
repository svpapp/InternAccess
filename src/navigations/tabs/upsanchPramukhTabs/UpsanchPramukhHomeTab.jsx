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

import ProfileScreen from '../../../screens/auth/ProfileScreen';
import HomeScreenUpsanchPramukh from '../../../screens/userRole/upsanchPramukh/HomeScreenUpsanchPramukh';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UpdateKifScreen from '../../../screens/userRole/anchalPramukh/UpdateKifScreen';
import GramSamarastaSurvey from '../../../components/forms/GramSamarastaForm';
import GramSurveyForm from '../../../components/forms/GramSurveyForm';
import GramSvavlambanForm from '../../../components/forms/GramSvavlambanForm';

const Stack = createNativeStackNavigator();

const { width } = Dimensions.get('window');
const isMobile = width <= 768;

const UpsanchPramukhHomeTab = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          name="HomeScreenUpsanchPramukh"
          component={HomeScreenUpsanchPramukh}
          options={{
            headerTitle: 'Upsanch Pramukh Dashboard',
          }}
        />
        <Stack.Screen
          name="updateKif"
          component={UpdateKifScreen}
          options={{
            headerTitle: 'Update KIF',
          }}
        />
        <Stack.Screen
          name="gramSamarasta"
          component={GramSamarastaSurvey}
          options={{
            headerTitle: 'Gram Samarasta',
          }}
        />
        <Stack.Screen
          name="gramsurvey"
          component={GramSurveyForm}
          options={{
            headerTitle: 'Gram Survey',
          }}
        />
        <Stack.Screen
          name="gramsvavlamban"
          component={GramSvavlambanForm}
          options={{
            headerTitle: 'Gram Survey',
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

export default UpsanchPramukhHomeTab;
