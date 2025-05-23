import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const HomeScreenSankulPramukh = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>HomeSCreenSankulPramukh</Text>
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
    </View>
  );
};

export default HomeScreenSankulPramukh;
