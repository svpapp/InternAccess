

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import UpsachivHomeTab from '../../../tabs/gramSamiti/upsachivTabs/UpsachivHomeTab';
import UpsachivProfileTab from '../../../tabs/gramSamiti/upsachivTabs/UpsachivProfileTab';

const Tab = createBottomTabNavigator();

const UpsachivTabNavigator = ({navigationRef}) => {
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

            if (route.name === 'UpsachivHomeTab') {
              iconName = 'home';
            } else if (route.name === 'UpsachivProfileTab') {
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
        <Tab.Screen name="UpsachivHomeTab" component={UpsachivHomeTab} />

        <Tab.Screen name="UpsachivProfileTab" component={UpsachivProfileTab} />
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

export default UpsachivTabNavigator;
