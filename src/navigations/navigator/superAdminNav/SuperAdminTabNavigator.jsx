import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import SuperAdminProfileTab from '../../tabs/superAdminTabs/superAdminProfileTab';
import SuperAdminHomeTab from '../../tabs/superAdminTabs/superAdminHomeTab';

const Tab = createBottomTabNavigator();

const SuperAdminTabNavigator = ({navigationRef}) => {
  return (
    <LinearGradient
      colors={['#ff6b6b', '#ffc371']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'SuperAdminHomeTab') {
              iconName = 'home';
            } else if (route.name === 'SuperAdminProfileTab') {
              iconName = 'person';
            }

            return <Icon name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: '#ddd',
          tabBarShowLabel: false,
          tabBarStyle: {display: 'flex'},
          headerShown: false,
        })}>
        <Tab.Screen name="SuperAdminHomeTab" component={SuperAdminHomeTab} />

        <Tab.Screen
          name="SuperAdminProfileTab"
          component={SuperAdminProfileTab}
        />
      </Tab.Navigator>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SuperAdminTabNavigator;
