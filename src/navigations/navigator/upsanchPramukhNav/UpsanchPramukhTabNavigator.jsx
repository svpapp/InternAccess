import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import SystemAdminProfileTab from '../../tabs/systemAdminTabs/SystemAdminProfileTab';
import SystemAdminHomeTab from '../../tabs/systemAdminTabs/SystemAdminHomeTab';
import UpsanchPramukhProfileTab from '../../tabs/upsanchPramukhTabs/UpsanchPramukhProfileTab';
import UpsanchPramukhHomeTab from '../../tabs/upsanchPramukhTabs/UpsanchPramukhHomeTab';
import UpsanchPramukhChatTab from '../../tabs/upsanchPramukhTabs/UpsanchPramukhChatTab';

const Tab = createBottomTabNavigator();

const UpsanchPramukhTabNavigator = ({navigationRef}) => {
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

            if (route.name === 'UpsanchPramukhHomeTab') {
              iconName = 'home';
            } else if (route.name === 'UpsanchPramukhProfileTab') {
              iconName = 'person';
            }
             else if (route.name === 'UpsanchPramukhChatTab') {
              iconName = 'chatbubbles';
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
          name="UpsanchPramukhHomeTab"
          component={UpsanchPramukhHomeTab}
        />

        <Tab.Screen
          name="UpsanchPramukhProfileTab"
          component={UpsanchPramukhProfileTab}
        />
        <Tab.Screen
          name="UpsanchPramukhChatTab"
          component={UpsanchPramukhChatTab}
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

export default UpsanchPramukhTabNavigator;
