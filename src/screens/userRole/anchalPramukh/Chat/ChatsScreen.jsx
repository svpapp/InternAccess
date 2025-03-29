import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../../../constant/Constatnt.jsx";
import UserChat from "./UserChat.jsx";
import useAuth from "../../../../hooks/auth/useAuth.jsx";

const ChatsScreen = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useAuth();
  const navigation = useNavigation();
  const userId = userInfo._id;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Chat Room</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/Chat/users/${userId}`
      );

      if (response.data.success) {
        setHierarchyData(response.data.data);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.log("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Chat/user/${userId}/groups`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.log("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers();
      fetchGroups();
    }, [])
  );

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.replace("Login");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  const handleAddGroup = () => {
    navigation.navigate("AddMembers", { userId });
  };

  const renderPramukhList = () => {
    const pramukhList = [];

    if (hierarchyData?.anchal) {
        // Anchal Pramukh
        const { anchal } = hierarchyData;
        if (anchal.pramukh) {
            pramukhList.push({
                ...anchal.pramukh,
                designation: `Anchal Pramukh - ${anchal.name}`
            });
        }

        // Sankul Pramukhs
        anchal.sankuls?.forEach(sankul => {
            if (sankul.pramukh) {
                pramukhList.push({
                    ...sankul.pramukh,
                    designation: `Sankul Pramukh - ${sankul.name}`
                });
            }
            // Sanch Pramukhs
            sankul.sanchs?.forEach(sanch => {
                if (sanch.pramukh) {
                    pramukhList.push({
                        ...sanch.pramukh,
                        designation: `Sanch Pramukh - ${sanch.name}`
                    });
                }
                // Up-Sanch Pramukhs
                sanch.upSanchs?.forEach(upSanch => {
                    if (upSanch.pramukh) {
                        pramukhList.push({
                            ...upSanch.pramukh,
                            designation: `Up-Sanch Pramukh - ${upSanch.name}`
                        });
                    }
                });
            });
        });
    } 
    else if (hierarchyData?.sankul) {
        const { sankul } = hierarchyData;
        // Anchal Pramukh
        if (sankul.anchal?.pramukh) {
            pramukhList.push({
                ...sankul.anchal.pramukh,
                designation: `Anchal Pramukh - ${sankul.anchal.name}`
            });
        }

        // Sankul Pramukh
        if (sankul.pramukh) {
            pramukhList.push({
                ...sankul.pramukh,
                designation: `Sankul Pramukh - ${sankul.name || ''}`
            });
        }

        // Sanch Pramukhs
        sankul.sanchs?.forEach(sanch => {
            if (sanch.pramukh) {
                pramukhList.push({
                    ...sanch.pramukh,
                    designation: `Sanch Pramukh - ${sanch.name}`
                });
            }
        });
    } 
    else if (hierarchyData?.sanch) {
        const { sanch } = hierarchyData;
        // Anchal Pramukh
        if (sanch.anchal?.pramukh) {
            pramukhList.push({
                ...sanch.anchal.pramukh,
                designation: `Anchal Pramukh - ${sanch.anchal.name}`
            });
        }

        // Sankul Pramukh
        if (sanch.sankul?.pramukh) {
            pramukhList.push({
                ...sanch.sankul.pramukh,
                designation: `Sankul Pramukh - ${sanch.sankul.name}`
            });
        }

        // Sanch Pramukh - Add this
        if (sanch.pramukh) {
            pramukhList.push({
                ...sanch.pramukh,
                designation: `Sanch Pramukh - ${sanch.name || ''}`
            });
        }

        // Up-Sanch Pramukhs
        sanch.upSanchs?.forEach(upSanch => {
            if (upSanch.pramukh) {
                pramukhList.push({
                    ...upSanch.pramukh,
                    designation: `Up-Sanch Pramukh - ${upSanch.name}`
                });
            }
        });
    }
    else if (hierarchyData?.upSanch) {
        const { upSanch } = hierarchyData;
        
        // Anchal Pramukh
        if (upSanch.anchal?.pramukh) {
            pramukhList.push({
                ...upSanch.anchal.pramukh,
                designation: `Anchal Pramukh - ${upSanch.anchal.name}`
            });
        }

        // Sankul Pramukh
        if (upSanch.sankul?.pramukh) {
            pramukhList.push({
                ...upSanch.sankul.pramukh,
                designation: `Sankul Pramukh - ${upSanch.sankul.name}`
            });
        }

        // Sanch Pramukh
        if (upSanch.sanch?.pramukh) {
            pramukhList.push({
                ...upSanch.sanch.pramukh,
                designation: `Sanch Pramukh - ${upSanch.sanch.name}`
            });
        }
        
    
        // Aacharyas - Add this
        if (upSanch.aacharyas && upSanch.aacharyas.length > 0) {
            upSanch.aacharyas.forEach(aacharya => {
                pramukhList.push({
                    ...aacharya,
                    designation: `Aacharya - ${upSanch.name}`
                });
            });
        }
    }
    else if (hierarchyData?.aacharya) {
        const { aacharya } = hierarchyData;
        
        // Anchal Pramukh
        if (aacharya.anchal?.pramukh) {
            pramukhList.push({
                ...aacharya.anchal.pramukh,
                designation: `Anchal Pramukh - ${aacharya.anchal.name}`
            });
        }

        // Sankul Pramukh
        if (aacharya.sankul?.pramukh) {
            pramukhList.push({
                ...aacharya.sankul.pramukh,
                designation: `Sankul Pramukh - ${aacharya.sankul.name}`
            });
        }

        // Sanch Pramukh
        if (aacharya.sanch?.pramukh) {
            pramukhList.push({
                ...aacharya.sanch.pramukh,
                designation: `Sanch Pramukh - ${aacharya.sanch.name}`
            });
        }
        
        // Up-Sanch Pramukh
        if (aacharya.upSanch?.pramukh) {
            pramukhList.push({
                ...aacharya.upSanch.pramukh,
                designation: `Up-Sanch Pramukh - ${aacharya.upSanch.name}`
            });
        }
        
        // Current Aacharya
        pramukhList.push({
            id: aacharya.id,
            name: aacharya.name,
            email: aacharya.email,
            role: aacharya.role,
            designation: `Aacharya - ${aacharya.upSanch?.name || ''}`
        });
    }

    return pramukhList;
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Pramukhs Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pramukhs</Text>
              <Text style={styles.sectionCount}>
                {renderPramukhList().length} members
              </Text>
            </View>

            {renderPramukhList().map((pramukh, index) => (
              console.log('pramukh',pramukh),
              
              <View key={index} style={styles.userChatContainer}>
                <UserChat
                  item={{
                    id: pramukh.id,
                    name: `${pramukh.name}`,
                    role: pramukh.designation
                  }}
                />
              </View>
            ))}
          </View>

          {/* Groups Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Groups</Text>
              <Text style={styles.sectionCount}>
                {groups.length} groups
              </Text>
            </View>
            {groups.map((group, index) => (
              <View key={index} style={styles.userChatContainer}>
                <UserChat group={group} isGroup={true} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddGroup}
        activeOpacity={0.8}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F8F9FA",
  },
  headerLeft: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  logoutButton: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  sectionCount: {
    fontSize: 14,
    color: "#666666",
  },
  userChatContainer: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#4CAF50",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ChatsScreen;