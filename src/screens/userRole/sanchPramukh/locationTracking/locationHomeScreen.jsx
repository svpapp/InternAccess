// screens/locationTracking/locationHomeScreen.js
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AuthContext } from '../../../../context/AuthContext';
import TravelList from '../../../../components/locationTracking/TravelList';

const LocationHomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);

  const isAdmin = userInfo?.role === 'superAdmin' || 
                 userInfo?.role === 'systemAdmin' || 
                 userInfo?.role === 'anchalPramukh';

  const canStartTravel = userInfo?.role === 'upSanchPramukh' || 
                        userInfo?.role === 'sanchPramukh' || 
                        userInfo?.role === 'sankulPramukh' || 
                        userInfo?.role === 'anchalPramukh';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meeting Travel Tracker</Text>
      
      {canStartTravel && (
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Travel')}
          style={styles.button}
        >
          Start New Travel
        </Button>
      )}

      <TravelList />
      
      {isAdmin && (
        <>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Stats')}
            style={styles.button}
          >
            View Statistics
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Reports')}
            style={styles.button}
          >
            Monthly Reports
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default LocationHomeScreen;