import React, {useContext, useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';

import useAuth from '../../hooks/auth/useAuth';
import AnchalPramukhTabNavigator from '../navigator/anchalPramukhNav/AnchalPramukhTabNavigator';
import SanchPramukhTabNavigator from '../navigator/sanchPramukhNav/SanchPramukhTabNavigator';
import UpsanchPramukhTabNavigator from '../navigator/upsanchPramukhNav/UpsanchPramukhTabNavigator';
import LoginScreen from '../../screens/auth/LoginScreen';
import SankulPramukhTabNavigator from '../navigator/sankulPramukhNav/SankulPramukhTabNavigator';
import AuthStack from '../authStack/AuthStack';
import SuperAdminTabNavigator from '../navigator/superAdminNav/SuperAdminTabNavigator';
import SystemAdminTabNavigator from '../navigator/systemAdminNav/SystemAdminTabNavigator';
import PradhanTabNavigator from '../navigator/gramSamiti/pradhanNav/PradhanTabNavigator';
import UppradhanTabNavigator from '../navigator/gramSamiti/uppradhanNav/UppradhanTabNavigator';
import SachivTabNavigator from '../navigator/gramSamiti/sachivNav/SachivTabNavigator';
import UpsachivTabNavigator from '../navigator/gramSamiti/upsachivNav/UpsachivTabNavigator';
import Sadasya1TabNavigator from '../navigator/gramSamiti/sadasya1Nav/Sadasya1TabNavigator';
import Sadasya2TabNavigator from '../navigator/gramSamiti/sadasya2Nav/Sadasya2TabNavigator';
import Sadasya3TabNavigator from '../navigator/gramSamiti/sadasya3Nav/Sadasya3TabNavigator';
import AacharyaTabNavigator from '../navigator/aacharyaNav/AacharyaTabNavigator'


const AppProvider = () => {
  const {isLoading, userToken, userInfo} = useAuth();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (userInfo && userInfo.role) {
      setUserRole(userInfo.role);
    }
  }, [userInfo]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userToken) {
    return <AuthStack />;
  }

  switch (userRole) {
    case 'superAdmin':
      return <SuperAdminTabNavigator />;
    case 'systemAdmin':
      return <SystemAdminTabNavigator />;

    case 'anchalPramukh':
      return <AnchalPramukhTabNavigator />;
    case 'sankulPramukh':
      return <SankulPramukhTabNavigator />;
    case 'sanchPramukh':
      return <SanchPramukhTabNavigator />;

    case 'upSanchPramukh':
      return <UpsanchPramukhTabNavigator />;
    case 'pradhan':
      return <PradhanTabNavigator />;
    case 'uppradhan':
      return <UppradhanTabNavigator />;
    case 'sachiv':
      return <SachivTabNavigator />;
    case 'upsachiv':
      return <UpsachivTabNavigator />;
    case 'sadasya1':
      return <Sadasya1TabNavigator />;
    case 'sadasya2':
      return <Sadasya2TabNavigator />;
    case 'sadasya3':
      return <Sadasya3TabNavigator />;
    case 'aacharya':
      return <AacharyaTabNavigator />;

    default:
      return <LoginScreen />;
  }
};

export default AppProvider;
