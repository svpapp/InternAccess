import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useGetAnchalToPrashikshanRoleChangeHistoryById} from '../../hooks/switchRole/useAnchalToPrashikshanRole';
import useAuth from '../../hooks/auth/useAuth';

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RoleSwitchHistoryItem = ({item}) => (
  <View style={styles.historyCard}>
    <View style={styles.roleContainer}>
      <Text style={styles.roleText}>
        From: <Text style={styles.roleName}>{item.previousRole}</Text>
      </Text>
      <Text style={styles.roleText}>
        To: <Text style={styles.roleName}>{item.newRole}</Text>
      </Text>
    </View>

    <View style={styles.divider} />

    <View style={styles.detailsContainer}>
      <Text style={styles.detailText}>
        Switched by: {item.switchedBy.userName}
      </Text>
      <Text style={styles.detailText}>Email: {item.switchedBy.svpEmail}</Text>
      <Text style={styles.detailText}>Date: {formatDate(item.switchedAt)}</Text>
      <View style={styles.statusContainer}></View>
    </View>
  </View>
);

const AnchalToPrashikshanRoleSwitch = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {userInfo} = useAuth();
  const {getAnchalPramukhDataById} =
    useGetAnchalToPrashikshanRoleChangeHistoryById();

  const handleGetNewRole = async () => {
    if (!userInfo?._id) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }

    setLoading(true);
    try {
      const response = await getAnchalPramukhDataById(userInfo._id);
      if (response?.result && response?.message) {
        setHistoryData(response.message);
      }
    } catch (err) {
      console.error('Error fetching role history:', err);
      Alert.alert(
        'Error',
        err.message || 'An error occurred while fetching role history.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetNewRole();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGetNewRole} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh History</Text>
      </TouchableOpacity>

      {historyData ? (
        <View style={styles.contentContainer}>
          <View style={styles.currentRoleCard}>
            <Text style={styles.cardTitle}>Current Role Details</Text>
            <View style={styles.divider} />
            <View style={styles.currentRoleDetails}>
              <Text style={styles.detailText}>
                User Name: {historyData.userName}
              </Text>
              <Text style={styles.detailText}>
                Email: {historyData.svpEmail}
              </Text>
              <Text style={styles.detailText}>
                Current Role: {historyData.currentRole}
              </Text>
              <Text style={styles.detailText}>
                Original Role: {historyData.originalRole}
              </Text>
              <Text style={styles.detailText}>
                Previous Role: {historyData.previousRole}
              </Text>
              <Text style={styles.detailText}>
                New Role: {historyData.newRole}
              </Text>
              <Text style={styles.detailText}>
                Status:{' '}
                <Text
                  style={
                    historyData.isTemporaryRole
                      ? styles.temporaryStatus
                      : styles.permanentStatus
                  }>
                  {historyData.isTemporaryRole ? 'Temporary' : 'Permanent'}
                </Text>
              </Text>
              <Text style={styles.detailText}>
                Last Updated: {formatDate(historyData.switchedAt)}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Role Switch History</Text>
          <FlatList
            data={historyData.roleSwitchHistory}
            keyExtractor={item => item._id}
            renderItem={({item}) => <RoleSwitchHistoryItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No history data available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  refreshButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  currentRoleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  currentRoleDetails: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 15,
    color: '#666',
  },
  roleName: {
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  detailsContainer: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    marginTop: 4,
  },
  temporaryStatus: {
    color: '#ff6b00',
    fontWeight: '600',
  },
  permanentStatus: {
    color: '#00a653',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AnchalToPrashikshanRoleSwitch;
