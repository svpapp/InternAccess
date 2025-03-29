import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const HomeScreenUpsanchPramukh = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>HomeScreenUpsanchPramukh</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center'
        }}
        onPress={() => navigation.navigate('updateKif')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Update KIF</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center'
        }}
        onPress={() => navigation.navigate('gramSamarasta')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Gram Samarasta </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center'
        }}
        onPress={() => navigation.navigate('gramsurvey')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Gram Survey </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center'
        }}
        onPress={() => navigation.navigate('gramsvavlamban')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Gram Svavlamban </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenUpsanchPramukh;
