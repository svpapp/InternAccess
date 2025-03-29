import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Pressable
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../../../../constant/Constatnt';
import useAuth from '../../../../hooks/auth/useAuth';

const GroupDetails = ({ route, navigation }) => {
  const { groupId, groupName } = route.params;
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupProfileImage, setGroupProfileImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useAuth();
  const userId = userInfo._id;

  // Set up navigation header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Pressable 
          onPress={() => Alert.alert('Group Name', groupName)}
          style={styles.headerTitle}
        >
          <Text style={styles.headerTitleText} numberOfLines={1}>
            {groupName}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, groupName]);

  const fetchGroupMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/group/members/${groupId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log('image',data);
      
      const formattedData = [
        { ...data.admin, isAdmin: true },
        ...data.members
          .filter((member) => member._id !== data.admin._id)
          .map((member) => ({ ...member, isAdmin: false })),
      ];

      setGroupMembers(formattedData);
      if (data.groupProfileImage) {
        setGroupProfileImage(`${API_BASE_URL}${data.groupProfileImage}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch group members');
      console.error('Error fetching group members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/availableUsers/${userId}?groupId=${groupId}`);
      const result = await response.json();
      console.log('Available users response:', result);
      
      // Set only the data array from the response
      if (result.success && result.data) {
        setAvailableUsers(result.data);
      } else {
        Alert.alert('Error', 'No users available');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch available users');
      console.error('Error fetching available users:', error);
    }
  };

  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);

  useEffect(() => {
    if (isModalVisible) {
      fetchAvailableUsers();
    }
  }, [isModalVisible]);

  const handleRemoveMember = (memberId, memberName) => {
    Alert.alert(
      `Remove ${memberName}?`,
      `Are you sure you want to remove ${memberName} from the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/v1/Chat/group/remove-member`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupId, adminId: userId, memberId }),
              });

              const result = await response.json();
              if (response.ok) {
                setGroupMembers(groupMembers.filter((member) => member._id !== memberId));
                Alert.alert('Success', result.message);
              } else {
                Alert.alert('Error', result.message || 'Failed to remove member');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove member');
              console.error('Error removing member:', error);
            }
          },
        },
      ]
    );
  };

  const selectGroupImage = async () => {
    try {
      const result = await launchImageLibrary({ 
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800
      });

      if (result.didCancel || !result.assets?.[0]) return;

      const selectedImage = result.assets[0];
      const imageUri = selectedImage.uri;
      setGroupProfileImage(imageUri);

      const formData = new FormData();
      formData.append('groupId', groupId);
      formData.append('file', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: selectedImage.fileName || `group_${groupId}_${Date.now()}.jpg`,
        type: selectedImage.type || 'image/jpeg',
      });

      const uploadResponse = await fetch(`${API_BASE_URL}/api/v1/Chat/group/upload-image`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (uploadResponse.ok) {
        const responseData = await uploadResponse.json();
        setGroupProfileImage(`${API_BASE_URL}${responseData.imageUrl}`);
        Alert.alert('Success', 'Group image updated successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update group image');
      console.error('Error updating group image:', error);
    }
  };

  const confirmAddMembers = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user to add');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/group/add-members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          userId,
          members: selectedUsers,
        }),
      });

      if (response.ok) {
        await fetchGroupMembers();
        setIsModalVisible(false);
        setSelectedUsers([]);
        Alert.alert('Success', 'Members added successfully');
      } else {
        throw new Error('Failed to add members');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add members');
      console.error('Error adding members:', error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Image
          source={
            item.profileImage
              ? { uri: `${API_BASE_URL}${item.profileImage}` }
              : require('../../../../assets/group.png')
          }
          style={styles.memberImage}
        />
        <Text style={styles.memberName}>{item.userName}</Text>
      </View>
      {item.isAdmin ? (
        <View style={styles.adminBadgeContainer}>
          <Text style={styles.adminBadge}>Admin</Text>
        </View>
      ) : (
        groupMembers.some((member) => member.isAdmin && member._id === userId) && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveMember(item._id, item.name)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <TouchableOpacity style={styles.imageContainer} onPress={selectGroupImage}>
        <Image
          source={
            groupProfileImage
              ? { uri: groupProfileImage }
              : require('../../../../assets/group.png')
          }
          style={styles.groupProfileImage}
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.changeImageText}>Change Image</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.membersSection}>
        <Text style={styles.sectionTitle}>Group Members ({groupMembers.length})</Text>
        <FlatList
          data={groupMembers}
          keyExtractor={(item) => item._id}
          renderItem={renderMemberItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.membersList}
        />
      </View>

      {groupMembers.some((member) => member.isAdmin && member._id === userId) && (
        <TouchableOpacity
          style={styles.addMemberButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addMemberButtonText}>Add Member</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Members</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableUsers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.userSelectionItem,
                  selectedUsers.includes(item._id) && styles.selectedUserItem,
                ]}
                onPress={() => toggleUserSelection(item._id)}
              >
                <Text style={styles.userSelectionName}>{item.userName}</Text>
                {selectedUsers.includes(item._id) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmAddMembers}
            >
              <Text style={styles.modalButtonText}>Add Selected</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    maxWidth: 200,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  groupProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 120,
    padding: 6,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  membersSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  membersList: {
    paddingBottom: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  adminBadgeContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adminBadge: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  removeButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
  },
  addMemberButton: {
    margin: 16,
    backgroundColor: '#1976d2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addMemberButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '500',
  },
  userSelectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedUserItem: {
    backgroundColor: '#e3f2fd',
  },
  userSelectionName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#1976d2',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  }
 
});

export default GroupDetails;
