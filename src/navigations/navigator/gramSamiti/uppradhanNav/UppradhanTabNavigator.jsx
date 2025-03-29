import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import UppradhanHomeTab from '../../../tabs/gramSamiti/uppradhanTabs/UppradhanHomeTab';
import UppradhanProfileTab from '../../../tabs/gramSamiti/uppradhanTabs/UppradhanProfileTab';

const Tab = createBottomTabNavigator();

const Sadasya3TabNavigator = ({navigationRef}) => {
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

            if (route.name === 'UppradhanHomeTab') {
              iconName = 'home';
            } else if (route.name === 'UppradhanProfileTab') {
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
        <Tab.Screen name="UppradhanHomeTab" component={UppradhanHomeTab} />

        <Tab.Screen
          name="UppradhanProfileTab"
          component={UppradhanProfileTab}
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

export default Sadasya3TabNavigator;
