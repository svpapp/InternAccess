import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const HomeScreenSystemAdmin = ({navigation}) => {
  const handleNavigateTempPassContainer = () => {
    navigation.navigate('TempPassContainer');
  };
  const handleNavigateAreaAllocationContainer = () => {
    navigation.navigate('AreaAllocationContainer');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('PartialKif')}>
        <Text style={{color: 'white', fontSize: 16}}>Create KIF</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateTempPassContainer}>
        <Text style={styles.buttonText}>Get Temporary Passwords</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateAreaAllocationContainer}>
        <Text style={styles.buttonText}>Get Area Allocation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreenSystemAdmin;
