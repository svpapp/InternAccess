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

const GetUpsanchAreaAllocation = ({navigation}) => {
  const [upupsanchDataList, setupupsanchDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getUpupsanchData = async () => {
    try {
      const response = await instance.get(
        '/api/v1/areaAllocation/upSanchArea/get-upSanch-area-allocation',
      );
      if (response.data.result && Array.isArray(response.data.responseData)) {
        setupupsanchDataList(response.data.responseData.reverse());
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
    getUpupsanchData();
  }, []);

  const handleEdit = upSanchNameId => {
    console.log(`Edit clicked for Upsanch Area Id: ${upSanchNameId}`);
    navigation.navigate('UpdateUpsanchAreaAllocation', {
      upSanchNameId: upSanchNameId,
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

  const renderUpsanchData = upsanchData => (
    <View key={upsanchData.upSanchNameId} style={styles.anchalRow}>
      <View style={styles.headerContainer}>
        <View style={styles.zoneRow}>
          <Text style={styles.zoneName}>
            Zone Name: {upsanchData.zoneName || 'Not Available'}
          </Text>
          <TouchableOpacity
            onPress={() => handleEdit(upsanchData.upSanchNameId)}>
            <Icon
              name="edit"
              size={20}
              color="#2196F3"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.anchalName}>
          Anchal Name: {upsanchData.anchalName || 'Not Available'}
        </Text>
        <Text style={styles.sankulName}>
          Sankul Name: {upsanchData.sankulName || 'Not Available'}
        </Text>
        <Text style={styles.sankulName}>
          Sanch Name: {upsanchData.sanchName || 'Not Available'}
        </Text>
        <Text style={styles.sankulName}>
          Upsanch Name: {upsanchData.upSanchName || 'Not Available'}
        </Text>
      </View>
      {renderStates(upsanchData.states)}
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

  if (!upupsanchDataList.length) {
    return <Text style={styles.noDataText}>No Upsanch areas available</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {upupsanchDataList.map(renderUpsanchData)}
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

export default GetUpsanchAreaAllocation;
