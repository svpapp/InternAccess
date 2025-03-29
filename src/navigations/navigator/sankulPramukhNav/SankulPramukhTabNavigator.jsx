import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import SankulPramukhHomeTab from '../../tabs/sankulPramukhTabs/sankulPramukhHomeTab';
import SankulPramukhProfileTab from '../../tabs/sankulPramukhTabs/SankulPramukhProfileTab';
import SankulPramukhChatTab from '../../tabs/sankulPramukhTabs/SankulPramukhChatTab';

const Tab = createBottomTabNavigator();

const SankulPramukhTabNavigator = ({navigationRef}) => {
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

            if (route.name === 'SankulPramukhHomeTab') {
              iconName = 'home';
            } else if (route.name === 'SankulPramukhProfileTab') {
              iconName = 'person';
            }  else if (route.name === 'SankulPramukhChatTab') {
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
          name="SankulPramukhHomeTab"
          component={SankulPramukhHomeTab}
        />

        <Tab.Screen
          name="SankulPramukhProfileTab"
          component={SankulPramukhProfileTab}
        />
        <Tab.Screen
          name="SankulPramukhChatTab"
          component={SankulPramukhChatTab}
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

export default SankulPramukhTabNavigator;
