import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import Sadasya1HomeTab from '../../../tabs/gramSamiti/sadasya1Tabs/Sadasya1HomeTab';
import Sadasya1ProfileTab from '../../../tabs/gramSamiti/sadasya1Tabs/Sadasya1ProfileTab';

const Tab = createBottomTabNavigator();

const Sadasya1TabNavigator = ({navigationRef}) => {
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

            if (route.name === 'Sadasya1HomeTab') {
              iconName = 'home';
            } else if (route.name === 'Sadasya1ProfileTab') {
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
        <Tab.Screen name="Sadasya1HomeTab" component={Sadasya1HomeTab} />

        <Tab.Screen name="Sadasya1ProfileTab" component={Sadasya1ProfileTab} />
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

export default Sadasya1TabNavigator;
