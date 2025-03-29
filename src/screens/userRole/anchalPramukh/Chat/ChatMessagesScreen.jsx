import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  Alert,
  Platform,
  ToastAndroid,

} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import io from "socket.io-client"; // Import Socket.io-client
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Clipboard from '@react-native-clipboard/clipboard';
import { API_BASE_URL } from "../../../../constant/Constatnt";
import useAuth from "../../../../hooks/auth/useAuth";


const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const route = useRoute();
  const { recepientId, groupId, isGroup, groupName, groupImage } = route.params;
  const { userInfo } = useAuth();
  const userId = userInfo._id;
  

  const scrollViewRef = useRef(null);
  const socketRef = useRef(null); // Use ref to keep socket persistent




  const handleEmojiSelected = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji); // Append selected emoji to the message
    setShowEmojiSelector(false); // Optionally hide emoji selector after selecting an emoji
  };

  useEffect(() => {
    // Establish socket connection only once on mount
    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL); 

      // When connected, join room
      socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
        // Join personal or group room
        socketRef.current.emit("joinRoom", userId, isGroup && groupId ? [groupId] : []);
      });

      // Listen for new direct or group messages
      socketRef.current.on("newMessage", (newMessage) => {
        console.log("Received new message:", newMessage);
        setMessages((prevMessages) =>
          prevMessages.some(msg => msg._id === newMessage._id) ? prevMessages : [...prevMessages, newMessage]
        );
      });

      socketRef.current.on("newGroupMessage", (newMessage) => {
        console.log("Received new group message:", newMessage);
        setMessages((prevMessages) =>
          prevMessages.some(msg => msg._id === newMessage._id) ? prevMessages : [...prevMessages, newMessage]
        );
      });

      // Update message to "read" status
      socketRef.current.on("messageRead", ({ messageId, seenBy }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, status: "read", seenBy } : msg
          )
        );
      });

      // Update message to "delivered" status
      socketRef.current.on("messageDelivered", ({ messageId, status }) => {
        console.log("Message delivered:", messageId, status);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, status } : msg
          )
        );
      });

      // Handle socket disconnection
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    // Clean up the socket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [API_BASE_URL, groupId, isGroup, userId]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const url = isGroup
        ? `${API_BASE_URL}/api/v1/Chat/group/messages/${groupId}`
        : `${API_BASE_URL}/api/v1/Chat/messages/${userId}/${recepientId}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);


      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.statusText);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);


  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/Chat/user/${recepientId}`
        );
        const data = await response.json();
        setRecepientData(data);
        console.log('receptiondata',data);
        
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    if (!isGroup) {
      fetchRecepientData();
    }
  }, []);

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const messageDate = new Date(message.timeStamp).toDateString(); // Convert timestamp to date string
      if (!groups[messageDate]) {
        groups[messageDate] = [];
      }
      groups[messageDate].push(message);
      return groups;
    }, {});
  };


  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/group/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId,
          memberId: userId,
        }),
      });

      if (response.ok) {
        navigation.goBack(); // Go back to the previous screen
        Alert.alert("You have left the group successfully!"); // Show alert
      } else {
        console.log("Error leaving group", response.status);
      }
    } catch (error) {
      console.log("Error in leaving group", error);
    }
  };

  const handleSend = async (messageType, fileUri, fileName, fileType) => {
    try {
 
      const formData = new FormData();
      formData.append("senderId", userId);
      
      if (isGroup) {
        formData.append("groupId", groupId);
      } else {
        formData.append("recepientId", recepientId);
      }

      if (messageType === "file") {
        formData.append("messageType", "file");
        formData.append("file", {
          uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
          name: fileName || 'file',  // Fallback filename if none provided
          type: fileType || 'application/octet-stream', // Fallback type if none provided
        });
      } else {
        console.log("Text Message:", message);
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      // Log the full formData
      console.log("FormData contents:", Object.fromEntries(formData._parts));

      // Add headers to the request
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/messages`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      // Log the response status
      console.log("Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData);

        setMessage("");

        const newMessage = responseData;
        newMessage.status = "sent";
        
        // Check if socket is connected
        if (socketRef.current?.connected) {
          socketRef.current.emit("sendMessage", newMessage);
        } else {
          console.log("Socket not connected");
        }

        await fetchMessages();
      } else {
        // Log error response
        const errorData = await response.text();
        console.error("Server error:", errorData);
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error in sending message:", error);
      Alert.alert("Error", "Failed to send message. Please check your connection.");
    }
  };


  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (isGroup && groupId) { // Check if groupId is defined
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/Chat/group/members/${groupId}`
          );

          // Check if the response is okay (status 200)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          // Filter out the admin from members
          const filteredMembers = data.members.filter(
            (member) => member._id !== data.admin._id
          );

          // Combine admin and filtered members into one array
          const formattedData = [
            { ...data.admin, isAdmin: true }, // Mark admin in data
            ...filteredMembers.map((member) => ({ ...member, isAdmin: false })),
          ];

          setGroupMembers(formattedData); // Store the formatted data in state
        } catch (error) {
          console.log("Error fetching group members:", error);
        }
      }
    };

    fetchGroupMembers();
  }, [isGroup, groupId]);



  const handleOpenGroupDetails = () => {
    if (isGroup) {
      navigation.navigate('Groupdetails', { groupId, groupName });
    }
  };

  const handleInfoPress = async () => {
    if (selectedMessages.length > 0) {
      const messageId = selectedMessages[0];
      const message = messages.find((msg) => msg._id === messageId);
      if (message) {
        const seenBy = await getSeenBy(messageId);
        navigation.navigate('MessageInfo', { seenBy, message });
      }
    }
  };

  const getSeenBy = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/message/seen/${messageId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching seen by data:", error);
      return [];
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          {isGroup ? (
            <Pressable onPress={handleOpenGroupDetails}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.avatarPlaceholder}>
                  {groupImage ? (
                    <Image
                      source={{ uri: `${API_BASE_URL}${groupImage}` }} // Ensure you provide the correct URI for the group image
                      style={styles.groupImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {groupName ? groupName.charAt(0).toUpperCase() : "?"}
                    </Text>
                  )}
                </View>
                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: 'black' }}>
                  {groupName}
                </Text>
              </View>
            </Pressable>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {recepientData?.userName ? recepientData.userName.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: 'black' }}>
                {recepientData?.userName}
              </Text>
            </View>
          )}
        </View>
      ),

      headerRight: () => (
        isGroup ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

            <Menu>
              <MenuTrigger>
                <Ionicons
                  name="ellipsis-vertical"
                  size={24}
                  color="black"
                />
              </MenuTrigger>
              <MenuOptions >
                <MenuOption
                  onSelect={handleLeaveGroup}
                  customStyles={{
                    optionText: {
                      color: 'black', // Set text color to black
                      fontSize: 16,   // Optional: You can adjust the font size if needed
                    },
                  }}
                  text="Leave Group"
                />
                <MenuOption onSelect={() => console.log('Cancel selected')}>
                  <Text style={{ color: 'red' }}>Cancel</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ) : null
      ),

      headerTitleStyle: {
        fontSize: 15, // Adjust the font size to your preference
        fontWeight: 'bold', // Adjust font weight if needed
        color: 'black', // Ensure the color matches your design
      },
    });

    // Add selectedMessages functionality
    if (selectedMessages.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons
              name="arrow-redo-sharp"
              size={24}
              color="black"
              onPress={handleForward}  // Trigger the forward functionality
            />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
            <MaterialIcons
              onPress={handleCopyMessages} // Trigger the copy functionality
              name="content-copy"
              size={24}
              color="black"
            />
            {/* Only show information-circle icon if it's a group chat */}
            {isGroup && selectedMessages.length > 0 ? (
              <Ionicons
                name="information-circle"
                size={20}
                color="black"
                onPress={handleInfoPress}
              />
            ) : null}
          </View>
        ),
      });
    }

  }, [navigation, recepientData, selectedMessages, groupName, isGroup]);

  
  const handleForward = () => {
    // Navigate to ForwardScreen and pass the selected messages
    navigation.navigate('ForwardScreen', { selectedMessages, recepientId, isGroup });
  };

  const handleCopyMessages = () => {
    const messagesToCopy = selectedMessages.map((id) => {
      const message = messages.find((msg) => msg._id === id);
      return message ? message.message : ''; // Extract message text
    }).join('\n'); // Join messages with new lines

    Clipboard.setString(messagesToCopy);
    ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  };

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/deleteMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );

        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };

  // Handle marking message as seen
  const markMessageAsSeen = (messageId) => {
    socketRef.current.emit("markAsSeen", {
      messageId,
      userId,
      groupId: isGroup ? groupId : null,
    });
  };

  useEffect(() => {
    messages.forEach((message) => {
      if (
        message.senderId?._id !== userId &&
        !message.seenBy.includes(userId) // Ensure the user has not already seen it
      ) {
        markMessageAsSeen(message._id);
      }
    });
  }, [messages]);


  const getSeenByNames = (message) => {
    // Safely check if message.seenBy is an array and contains valid objects
    if (isGroup) {
      if (Array.isArray(message.seenBy) && message.seenBy.length > 0) {
        return message.seenBy.map(({ userId, seenAt }) => {
          const user = groupMembers.find(member => member._id === userId);
          const formattedTime = seenAt ? new Date(message.seenBy[0].seenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ''; // Safely format time
          return user ? `${user.userName} at ${formattedTime}` : "";
        });
      }
    } else if (Array.isArray(message.seenBy) && message.seenBy.length > 0) {
      const seenAt = message.seenBy[0]?.seenAt ? new Date(message.seenBy[0].seenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      return [`Seen at ${seenAt}`];
    }

    return []; // Return empty array if no one has seen the message
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };



  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {Object.entries(groupMessagesByDate(messages)).map(([date, messagesOnDate], dateIndex) => (
          <View key={dateIndex}>
            {/* Render date header */}
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>{date}</Text>
            </View>

            {/* Render messages for this date */}
            {messagesOnDate.map((item, index) => {
              console.log('chbdhbhcbdshcbj',item);
              
              if (item.messageType === "text") {
                const isSenderUser = item?.senderId?._id === userId;
                const seenStatus = getSeenByNames(item._id);
                const isSelected = selectedMessages.includes(item._id);

                return (
                  <Pressable
                    onLongPress={() => handleSelectMessage(item)}
                    key={index}
                    style={[
                      isSenderUser
                        ? {
                          alignSelf: "flex-end",
                          backgroundColor: isSelected ? "#F0FFFF" : "#DCF8C6", // Change background when selected
                          padding: 8,
                          maxWidth: "60%",
                          borderRadius: 7,
                          margin: 10,
                        }
                        : {
                          alignSelf: "flex-start",
                          backgroundColor: isSelected ? "#F0FFFF" : "white", // Change background when selected
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: "60%",
                        },
                    ]}
                  >
                    {item.isForwarded && (
                      <Text style={{ fontSize: 12, color: 'gray', fontStyle: 'italic' }}>
                        Forwarded
                      </Text>
                    )}
                    {isGroup && !isSenderUser && (
                      <Text style={{ fontWeight: "bold", marginBottom: 5, color: 'black' }}>
                        {item.senderId && item.senderId.userName ? item.senderId.userName : "Unknown"}
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: 13,
                        textAlign: isSelected ? "right" : "left",
                        color: 'black',
                      }}
                    >
                      {item.message || 'No content'}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: 9,
                          color: "gray",
                          marginTop: 5,
                        }}
                      >
                        {formatTime(item.timeStamp)}
                      </Text>
                      {item.senderId?._id === userId && (
                        <Text
                          style={{
                            fontSize: 10,
                            color: "gray",
                            textAlign: "right",
                            marginTop: 3,
                          }}
                        >

                          {item.status === "delivered" ? "✔✔" : item.status === "sent" ? "✔" : ""}
                        </Text>
                      )}

                    </View>
                  </Pressable>
                );
              }


            })}


            {messagesOnDate.length > 0 && (
              <View style={{ padding: 10, marginTop: 5 }}>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  {getSeenByNames(messagesOnDate[messagesOnDate.length - 1]).join(" ")}
                </Text>
              </View>
            )}

          </View>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
            color: 'black'
          }}
          placeholder="Type Your message..."
          placeholderTextColor={'black'}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >


          {/* <Feather name="mic" size={24} color="gray" /> */}
        </View>

        <Pressable
          onPress={() => handleSend("text")}
          disabled={!message.trim()}
          style={{
            backgroundColor: message.trim() ? "#007bff" : "#cccccc",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            opacity: message.trim() ? 1 : 0.5,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

     
      {/* Show Emoji Selector */}
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={handleEmojiSelected}
          showSearchBar={false} // Optional: Hide the search bar
          columns={8} // Number of columns to display emojis
        style={{fontSize:16}}
        />
      )}


    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#567189', // Background color for the avatar
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '70%',
    height: '60%'

  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: 200,
  },
  dateHeader: {
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#567189',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

});

