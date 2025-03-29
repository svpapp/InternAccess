// import {View, Text} from 'react-native';
// import React from 'react';

// const Sadasya3TabNavigator = () => {
//   return (
//     <View>
//       <Text>Sadasya3TabNavigator</Text>
//     </View>
//   );
// };

// export default Sadasya3TabNavigator;

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import Sadasya3HomeTab from '../../../tabs/gramSamiti/sadasya3Tabs/Sadasya3HomeTab';
import Sadasya3ProfileTab from '../../../tabs/gramSamiti/sadasya3Tabs/Sadasya3ProfileTab';

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

            if (route.name === 'Sadasya3HomeTab') {
              iconName = 'home';
            } else if (route.name === 'Sadasya3ProfileTab') {
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
        <Tab.Screen name="Sadasya3HomeTab" component={Sadasya3HomeTab} />

        <Tab.Screen name="Sadasya3ProfileTab" component={Sadasya3ProfileTab} />
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
