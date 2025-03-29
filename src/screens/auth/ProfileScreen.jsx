// const userRole = () => {
//   if (userInfo.role === 'systemAdmin' || userInfo.role === 'superAdmin') {
//   }
// };
// const handleHistory = async () => {
//   if (!userInfo || !userInfo._id) {
//     Alert.alert('Error', 'User information is not available.');
//     return;
//   }
//   try {
//     const response = await getAnchalPramukhDataById(userInfo._id);
//     // console.log('History  Response:', response);
//   } catch (err) {
//     console.error('Error history role:', err);
//     Alert.alert(
//       'Error',
//       err.message || 'An error occurred while history roles.',
//     );
//   }
// };

//!
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import useAuth from '../../hooks/auth/useAuth';
import {
  useToggleAnchalToPrashikshanPramukhRole,
  useGetAnchalToPrashikshanRoleChangeHistoryById,
} from '../../hooks/switchRole/useAnchalToPrashikshanRole';

const ProfileScreen = ({navigation}) => {
  const {logout, userInfo} = useAuth();
  const {toggleAnchalToPrashikshanPramukhData, error, loading, responseData} =
    useToggleAnchalToPrashikshanPramukhRole();
  const [isLoading, setIsLoading] = useState(false);

  const {getAnchalPramukhDataById} =
    useGetAnchalToPrashikshanRoleChangeHistoryById();

  const handleLogout = async () => {
    try {
      if (!userInfo || !userInfo.role) {
        Alert.alert('Logout Error', 'User role is not defined.');
        return;
      }
      await logout();
      console.log('User logout success profile page');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Logout Error',
        'An error occurred during logout. Please try again.',
      );
      console.error('Logout error:', error);
    }
  };

  const handleUserInfo = () => {
    try {
      console.log('userinfo new', userInfo);
    } catch (error) {
      throw error;
    }
  };

  const handleChangePassword = () => {
    try {
      console.log('Change password');
      navigation.navigate('ChangePasswordScreen');
    } catch (error) {
      console.logerror();
    }
  };

  useEffect(() => {
    // console.log('userinfo', userInfo);
  }, []);

  const fetchNewRole = async () => {
    if (!userInfo || !userInfo._id) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await getAnchalPramukhDataById(userInfo._id);
      console.log('History Response:', response);

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
  const handleSwitchRole = async () => {
    if (!userInfo || !userInfo._id) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }
    try {
      const response = await toggleAnchalToPrashikshanPramukhData(userInfo._id);
      // console.log('Switch Role Response:', response);
      Alert.alert('Success', 'Role switched successfully.');
    } catch (err) {
      console.error('Error switching role:', err);
      Alert.alert(
        'Error',
        err.message || 'An error occurred while switching roles.',
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userInfo ? userInfo.userName : 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userInfo ? userInfo.svpEmail : 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{userInfo ? userInfo.role : 'N/A'}</Text>
      </View>

      <Button
        title="Change Password"
        onPress={handleChangePassword}
        color="#007BFF"
      />

      {userInfo?.role !== 'systemAdmin' &&
        userInfo?.role !== 'superAdmin' &&
        userInfo?.role !== 'aacharya' &&
        userInfo?.role !== 'pradhan' &&
        userInfo?.role !== 'uppradhan' &&
        userInfo?.role !== 'sachiv' &&
        userInfo?.role !== 'upsachiv' &&
        userInfo?.role !== 'sadasya1' &&
        userInfo?.role !== 'sadasya2' &&
        userInfo?.role !==
          'sadasya3'(
            <Button
              title="Switch Role"
              onPress={handleSwitchRole}
              color="#007BFF"
            />,
          )}

      <Button title="Logout" onPress={handleLogout} color="#ff4444" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
