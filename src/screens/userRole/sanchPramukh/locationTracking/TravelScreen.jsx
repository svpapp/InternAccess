import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    SafeAreaView,
    Platform,
    PermissionsAndroid,
    Linking,
    Dimensions
} from 'react-native';
import { Button, Text, SegmentedButtons, Card, IconButton } from 'react-native-paper';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { startTravel, updateLocation, endTravel, checkActiveTravel } from '../../../../redux/slices/travelSlice';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../../../hooks/auth/useAuth';
import io from 'socket.io-client';
import { API_BASE_URL } from '../../../../constant/Constatnt';

const TravelScreen = () => {
    const [tracking, setTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [travelPath, setTravelPath] = useState([]);
    const [meetingType, setMeetingType] = useState('MAV');
    const [transportMode, setTransportMode] = useState('car');
    const [locationError, setLocationError] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [totalDistance, setTotalDistance] = useState(0);
    const [activeTravelId, setActiveTravelId] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 19.2505167212497,
        longitude: 73.11146423370587,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [otherTravelers, setOtherTravelers] = useState({}); // Store other travelers' locations
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const watchIdRef = useRef(null);
    const mapRef = useRef(null);
    const retryAttemptsRef = useRef(0);
    const offlineLocationQueueRef = useRef([]);
    const socketRef = useRef(null); // Reference to the socket connection
    const MAX_RETRY_ATTEMPTS = 3;
    
    // Get active travel from Redux store if available
    const activeTravelState = useSelector(state => state.travel.activeTravel);
    // Get current user from Redux store
    const { userInfo } = useAuth();
    const currentUser = userInfo._id;
    console.log('current user', currentUser);

    // Configure Geolocation settings with more lenient timeout
    useEffect(() => {
        Geolocation.setRNConfiguration({
            enableHighAccuracy: true,
            timeout: 30000, // Increased timeout
            maximumAge: 10000, // Increased maximum age
            distanceFilter: 5,
        });
        
        // Initialize socket connection
        initializeSocket();
        
        // Check for active travel first, then initialize location
        checkForActiveTravel();
        
        return () => {
            stopLocationTracking();
            disconnectSocket();
        };
    }, [currentUser]); // Add currentUser as dependency to reload when user changes

    // Initialize socket connection
    const initializeSocket = () => {
        // Use your environment variable for the backend URL
        const SOCKET_URL = API_BASE_URL;
        
        if (socketRef.current && socketRef.current.connected) {
            console.log("Socket already connected");
            return;
        }
        
        console.log("Initializing socket connection to:", SOCKET_URL);
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        
        socketRef.current.on('connect', () => {
            console.log('Socket connected:', socketRef.current.id);
            
            // Join user's personal room
            socketRef.current.emit('joinRoom', currentUser);
        });
        
        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
        
        socketRef.current.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
        
        // Listen for location updates from other travelers
        socketRef.current.on('locationUpdated', (data) => {
            console.log('Received location update:', data);
            if (data.userId !== currentUser) {
                setOtherTravelers(prev => ({
                    ...prev,
                    [data.userId]: {
                        location: {
                            latitude: data.latitude,
                            longitude: data.longitude,
                        },
                        userName: data.userName || 'Traveler',
                        timestamp: data.timestamp,
                    }
                }));
            }
        });
        
        // Listen for travel ended events
        socketRef.current.on('travelEnded', (data) => {
            console.log('Travel ended:', data);
            if (data.userId !== currentUser) {
                // Remove this traveler from the map
                setOtherTravelers(prev => {
                    const updated = { ...prev };
                    delete updated[data.userId];
                    return updated;
                });
            }
        });
        
        // Listen for new travels started
        socketRef.current.on('travelStarted', (data) => {
            console.log('New travel started:', data);
            if (data.userId !== currentUser) {
                Alert.alert(
                    'New Traveler',
                    `${data.userName || 'Someone'} has started a journey nearby.`,
                    [{ text: 'OK' }]
                );
            }
        });
    };
    
    // Disconnect socket connection
    const disconnectSocket = () => {
        if (socketRef.current) {
            console.log('Disconnecting socket');
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };
    
    // Join a travel tracking room when starting tracking
    const joinTravelRoom = (travelId) => {
        if (socketRef.current && socketRef.current.connected && travelId) {
            console.log(`Joining travel room: travel_${travelId}`);
            socketRef.current.emit('joinTravel', travelId);
        } else {
            console.warn('Cannot join travel room: Socket not connected or travel ID missing');
        }
    };

    // Check if there's an active travel session
    const checkForActiveTravel = async () => {
        try {
            // Clear any existing tracking when checking for active travel
            // This ensures we don't show previous user's data
            if (tracking) {
                stopLocationTracking();
                setTracking(false);
                setTravelPath([]);
                setTotalDistance(0);
                setActiveTravelId(null);
            }
            
            // Get the active travel key for the current user
            const activeTravelKey = `activeTravel_${currentUser}`;
            
            // First try to get from AsyncStorage with user-specific key
            const storedTravelData = await AsyncStorage.getItem(activeTravelKey);
            let activeTravel = null;
            
            if (storedTravelData) {
                try {
                    activeTravel = JSON.parse(storedTravelData);
                    // Verify the travel belongs to current user
                    if (activeTravel.userId && activeTravel.userId !== currentUser) {
                        console.log("Found travel data belongs to different user, ignoring");
                        activeTravel = null;
                        // Remove incorrect travel data
                        await AsyncStorage.removeItem(activeTravelKey);
                    } else {
                        console.log("Found active travel in AsyncStorage for current user:", activeTravel);
                    }
                } catch (e) {
                    console.error("Error parsing stored travel data:", e);
                    await AsyncStorage.removeItem(activeTravelKey);
                    activeTravel = null;
                }
            }
            
            // If nothing in AsyncStorage or Redux state is more recent, check the backend
            if (!activeTravel && (!activeTravelState || activeTravelState === "active")) {
                // Dispatch action to check for active travel on backend
                try {
                    const result = await dispatch(checkActiveTravel()).unwrap();
                    if (result && result.data) {
                        activeTravel = result.data;
                        console.log("Found active travel from backend:", activeTravel);
                    }
                } catch (error) {
                    console.error("Error checking active travel from backend:", error);
                    // If backend check fails, proceed with normal initialization
                    initializeLocation();
                    return;
                }
            } else if (activeTravelState && activeTravelState !== "active" && 
                activeTravelState.userId === currentUser) {
                // Only use Redux state if it belongs to current user and is a valid object
                activeTravel = activeTravelState;
                console.log("Using active travel from Redux state:", activeTravel);
            }
            
            // If we found an active travel, restore it
            if (activeTravel && typeof activeTravel === 'object' && activeTravel._id) {
                await restoreActiveTravel(activeTravel);
            } else {
                // No active travel, proceed with normal initialization
                initializeLocation();
            }
        } catch (error) {
            console.error("Error checking for active travel:", error);
            // Proceed with normal initialization
            initializeLocation();
        }
    };
    
    // Restore active travel state
    const restoreActiveTravel = async (activeTravel) => {
        try {
            // Verify the travel belongs to current user before restoring
            if (!activeTravel || !activeTravel._id) {
                console.log("Invalid active travel data, not restoring");
                initializeLocation();
                return;
            }
            
            if (activeTravel.userId && activeTravel.userId !== currentUser) {
                console.log("Travel belongs to different user, not restoring");
                initializeLocation();
                return;
            }
            
            setActiveTravelId(activeTravel._id);
            setMeetingType(activeTravel.meetingType || 'MAV');
            setTransportMode(activeTravel.transportMode || 'car');
            setTracking(true);
            
            // Join the travel room via socket
            joinTravelRoom(activeTravel._id);
            
            // Restore travel path if available
            if (activeTravel.travelPath && activeTravel.travelPath.length > 0) {
                const formattedPath = activeTravel.travelPath.map(point => ({
                    latitude: point.latitude,
                    longitude: point.longitude,
                    timestamp: new Date(point.timestamp)
                }));
                
                setTravelPath(formattedPath);
                
                // Set the most recent point as current location
                const lastPoint = formattedPath[formattedPath.length - 1];
                setCurrentLocation(lastPoint);
                
                // Set the map to show the most recent location
                updateMapRegion(lastPoint);
            }
            
            // Restore total distance
            if (activeTravel.distanceCovered) {
                setTotalDistance(activeTravel.distanceCovered);
            }
            
            // Save to AsyncStorage for persistence with user-specific key
            const activeTravelKey = `activeTravel_${currentUser}`;
            await AsyncStorage.setItem(activeTravelKey, JSON.stringify(activeTravel));
            
            // Start tracking the current location
            initializeLocation();
            startLocationTracking();
            
            console.log("Restored active travel:", activeTravel._id);
        } catch (error) {
            console.error("Error restoring active travel:", error);
            initializeLocation();
        }
    };

    // Calculate distance between two coordinates in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    };
    
    const deg2rad = (deg) => {
        return deg * (Math.PI/180);
    };

    const updateMapRegion = (location) => {
        if (!location) return;
        
        const newRegion = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        };
        
        setMapRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
    };

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            const locationOptions = {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 10000,
            };

            // Try high accuracy first
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    });
                },
                (error) => {
                    // If high accuracy fails, try with lower accuracy
                    console.log('High accuracy position failed, trying low accuracy');
                    Geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                timestamp: position.timestamp,
                            });
                        },
                        (finalError) => {
                            reject(finalError);
                        },
                        { ...locationOptions, enableHighAccuracy: false }
                    );
                },
                locationOptions
            );
        });
    };

    const handleLocationUpdate = (position) => {
        const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
        };

        setCurrentLocation(newLocation);
        setIsInitializing(false);

        if (tracking) {
            setTravelPath(prevPath => {
                const lastPoint = prevPath[prevPath.length - 1];
                
                // Update total distance
                if (lastPoint) {
                    const segmentDistance = calculateDistance(
                        lastPoint.latitude, 
                        lastPoint.longitude, 
                        newLocation.latitude, 
                        newLocation.longitude
                    );
                    
                    // Only add distance if it's more than 0.005 km (5 meters) to avoid GPS fluctuations
                    if (segmentDistance > 0.005) {
                        setTotalDistance(prev => prev + segmentDistance);
                    }
                    
                    // Check if new location is significantly different
                    if (lastPoint.latitude === newLocation.latitude &&
                        lastPoint.longitude === newLocation.longitude) {
                        return prevPath;
                    }
                }
                
                return [...prevPath, newLocation];
            });

            // Try to update location on server
            updateLocationOnServer(newLocation);
            
            // Also send location update via socket directly
            emitLocationUpdate(newLocation);
            
            updateMapRegion(newLocation);
        }
    };

    // Send location updates through socket
    const emitLocationUpdate = (location) => {
        if (socketRef.current && socketRef.current.connected && activeTravelId) {
            socketRef.current.emit('locationUpdate', {
                travelId: activeTravelId,
                latitude: location.latitude,
                longitude: location.longitude,
                userId: currentUser,
                userName: userInfo.userName || 'You'
            });
        }
    };

    const updateLocationOnServer = async (location) => {
        try {
            if (!activeTravelId) return;
            
            await dispatch(updateLocation({
                travelId: activeTravelId,
                latitude: location.latitude,
                longitude: location.longitude,
                totalDistance
            })).unwrap();
            
            // If we have offline locations, try to sync them
            if (offlineLocationQueueRef.current.length > 0) {
                console.log(`Attempting to sync ${offlineLocationQueueRef.current.length} offline locations`);
                
                await dispatch(syncOfflineLocations({
                    travelId: activeTravelId,
                    locations: offlineLocationQueueRef.current
                })).unwrap();
                
                // Clear the queue after successful sync
                offlineLocationQueueRef.current = [];
            }
        } catch (error) {
            console.error('Failed to update location on server:', error);
            
            // Store location for later sync
            offlineLocationQueueRef.current.push({
                ...location,
                timestamp: new Date().toISOString()
            });
            
            console.log(`Stored location for offline sync. Queue size: ${offlineLocationQueueRef.current.length}`);
        }
    };

    const startLocationTracking = () => {
        if (watchIdRef.current) return;

        watchIdRef.current = Geolocation.watchPosition(
            handleLocationUpdate,
            (error) => {
                console.error('Watch position error:', error);
                retryLocationTracking();
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 5,
                interval: 3000,
                fastestInterval: 2000,
            }
        );
    };

    const retryLocationTracking = () => {
        if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
            retryAttemptsRef.current += 1;
            stopLocationTracking();
            setTimeout(() => {
                startLocationTracking();
            }, 1000);
        } else {
            Alert.alert(
                'Location Error',
                'Unable to track location. Please check your GPS settings and try again.',
                [
                    { text: 'Open Settings', onPress: openSettings },
                    { text: 'Try Again', onPress: () => {
                        retryAttemptsRef.current = 0;
                        startLocationTracking();
                    }},
                ]
            );
        }
    };

    const stopLocationTracking = () => {
        if (watchIdRef.current) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                const auth = await Geolocation.requestAuthorization('whenInUse');
                if (auth === 'granted') {
                    setLocationError(null);
                    return true;
                }
                setLocationError('locationPermission');
                return false;
            }

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location to track your travel.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setLocationError(null);
                return true;
            }
            
            setLocationError('locationPermission');
            return false;
        } catch (err) {
            console.warn('Permission request error:', err);
            setLocationError('unknown');
            return false;
        }
    };

    const initializeLocation = async () => {
        setIsInitializing(true);
        try {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                setIsInitializing(false);
                return;
            }

            const location = await getCurrentPosition();
            setCurrentLocation(location);
            updateMapRegion(location);
            setLocationError(null);
        } catch (error) {
            console.error('Error in initializeLocation:', error);
            if (error.code === 1) {
                setLocationError('locationPermission');
            } else if (error.code === 2) {
                setLocationError('locationDisabled');
            } else if (error.code === 3) {
                // Handle timeout specifically
                Alert.alert(
                    'Location Timeout',
                    'Unable to get your location. Please ensure you have a clear view of the sky and try again.',
                    [
                        { text: 'Open Settings', onPress: openSettings },
                        { text: 'Retry', onPress: initializeLocation }
                    ]
                );
            } else {
                setLocationError('unknown');
            }
        } finally {
            setIsInitializing(false);
        }
    };

    const startTracking = async () => {
        try {
            setIsLoading(true); // Show loader when starting
            
            const location = await getCurrentPosition();
            setCurrentLocation(location);
            setTravelPath([location]);
            setTotalDistance(0);
            
            const startData = {
                meetingType,
                transportMode,
                latitude: location.latitude,
                longitude: location.longitude,
                userId: currentUser
            };
            
            const result = await dispatch(startTravel(startData)).unwrap();
            
            if (result && result.data && result.data._id) {
                const travelId = result.data._id;
                setActiveTravelId(travelId);
                
                joinTravelRoom(travelId);
                
                const activeTravelKey = `activeTravel_${currentUser}`;
                await AsyncStorage.setItem(activeTravelKey, JSON.stringify(result.data));
            }
            
            setTracking(true);
            startLocationTracking();
            retryAttemptsRef.current = 0;
        } catch (error) {
            console.error('Error in startTracking:', error);
            Alert.alert(
                'Error',
                'Failed to start tracking. Please ensure GPS is enabled and try again.',
                [
                    { text: 'Open Settings', onPress: openSettings },
                    { text: 'Try Again', onPress: startTracking }
                ]
            );
        } finally {
            setIsLoading(false); // Hide loader when done (success or failure)
        }
    };

    const syncOfflineLocations = async (data) => {
        // Add this function to your slice and implement on backend
        // This will be called to sync any locations stored while offline
        return dispatch({
            type: 'travel/syncOfflineLocations',
            payload: data
        });
    };

    const stopTracking = async () => {
        try {
            setIsLoading(true); // Show loader when stopping
            stopLocationTracking();
            
            if (activeTravelId && currentLocation) {
                await dispatch(endTravel({
                    travelId: activeTravelId,
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude
                })).unwrap();
                
                // Clear local storage with user-specific key
                const activeTravelKey = `activeTravel_${currentUser}`;
                await AsyncStorage.removeItem(activeTravelKey);
                setActiveTravelId(null);
                
                // Clear other travelers from the map
                setOtherTravelers({});
            }
            
            setTracking(false);

            setTimeout(() => {
                setTravelPath([]);
                setTotalDistance(0);
            }, 0);
        } catch (error) {
            console.error('Error stopping tracking:', error);
            Alert.alert('Error', 'Failed to stop tracking. Please try again.');
        } finally {
            setIsLoading(false); // Hide loader when done
        }
    };

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    const renderError = () => {
        switch (locationError) {
            case 'locationPermission':
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Location permission is required. Please enable location permissions in settings.
                        </Text>
                        <Button mode="contained" onPress={openSettings} style={styles.errorButton}>
                            Open Settings
                        </Button>
                    </View>
                );
            case 'locationDisabled':
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Location services are disabled. Please enable GPS in your device settings.
                        </Text>
                        <Button mode="contained" onPress={openSettings} style={styles.errorButton}>
                            Open Settings
                        </Button>
                    </View>
                );
            case 'unknown':
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Unable to get location. Please check your GPS settings and try again.
                        </Text>
                        <Button mode="contained" onPress={initializeLocation} style={styles.errorButton}>
                            Retry
                        </Button>
                    </View>
                );
            default:
                return null;
        }
    };

    const formatDistance = (distance) => {
        if (distance < 1) {
            // Convert to meters if less than 1 km
            return `${Math.round(distance * 1000)} m`;
        }
        return `${distance.toFixed(2)} km`;
    };
    
    // Get the count of other travelers
    const otherTravelerCount = Object.keys(otherTravelers).length;

    return (
        <SafeAreaView style={styles.container}>
            {locationError ? (
                renderError()
            ) : (
                <>
                    {/* Distance Display Card */}
                    <Card style={styles.distanceCard}>
                        <Card.Content style={styles.distanceCardContent}>
                            <View style={styles.distanceDisplay}>
                                <Text style={styles.distanceLabel}>Distance Traveled</Text>
                                <Text style={styles.distanceValue}>{formatDistance(totalDistance)}</Text>
                                {activeTravelId && tracking && (
                                    <Text style={styles.activeTrackingText}>
                                        Active Tracking: {meetingType} 
                                        {otherTravelerCount > 0 && ` | ${otherTravelerCount} other ${otherTravelerCount === 1 ? 'traveler' : 'travelers'} nearby`}
                                    </Text>
                                )}
                            </View>
                            {tracking && (
                                <IconButton
                                    icon="crosshairs-gps"
                                    size={30}
                                    onPress={() => {
                                        if (currentLocation) {
                                            updateMapRegion(currentLocation);
                                        }
                                    }}
                                />
                            )}
                        </Card.Content>
                    </Card>
    
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={mapRegion}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        followsUserLocation={tracking}
                    >
                        {currentLocation && (
                            <Marker
                                coordinate={{
                                    latitude: currentLocation.latitude,
                                    longitude: currentLocation.longitude,
                                }}
                                title="Your Location"
                                pinColor="#2E86C1" // Blue for current user
                            />
                        )}
                        {travelPath.length > 1 && (
                            <Polyline
                                key={JSON.stringify(travelPath)}
                                coordinates={travelPath}
                                strokeColor="#2E86C1"
                                strokeWidth={4}
                                lineDashPattern={[1]}
                            />
                        )}
                        
                        {/* Render other travelers on the map */}
                        {Object.entries(otherTravelers).map(([userId, data]) => (
                            <Marker
                                key={`traveler-${userId}`}
                                coordinate={data.location}
                                title={data.userName || 'Other Traveler'}
                                description={`Last updated: ${new Date(data.timestamp).toLocaleTimeString()}`}
                                pinColor="#E74C3C" // Red for other travelers
                            />
                        ))}
                    </MapView>
    
                    <View style={styles.controls}>
                        <SegmentedButtons
                            value={meetingType}
                            onValueChange={setMeetingType}
                            disabled={tracking}
                            buttons={[
                                { value: 'MAV', label: 'MAV' },
                                { value: 'APAV', label: 'APAV' },
                                { value: 'Naipunya_Varg', label: 'Naipunya Varg' },
                                { value: 'Dakshta_Varg', label: 'Dakshta Varg' },
                            ]}
                        />
    
                        <SegmentedButtons
                            style={styles.transportButtons}
                            value={transportMode}
                            onValueChange={setTransportMode}
                            disabled={tracking}
                            buttons={[
                                { value: 'car', label: 'Car' },
                                { value: 'bike', label: 'Bike' },
                                { value: 'bus', label: 'Bus' },
                                { value: 'train', label: 'Train' },
                            ]}
                        />
    
                        <Button
                            mode="contained"
                            style={tracking ? styles.stopButton : styles.startButton}
                            onPress={tracking ? stopTracking : startTracking}
                            loading={isLoading} // This will show the loading indicator
                            disabled={isLoading} // Prevent multiple clicks while loading
                        >
                            {tracking ? 'Stop Tracking' : 'Start Tracking'}
                        </Button>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 240, // Adjusted for distance card
    },
    controls: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    transportButtons: {
        marginTop: 12,
    },
    startButton: {
        marginTop: 16,
        backgroundColor: '#27AE60',
    },
    stopButton: {
        marginTop: 16, 
        backgroundColor: '#E74C3C',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        textAlign: 'center',
        marginBottom: 16,
    },
    errorButton: {
        minWidth: 200,
    },
    distanceCard: {
        margin: 10,
        elevation: 4,
        borderRadius: 10,
    },
    distanceCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    distanceDisplay: {
        flex: 1,
    },
    distanceLabel: {
        fontSize: 14,
        color: '#555',
    },
    distanceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E86C1',
    },
    activeTrackingText: {
        fontSize: 12,
        color: '#27AE60',
        marginTop: 4,
    },
});

export default TravelScreen;