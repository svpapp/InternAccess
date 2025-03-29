import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const TempPassContainer = ({navigation}) => {
  const handleNavigateAnchalPramukh = () => {
    navigation.navigate('TempPassAnchalPramukh');
  };

  const handleNavigateSankulPramukh = () => {
    navigation.navigate('TempPassSankulPramukh');
  };

  const handleNavigateSanchPramukh = () => {
    navigation.navigate('TempPassSanchPramukh');
  };

  const handleNavigateUpsanchPramukh = () => {
    navigation.navigate('TempPassUpsanchPramukh');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temporary Passwords</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateAnchalPramukh}>
        <Text style={styles.buttonText}>Get Anchal Pramukh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateSankulPramukh}>
        <Text style={styles.buttonText}>Get Sankul Pramukh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateSanchPramukh}>
        <Text style={styles.buttonText}>Get Sanch Pramukh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateUpsanchPramukh}>
        <Text style={styles.buttonText}>Get Upsanch Pramukh</Text>
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

export default TempPassContainer;
