import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import instance from '../../api/auth/AxiosInstance';
import Icon from 'react-native-vector-icons/AntDesign';

const GetSankulAreaAllocation = ({navigation}) => {
  const [sankulDataList, setsankulDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getSankulData = async () => {
    try {
      const response = await instance.get(
        '/api/v1/areaAllocation/sankulArea/get-sankul-area-allocation',
      );
      if (response.data.result && Array.isArray(response.data.responseData)) {
        setsankulDataList(response.data.responseData.reverse());
      } else {
        setError('No valid data received from the server.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSankulData();
  }, []);

  const handleEdit = sankulNameId => {
    console.log(`Edit clicked for Sankul Area Id: ${sankulNameId}`);
    navigation.navigate('UpdateSankulAreaAllocation', {
      sankulNameId: sankulNameId,
    });
  };

  const renderVillages = villages =>
    Array.isArray(villages) && villages.length > 0 ? (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Villages:</Text>
        {villages.map(village => (
          <Text key={village._id} style={styles.villageName}>
            • {village.villageName}
          </Text>
        ))}
      </View>
    ) : (
      <Text style={styles.noDataText}>No villages available</Text>
    );

  const renderSubdistricts = subdistricts =>
    Array.isArray(subdistricts) && subdistricts.length > 0 ? (
      subdistricts.map(subdistrict => (
        <View key={subdistrict._id} style={styles.subdistrictContainer}>
          <Text style={styles.subdistrictName}>
            Subdistrict: {subdistrict.subDistrictName}
          </Text>
          {renderVillages(subdistrict.villages)}
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No subdistricts available</Text>
    );

  const renderDistricts = districts =>
    Array.isArray(districts) && districts.length > 0 ? (
      districts.map(district => (
        <View key={district._id} style={styles.districtContainer}>
          <Text style={styles.districtName}>
            District: {district.districtName}
          </Text>
          {renderSubdistricts(district.subdistricts)}
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No districts available</Text>
    );

  const renderStates = states =>
    Array.isArray(states) && states.length > 0 ? (
      states.map(state => (
        <View key={state._id} style={styles.stateContainer}>
          <Text style={styles.stateName}>State: {state.stateName}</Text>
          {renderDistricts(state.districts)}
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No states available</Text>
    );

  const renderAnchalArea = sankulData => (
    <View key={sankulData.sankulNameId} style={styles.anchalRow}>
      <View style={styles.headerContainer}>
        <View style={styles.zoneRow}>
          <Text style={styles.zoneName}>
            Zone Name: {sankulData.zoneName || 'Not Available'}
          </Text>
          <TouchableOpacity onPress={() => handleEdit(sankulData.sankulNameId)}>
            <Icon
              name="edit"
              size={20}
              color="#2196F3"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.anchalName}>
          Anchal Name: {sankulData.anchalName || 'Not Available'}
        </Text>
        <Text style={styles.sankulName}>
          Sankul Name: {sankulData.sankulName || 'Not Available'}
        </Text>
      </View>
      {renderStates(sankulData.states)}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!sankulDataList.length) {
    return <Text style={styles.noDataText}>No Sankul areas available</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {sankulDataList.map(renderAnchalArea)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#d32f2f',
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  anchalRow: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  headerContainer: {
    marginBottom: 8,
  },
  zoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    marginLeft: 8,
  },
  anchalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  sankulName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  stateContainer: {
    marginTop: 8,
  },
  stateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  districtContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  districtName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  subdistrictContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  subdistrictName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  villageName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
    marginTop: 4,
  },
});

export default GetSankulAreaAllocation;
