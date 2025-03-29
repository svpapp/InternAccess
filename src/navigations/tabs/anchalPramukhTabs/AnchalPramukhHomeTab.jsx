// //// WRK FNE
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   StatusBar,
//   Dimensions,
// } from 'react-native';
// import React from 'react';

// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import HomeScreenAnchalPramukh from '../../../screens/userRole/anchalPramukh/HomeScreenAnchalPramukh';
// import UpdateKifScreen from '../../../screens/userRole/anchalPramukh/UpdateKifScreen';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import useAuth from '../../../hooks/auth/useAuth';
// import { useGetAnchalToPrashikshanRoleChangeHistoryById} from '../../../hooks/switchRole/useAnchalToPrashikshanRole'
// const Stack = createNativeStackNavigator();
// const { userInfo} = useAuth();
// const {width} = Dimensions.get('window');
// const isMobile = width <= 768;
// const { getAnchalPramukhDataById} = useGetAnchalToPrashikshanRoleChangeHistoryById();

// const AnchalPramukhHomeTab = () => {
//     const handleHistory = async () => {
//       if (!userInfo || !userInfo._id) {
//         Alert.alert('Error', 'User information is not available.');
//         return;
//       }
//       try {
//         const response = await getAnchalPramukhDataById(userInfo._id);
//         console.log('History  Response:', response);
//       } catch (err) {
//         console.error('Error history role:', err);
//         Alert.alert(
//           'Error',
//           err.message || 'An error occurred while history roles.',
//         );
//       }
//     };
//   return (
//     <GestureHandlerRootView >
//       <StatusBar backgroundColor="#ff6b6b" barStyle="light-content" />
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#ff6b6b',
//           },
//           headerTintColor: '#fff',
//           headerTitleAlign: 'center',
//         }}>
//         <Stack.Screen
//           name="HomeScreenAnchalPramukh"
//           component={HomeScreenAnchalPramukh}
//           options={{
//             headerTitle: '${} Dashboard',
//           }}
//         />
//         <Stack.Screen
//           name="updateKif"
//           component={UpdateKifScreen}
//           options={{
//             headerTitle: 'Update KIF',
//           }}
//         />
//       </Stack.Navigator>
//       </GestureHandlerRootView>

//   );
// };

// const logoWidth = isMobile ? width * 0.8 : 300;
// const styles = StyleSheet.create({
//   headerLogo: {
//     width: logoWidth,
//     height: 40,
//     resizeMode: 'contain',
//     alignSelf: 'center',
//   },
//   headerLogoMobile: {
//     width: width * 0.8,
//   },
// });

// export default AnchalPramukhHomeTab;
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreenAnchalPramukh from '../../../screens/userRole/anchalPramukh/HomeScreenAnchalPramukh';
import UpdateKifScreen from '../../../screens/userRole/anchalPramukh/UpdateKifScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import useAuth from '../../../hooks/auth/useAuth';
import {useGetAnchalToPrashikshanNewRoleStatusById} from '../../../hooks/switchRole/useAnchalToPrashikshanRole';
import AnchalToPrashikshanRoleSwitch from '../../../components/switchRoleHistory/AnchalToPrashikshanRoleSwitch';

const Stack = createNativeStackNavigator();
const {width} = Dimensions.get('window');
const isMobile = width <= 768;
const POLLING_INTERVAL = 3000;

const AnchalPramukhHomeTab = () => {
  const {userInfo} = useAuth();
  const {getAnchalPramukhDataById} =
    useGetAnchalToPrashikshanNewRoleStatusById();
  const [currentRole, setCurrentRole] = useState('anchalPramukh');

  const handleHistory = async () => {
    if (!userInfo || !userInfo._id) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }
    try {
      const response = await getAnchalPramukhDataById(userInfo._id);
      // console.log('History Response:', response);

      if (response?.message?.newRole) {
        setCurrentRole(response.message.newRole);
      }
    } catch (err) {
      console.error('Error history role:', err);
      Alert.alert(
        'Error',
        err.message || 'An error occurred while fetching role history.',
      );
    }
  };

  useEffect(() => {
    handleHistory();

    const intervalId = setInterval(() => {
      handleHistory();
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [userInfo]);

  const getHeaderTitle = () => {
    return currentRole === 'prashikshanPramukh'
      ? 'Prashikshan Pramukh Dashboard'
      : 'Anchal Pramukh Dashboard';
  };

  return (
    <GestureHandlerRootView>
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
          name="HomeScreenAnchalPramukh"
          component={HomeScreenAnchalPramukh}
          options={{
            headerTitle: getHeaderTitle(),
          }}
        />
        <Stack.Screen
          name="updateKif"
          component={UpdateKifScreen}
          options={{
            headerTitle: 'Update KIF',
          }}
        />
        <Stack.Screen
          name="AnchalToPrashikshanRoleSwitch"
          component={AnchalToPrashikshanRoleSwitch}
          options={{
            headerTitle: 'Role Switch History',
          }}
        />
      </Stack.Navigator>
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

export default AnchalPramukhHomeTab;
