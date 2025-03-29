import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../../../../constant/Constatnt.jsx';
import useAuth from '../../../../hooks/auth/useAuth.jsx';

const AddMembersScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const userId = userInfo._id;
  
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/users/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const pramukhList = extractPramukhs(data.data);
        setAvailableUsers(pramukhList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch available users');
    } finally {
      setLoading(false);
    }
  };

  const extractPramukhs = (hierarchyData) => {
    const pramukhList = [];

    // Handle Anchal hierarchy
    if (hierarchyData?.anchal) {
        const { anchal } = hierarchyData;
        
    

        // Add Sankul Pramukhs
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

    // Handle Sankul hierarchy
    else if (hierarchyData?.sankul) {
        const { sankul } = hierarchyData;

        // Add Anchal Pramukh
        if (sankul.anchal?.pramukh) {
            pramukhList.push({
                ...sankul.anchal.pramukh,
                designation: `Anchal Pramukh - ${sankul.anchal.name}`
            });
        }

     

        // Add Sanch Pramukhs
        sankul.sanchs?.forEach(sanch => {
            if (sanch.pramukh) {
                pramukhList.push({
                    ...sanch.pramukh,
                    designation: `Sanch Area - ${sanch.name}`
                });
            }
        });
    }

    // Handle Sanch hierarchy
    else if (hierarchyData?.sanch) {
        const { sanch } = hierarchyData;

        // Add Anchal Pramukh
        if (sanch.anchal?.pramukh) {
            pramukhList.push({
                ...sanch.anchal.pramukh,
                designation: `Anchal Pramukh - ${sanch.anchal.name}`
            });
        }

        // Add Sankul Pramukh
        if (sanch.sankul?.pramukh) {
            pramukhList.push({
                ...sanch.sankul.pramukh,
                designation: `Sankul Pramukh - ${sanch.sankul.name}`
            });
        }


        // Add Up-Sanch Pramukhs
        sanch.upSanchs?.forEach(upSanch => {
            if (upSanch.pramukh) {
                pramukhList.push({
                    ...upSanch.pramukh,
                    designation: `Up-Sanch Area - ${upSanch.name}`
                });
            }
        });
    }

    // Handle Up-Sanch hierarchy
    else if (hierarchyData?.upSanch) {
        const { upSanch } = hierarchyData;

        // Add Anchal Pramukh
        if (upSanch.anchal?.pramukh) {
            pramukhList.push({
                ...upSanch.anchal.pramukh,
                designation: `Anchal Pramukh - ${upSanch.anchal.name}`
            });
        }

        // Add Sankul Pramukh
        if (upSanch.sankul?.pramukh) {
            pramukhList.push({
                ...upSanch.sankul.pramukh,
                designation: `Sankul Pramukh - ${upSanch.sankul.name}`
            });
        }

        // Add Sanch Pramukh
        if (upSanch.sanch?.pramukh) {
            pramukhList.push({
                ...upSanch.sanch.pramukh,
                designation: `Sanch Pramukh - ${upSanch.sanch.name}`
            });
        }

        
    }

    return pramukhList;
};
  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/group/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          creatorId: userId,
          members: selectedMembers.map(member => member.id),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Group created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Chats', { shouldRefresh: true }),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (user) => {
    setSelectedMembers(prevSelected => {
      const isSelected = prevSelected.some(member => member.id === user.id);
      if (isSelected) {
        return prevSelected.filter(member => member.id !== user.id);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberItem = ({ item }) => {
    const isSelected = selectedMembers.some(member => member.id === item.id);
    
    return (
      <TouchableOpacity
        style={[styles.memberItem, isSelected && styles.selectedMemberItem]}
        onPress={() => toggleMemberSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.memberInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberDesignation}>{item.designation}</Text>
          </View>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
          {isSelected && <Icon name="check" size={20} color="#FFFFFF" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Group</Text>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleCreateGroup}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.groupNameInput}
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.selectedCount}>
          <Text style={styles.selectedText}>
            Selected: {selectedMembers.length} members
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  groupNameInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    color: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedCount: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  selectedText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedMemberItem: {
    backgroundColor: '#E8F5E9',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  memberDesignation: {
    fontSize: 14,
    color: '#666666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddMembersScreen;