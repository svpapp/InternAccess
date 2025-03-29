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

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ChatsScreen from '../../../screens/userRole/anchalPramukh/Chat/ChatsScreen';
import ChatMessagesScreen from '../../../screens/userRole/anchalPramukh/Chat/ChatMessagesScreen';
import AddMembers from '../../../screens/userRole/anchalPramukh/Chat/AddMembers';
import { MenuProvider } from 'react-native-popup-menu';
import GroupDetails from '../../../screens/userRole/anchalPramukh/Chat/Groupdetails';
import ForwardScreen from '../../../screens/userRole/anchalPramukh/Chat/ForwardScreen';

const Stack = createNativeStackNavigator();

const { width } = Dimensions.get('window');
const isMobile = width <= 768;

const AnchalPramukhChatTab = () => {
  return (
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
            name="Chats"
            component={ChatsScreen}
            options={{
              headerTitle: 'Anchal Pramukh Dashboard',
            }}
          />
          <Stack.Screen
            name="AddMembers"
            component={AddMembers}
            options={{
              headerTitle: 'Anchal Pramukh Dashboard',
            }}
          />
          <Stack.Screen
            name="Messages"
            component={ChatMessagesScreen}
            options={{
              headerTitle: 'Anchal Pramukh Dashboard',
            }}
          />
          <Stack.Screen
            name="Groupdetails"
            component={GroupDetails}
            options={{
              headerTitle: 'Anchal Pramukh Dashboard',
            }}
          />
          <Stack.Screen
            name="ForwardScreen"
            component={ForwardScreen}
            options={{
              headerTitle: 'Anchal Pramukh Dashboard',
            }}
          />


        </Stack.Navigator>
      </MenuProvider>
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

export default AnchalPramukhChatTab;
