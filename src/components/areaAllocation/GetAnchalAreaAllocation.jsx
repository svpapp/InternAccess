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

const GetAnchalAreaAllocation = ({navigation}) => {
  const [anchalDataList, setAnchalDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAnchalData = async () => {
    try {
      const response = await instance.get(
        '/api/v1/areaAllocation/anchalArea/get-anchal-area-allocation',
      );
      if (response.data.result && Array.isArray(response.data.responseData)) {
        setAnchalDataList(response.data.responseData.reverse());
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
    getAnchalData();
  }, []);

  const handleEdit = anchalAreaId => {
    console.log(`Edit clicked for Anchal Area Id: ${anchalAreaId}`);

    navigation.navigate('UpdateAnchalAreaAllocation', {
      anchalAreaId: anchalAreaId,
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

  const renderAnchalArea = anchalData => (
    <View key={anchalData.anchalAreaId} style={styles.anchalRow}>
      <View style={styles.headerContainer}>
        <Text style={styles.zoneName}>
          Zone Name: {anchalData.zoneName || 'Not Available'}
        </Text>
        <View style={styles.editContainer}>
          <Text style={styles.anchalName}>
            Anchal Name: {anchalData.anchalName || 'Not Available'}
          </Text>
          <TouchableOpacity onPress={() => handleEdit(anchalData.anchalAreaId)}>
            <Icon
              name="edit"
              size={20}
              color="#2196F3"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {renderStates(anchalData.states)}
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

  if (!anchalDataList.length) {
    return <Text style={styles.noDataText}>No anchal areas available</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {anchalDataList.map(renderAnchalArea)}
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
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  anchalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  editIcon: {
    marginLeft: 8,
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

export default GetAnchalAreaAllocation;
