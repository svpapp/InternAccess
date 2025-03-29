import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constant/Constatnt';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../../../hooks/auth/useAuth';

const ForwardScreen = ({ route, navigation }) => {
  const { selectedMessages, recepientId, isGroup } = route.params;
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const { userInfo } = useAuth();
  const userId = userInfo._id;

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/Chat/users/${userId}`);
      console.log("Users response:", response.data); // Add this for debugging
      if (response.data.success) {
        const formattedUsers = formatUsersFromHierarchy(response.data.data);
        console.log("Formatted users:", formattedUsers); // Add this for debugging
        setUsers(formattedUsers);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/Chat/user/${userId}/groups`);
      console.log("Groups response:", response.data); // Add this for debugging
      if (response.data) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const formatUsersFromHierarchy = (hierarchyData) => {
    const pramukhList = [];

    if (hierarchyData?.anchal) {
      const { anchal } = hierarchyData;
      anchal.sankuls?.forEach(sankul => {
        if (sankul.pramukh) {
          pramukhList.push({
            ...sankul.pramukh,
            designation: `Sankul Area - ${sankul.name}`
          });
        }
        sankul.sanchs?.forEach(sanch => {
          if (sanch.pramukh) {
            pramukhList.push({
              ...sanch.pramukh,
              designation: `Sanch Area - ${sanch.name}`
            });
          }
        });
      });
    }
    return pramukhList;
  };


  const handleForward = async () => {
    if (selectedRecipients.length === 0) {
      Alert.alert('Error', 'Please select at least one recipient');
      return;
    }

    setLoading(true);
    try {
      const forwardPromises = selectedMessages.map(messageId =>
        selectedRecipients.map(recipient =>
          axios.post(`${API_BASE_URL}/api/v1/Chat/forwardMessage`, {
            messageId,
            newRecipientId: recipient.id,
            isGroup: recipient.type === 'group',
            senderId: userId // Add sender ID
          })
        )
      ).flat();

      await Promise.all(forwardPromises);
      Alert.alert('Success', 'Messages forwarded successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error forwarding messages:', error);
      Alert.alert('Error', 'Failed to forward messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipientSelection = (item, type) => {
    setSelectedRecipients(prev => {
      const isSelected = prev.some(r => r.id === item.id && r.type === type);
      if (isSelected) {
        return prev.filter(r => !(r.id === item.id && r.type === type));
      } else {
        return [...prev, { ...item, type }];
      }
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedRecipients.some(r => r.id === item.id && r.type === item.type);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => toggleRecipientSelection(item, item.type)}
      >
        <Text style={styles.itemName}>
          {item.type === 'group' ? '👥 ' : '👤 '}
          {item.name}
        </Text>
        {item.type === 'user' && item.departmentName && (
          <Text style={styles.departmentName}>{item.departmentName}</Text>
        )}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  const filteredData = {
    users: users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.departmentName?.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    groups: groups.filter(group => 
      group.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const combinedData = [
    ...filteredData.users.map(user => ({ ...user, type: 'user' })),
    ...filteredData.groups.map(group => ({ 
      id: group._id, // Changed from group.id to group._id
      name: group.name,
      type: 'group' 
    }))
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users or groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#007AFF" />
      ) : (
        <>
          <Text style={styles.resultCount}>
            {combinedData.length} {combinedData.length === 1 ? 'result' : 'results'}
          </Text>
          <FlatList
            data={combinedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No users or groups found</Text>
            )}
          />
        </>
      )}

      <TouchableOpacity
        style={[
          styles.forwardButton,
          selectedRecipients.length === 0 && styles.disabledButton
        ]}
        onPress={handleForward}
        disabled={selectedRecipients.length === 0 || loading}
      >
        <Text style={styles.forwardButtonText}>
          Forward to {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  resultCount: {
    padding: 16,
    color: '#666',
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: '#F0F8FF',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  departmentName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  checkIcon: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  forwardButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  forwardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForwardScreen;