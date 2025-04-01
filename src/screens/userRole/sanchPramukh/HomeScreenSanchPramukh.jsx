import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const HomeScreenSanchPramukh = () => {
    const navigation = useNavigation();
  
  return (
    <View>
      <Text>HomeScreenSanchPramukh</Text>
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
              <Text style={{color: 'white', fontSize: 16}}>Update KIF</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                backgroundColor: '#007AFF',
                padding: 15,
                borderRadius: 8,
                marginTop: 20,
                alignItems: 'center'
              }}
              onPress={() => navigation.navigate('gramsurveyreports')} 
            >
              <Text style={{color: 'white', fontSize: 16}}>Gram Survey Form Report</Text>
            </TouchableOpacity>
    </View>
  );
};

export default HomeScreenSanchPramukh;
