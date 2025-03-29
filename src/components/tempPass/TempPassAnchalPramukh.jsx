import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {anchalPramukhTempPassService} from '../../api/tempPass/tempPassService';

const TempPassAnchalPramukh = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  const getTempPassAnchalPramukh = async () => {
    try {
      setLoading(true);
      const data = await anchalPramukhTempPassService();
      if (data && data.length > 0) {
        setUserData(data);
      } else {
        setUserData([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = isoDate => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const checkIfExpired = expiresAt => {
    if (!expiresAt) return false;
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    return expirationDate.getTime() < now.getTime() - 12 * 60 * 60 * 1000;
  };

  useEffect(() => {
    getTempPassAnchalPramukh();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (userData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No Anchal Pramukh found</Text>
      </View>
    );
  }

  const renderItem = ({item}) => {
    const expired = checkIfExpired(item.temporaryPasswordExpiresAt);

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{item.userName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item.svpEmail}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Temporary Password:</Text>
          <Text style={styles.value}>{item.temporaryPassword}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expires At:</Text>
          <Text style={styles.value}>
            {formatDate(item.temporaryPasswordExpiresAt)}
          </Text>
        </View>
        {expired && (
          <View style={styles.expiredContainer}>
            <Text style={styles.expiredText}>Expired Temporary Password</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{item.role}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={userData}
      renderItem={renderItem}
      keyExtractor={item => item.userName}
      contentContainerStyle={{padding: 16}}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    width: 140,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  expiredContainer: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffe6e6',
  },
  expiredText: {
    color: '#d9534f',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TempPassAnchalPramukh;
