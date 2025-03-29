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
import HomeScreenSystemAdmin from '../../../screens/userRole/systemAdmin/HomeScreenSystemAdmin';
import PartialKIF from '../../../screens/userRole/systemAdmin/PartialKIF';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TempPassAnchalPramukh from '../../../components/tempPass/TempPassAnchalPramukh';
import TempPassSankulPramukh from '../../../components/tempPass/TempPassSankulPramukh';
import TempPassSanchPramukh from '../../../components/tempPass/TempPassSanchPramukh';
import TempPassUpsanchPramukh from '../../../components/tempPass/TempPassUpsanchPramukh';
import TempPassContainer from '../../../components/tempPass/TempPassContainer';
import GetAnchalAreaAllocation from '../../../components/areaAllocation/GetAnchalAreaAllocation';
import GetSankulAreaAllocation from '../../../components/areaAllocation/GetSankulAreaAllocation';
import GetSanchAreaAllocation from '../../../components/areaAllocation/GetSanchAreaAllocation';
import GetUpsanchAreaAllocation from '../../../components/areaAllocation/GetUpsanchAreaAllocation';
import AreaAllocationContainer from '../../../components/areaAllocation/AreaAllocationContainer';
import UpdateAnchalAreaAllocation from '../../../components/areaAllocation/UpdateAnchalAreaAllocation';
import UpdateSankulAreaAllocation from '../../../components/areaAllocation/UpdateSankulAreaAllocation';
import UpdateSanchAreaAllocation from '../../../components/areaAllocation/UpdateSanchAreaAllocation';
import UpdateUpsanchAreaAllocation from '../../../components/areaAllocation/UpdateUpsanchAreaAllocation';

const Stack = createNativeStackNavigator();

const {width} = Dimensions.get('window');
const isMobile = width <= 768;

const SystemAdminHomeTab = () => {
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
          name="HomeScreenSystemAdmin"
          component={HomeScreenSystemAdmin}
          options={{
            headerTitle: 'System Admin Dashboard',
          }}
        />
        <Stack.Screen
          name="PartialKif"
          component={PartialKIF}
          options={{
            headerTitle: 'System Admin Dashboard',
          }}
        />
        <Stack.Screen
          name="TempPassAnchalPramukh"
          component={TempPassAnchalPramukh}
          options={{
            headerTitle: 'Temporary Password',
          }}
        />
        <Stack.Screen
          name="TempPassSankulPramukh"
          component={TempPassSankulPramukh}
          options={{
            headerTitle: 'Temporary Password',
          }}
        />
        <Stack.Screen
          name="TempPassSanchPramukh"
          component={TempPassSanchPramukh}
          options={{
            headerTitle: 'Temporary Password',
          }}
        />
        <Stack.Screen
          name="TempPassUpsanchPramukh"
          component={TempPassUpsanchPramukh}
          options={{
            headerTitle: 'Temporary Password',
          }}
        />
        <Stack.Screen
          name="TempPassContainer"
          component={TempPassContainer}
          options={{
            headerTitle: 'Temporary Password',
          }}
        />
        <Stack.Screen
          name="GetAnchalAreaAllocation"
          component={GetAnchalAreaAllocation}
          options={{
            headerTitle: 'Anchal Area',
          }}
        />
        <Stack.Screen
          name="GetSankulAreaAllocation"
          component={GetSankulAreaAllocation}
          options={{
            headerTitle: 'Sankul Area',
          }}
        />
        <Stack.Screen
          name="GetSanchAreaAllocation"
          component={GetSanchAreaAllocation}
          options={{
            headerTitle: 'Sanch Area',
          }}
        />
        <Stack.Screen
          name="GetUpsanchAreaAllocation"
          component={GetUpsanchAreaAllocation}
          options={{
            headerTitle: 'Upsanch Area',
          }}
        />
        <Stack.Screen
          name="AreaAllocationContainer"
          component={AreaAllocationContainer}
          options={{
            headerTitle: 'Area Allocation',
          }}
        />
        <Stack.Screen
          name="UpdateAnchalAreaAllocation"
          component={UpdateAnchalAreaAllocation}
          options={{
            headerTitle: 'Update Anchal Area',
          }}
        />
        <Stack.Screen
          name="UpdateSankulAreaAllocation"
          component={UpdateSankulAreaAllocation}
          options={{
            headerTitle: 'Update Sankul Area',
          }}
        />
        <Stack.Screen
          name="UpdateSanchAreaAllocation"
          component={UpdateSanchAreaAllocation}
          options={{
            headerTitle: 'Update Sanch Area',
          }}
        />
        <Stack.Screen
          name="UpdateUpsanchAreaAllocation"
          component={UpdateUpsanchAreaAllocation}
          options={{
            headerTitle: 'Update Upsanch Area',
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

export default SystemAdminHomeTab;
