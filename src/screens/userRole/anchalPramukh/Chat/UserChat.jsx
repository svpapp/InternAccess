import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../../../constant/Constatnt.jsx";
import useAuth from "../../../../hooks/auth/useAuth.jsx";

const UserChat = ({ item, group, isGroup = false }) => {
  const { userInfo } = useAuth();
  const userId = userInfo._id;
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    if (isGroup) {
      if (group?._id) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/Chat/group/messages/${group._id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching group messages:", error);
        }
      }
    } else {
      if (item?.id && userId) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/Chat/messages/${userId}/${item.id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching individual messages:", error);
        }
      }
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/messagesunseen/unseen/${userId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Unread count data:", data);
      
      if (isGroup && group?._id) {
        // Find group message count
        const groupCount = data.groupMessages.find(
          msg => msg?.groupId === group._id
        )?.unseenCount || 0;
        setUnreadCount(groupCount);
      } else if (!isGroup && item?.id) {
        // Find direct message count
        const directCount = data.directMessages.find(
          msg => msg?.userId === item.id
        )?.unseenCount || 0;
        setUnreadCount(directCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
    
    // Set up polling for unread count
    const interval = setInterval(fetchUnreadCount, 10000);
    
    return () => clearInterval(interval);
  }, [isGroup, item?.id, group?._id, userId]);

  const handleChatPress = async () => {
    navigation.navigate("Messages", {
      recepientId: item?.id,
      groupId: group?._id,
      groupName: group?.name,
      isGroup: isGroup,
      groupImage: isGroup && group?.image ? group.image : null 
    });
    
    // Reset unread count when entering the chat
    setUnreadCount(0);
  };

  const getLastMessage = useCallback(() => {
    if (!messages || messages.length === 0) return null;

    const sortedMessages = [...messages].sort((a, b) => 
      new Date(b.timeStamp) - new Date(a.timeStamp)
    );

    const textMessage = sortedMessages.find(
      (message) => message.messageType === "text"
    );

    return textMessage || sortedMessages[0] || null;
  }, [messages]);

  const lastMessage = useMemo(() => getLastMessage(), [getLastMessage]);

  const formatTime = (time) => {
    if (!time) return '';
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  if (!item && !group) return null;

  return (
    <View>
      <Pressable
        onPress={handleChatPress}
        style={styles.pressableContainer}
      >
        <View style={styles.avatarPlaceholder}>
          {isGroup && group?.image ? (
            <Image
              source={{ uri: `${API_BASE_URL}${group.image}` }}
              style={styles.groupImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              {item?.name ? item.name.charAt(0).toUpperCase() : "?"}
            </Text>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>
            {item?.name || group?.name}
          </Text>
          <Text style={styles.messageText}>
            {lastMessage ? lastMessage.message : 'No messages available'}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <Text style={styles.timeText}>
            {lastMessage && formatTime(lastMessage?.timeStamp)}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountContainer}>
              <Text style={styles.unreadCountText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  
  groupImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  
  messageText: {
    fontSize: 14,
    color: "gray",
    fontWeight: "400",
  },
  
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  
  timeText: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  
  unreadCountContainer: {
    minWidth: 20,
    height: 20,
    backgroundColor: '#34C759',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  
  unreadCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  }
});

export default UserChat;