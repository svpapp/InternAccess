import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const AreaAllocationContainer = ({navigation}) => {
  const handleNavigateAnchalArea = () => {
    navigation.navigate('GetAnchalAreaAllocation');
  };

  const handleNavigateSankulArea = () => {
    navigation.navigate('GetSankulAreaAllocation');
  };

  const handleNavigateSanchArea = () => {
    navigation.navigate('GetSanchAreaAllocation');
  };

  const handleNavigateUpsanchArea = () => {
    navigation.navigate('GetUpsanchAreaAllocation');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Area Allocation</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateAnchalArea}>
        <Text style={styles.buttonText}>Get Anchal Area</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateSankulArea}>
        <Text style={styles.buttonText}>Get Sankul Area</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNavigateSanchArea}>
        <Text style={styles.buttonText}>Get Sanch Area</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateUpsanchArea}>
        <Text style={styles.buttonText}>Get Upsanch Area</Text>
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

export default AreaAllocationContainer;
