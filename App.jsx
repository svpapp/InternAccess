import {createRef, useState} from 'react';

import {AuthProvider} from './src/context/AuthContext';
import AppProvider from './src/navigations/appProvider/AppProvider';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {navigationRef} from './src/navigations/RootNavigation';
import {NotificationProvider} from './src/context/NotificationContext';
import {FormProvider} from './src/context/FormContext';
import {LogBox} from 'react-native';


const originalConsoleError = console.error;
console.error = (message, ...args) => {
  if (
    typeof message === 'string' &&
    message.includes("Cannot read property 'persist' of undefined")
  ) {
   
    return;
  }
  originalConsoleError(message, ...args);
};


LogBox.ignoreLogs(["Cannot read property 'persist' of undefined"]);

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <FormProvider>
          <NotificationProvider>
            <AppProvider />
          </NotificationProvider>
        </FormProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
