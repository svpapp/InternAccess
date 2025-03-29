import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';


import SanchPramukhProfileTab from '../../tabs/sanchPramukhTabs/SanchPramukhProfileTabl';
import SanchPramukhHomeTab from '../../tabs/sanchPramukhTabs/SanchPramukhHomeTab';
import SanchPramukhChatTab from '../../tabs/sanchPramukhTabs/SanchPramukhChatTab';
import SanchPramukhMapTab from '../../tabs/sanchPramukhTabs/SanchPramukhMapTab';

const Tab = createBottomTabNavigator();

const SanchPramukhTabNavigator = ({navigationRef}) => {
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

            if (route.name === 'SanchPramukhHomeTab') {
              iconName = 'home';
            } else if (route.name === 'SanchPramukhProfileTab') {
              iconName = 'person';
            } else if (route.name === 'SanchPramukhChatTab') {
              iconName = 'chatbubbles';
            }
             else if (route.name === 'SanchPramukhMapTab') {
              iconName = 'location';
            }

            return <Icon name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: '#ddd',
          tabBarShowLabel: false,
          tabBarStyle: {display: 'flex'},
          headerShown: false,
        })}>
        <Tab.Screen
          name="SanchPramukhHomeTab"
          component={SanchPramukhHomeTab}
        />

        <Tab.Screen
          name="SanchPramukhProfileTab"
          component={SanchPramukhProfileTab}
        />
        <Tab.Screen
          name="SanchPramukhChatTab"
          component={SanchPramukhChatTab}
        />
        <Tab.Screen
          name="SanchPramukhMapTab"
          component={SanchPramukhMapTab}
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

export default SanchPramukhTabNavigator;
