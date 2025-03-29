{
  /* <Button title="Add Role" onPress={handleGetNewRole} color="#007BFF" />;
  const handleGetNewRole = async () => {
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
  }; */
}

//!

import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {useGetAnchalToPrashikshanNewRoleStatusById} from '../../../hooks/switchRole/useAnchalToPrashikshanRole';
import useAuth from '../../../hooks/auth/useAuth';

const HomeScreenAnchalPramukh = ({navigation}) => {
  const [currentRole, setCurrentRole] = useState('anchalPramukh');
  const [isLoading, setIsLoading] = useState(false);

  const {userInfo} = useAuth();
  const {getAnchalPramukhDataById} =
    useGetAnchalToPrashikshanNewRoleStatusById();

  const handleGetHistoryRoleSwitch = () => {
    navigation.navigate('AnchalToPrashikshanRoleSwitch');
  };

  const fetchNewRole = async () => {
    if (!userInfo || !userInfo._id) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await getAnchalPramukhDataById(userInfo._id);
      // console.log('History Response:', response);

      if (response?.message?.newRole) {
        setCurrentRole(response.message.newRole);
      }
    } catch (err) {
      console.error('Error fetching role history:', err);
      Alert.alert(
        'Error',
        err.message || 'An error occurred while fetching role history.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewRole();
  }, [userInfo]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchNewRole} />
      }>
      <View>
        <Text style={{color: 'black'}}>HomeScreen</Text>

        {currentRole === 'anchalPramukh' ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 8,
              marginTop: 20,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('updateKif')}>
            <Text style={{color: 'white', fontSize: 16}}>Update KIF</Text>
          </TouchableOpacity>
        ) : currentRole === 'prashikshanPramukh' ? (
          <Button title="Get History" onPress={handleGetHistoryRoleSwitch} />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default HomeScreenAnchalPramukh;
