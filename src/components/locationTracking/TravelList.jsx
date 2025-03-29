import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTravels } from '../../redux/slices/travelSlice';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { format, isValid, parseISO, differenceInMilliseconds } from 'date-fns';

const REFRESH_INTERVAL = 10000; // Refresh every 10 seconds

const TravelList = () => {
  const dispatch = useDispatch();
  const travels = useSelector(state => state.travel.travelHistory);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  // Function to fetch travel data
  const refreshTravelData = useCallback(() => {
    dispatch(fetchTravels());
  }, [dispatch]);

  // Set up auto-refresh
  useEffect(() => {
    refreshTravelData(); // Initial fetch
    
    const intervalId = setInterval(() => {
      refreshTravelData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [refreshTravelData]);

  // Update selected travel when travels updates
  useEffect(() => {
    if (selectedTravel) {
      const updatedTravel = travels.find(t => t._id === selectedTravel._id);
      if (updatedTravel) {
        setSelectedTravel(updatedTravel);
      }
    }
  }, [travels]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy HH:mm') : 'Invalid Date';
    } catch (error) {
      console.log('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const formatDuration = (startTime, endTime) => {
    try {
      if (!startTime || !endTime) return 'Ongoing';
      
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      
      if (!isValid(start) || !isValid(end)) return 'Invalid Duration';
      
      const diff = differenceInMilliseconds(end, start);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.log('Duration formatting error:', error);
      return 'Invalid Duration';
    }
  };

  const handleCardPress = (travel) => {
    setSelectedTravel(travel);
    setMapVisible(true);
  };

  const closeMap = () => {
    setMapVisible(false);
    setSelectedTravel(null);
  };

  const getMapRegion = (travelPath) => {
    if (!travelPath || travelPath.length === 0) return {
      latitude: 20.5937,
      longitude: 78.9629,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    let minLat = travelPath[0].latitude;
    let maxLat = travelPath[0].latitude;
    let minLng = travelPath[0].longitude;
    let maxLng = travelPath[0].longitude;

    travelPath.forEach(loc => {
      if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
        minLat = Math.min(minLat, loc.latitude);
        maxLat = Math.max(maxLat, loc.latitude);
        minLng = Math.min(minLng, loc.longitude);
        maxLng = Math.max(maxLng, loc.longitude);
      }
    });

    const padding = 0.05;
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) + padding || 0.0922,
      longitudeDelta: (maxLng - minLng) + padding || 0.0421,
    };
  };

  // Create segments for dotted line
  const createDottedLineSegments = (coordinates) => {
    const segments = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      segments.push([coordinates[i], coordinates[i + 1]]);
    }
    return segments;
  };

  const TravelDetailsCard = ({ travel }) => (
    <Card style={styles.detailsCard}>
      <Card.Content>
        <Title>{travel.meetingType || 'Unknown Meeting Type'}</Title>
        <Paragraph style={styles.detailRow}>
          <Title style={styles.label}>Start Location: </Title>
          {travel.startLocation?.placeName || 'Unknown'}
        </Paragraph>
        <Paragraph style={styles.detailRow}>
          <Title style={styles.label}>Transport: </Title>
          {travel.transportMode || 'Not Specified'}
        </Paragraph>
        <Paragraph style={styles.detailRow}>
          <Title style={styles.label}>Distance: </Title>
          {(travel.distanceCovered || 0).toFixed(2)} km
        </Paragraph>
        <Paragraph style={styles.detailRow}>
          <Title style={styles.label}>Expense: </Title>
          ₹{travel.travelExpense || 0}
        </Paragraph>
        <Paragraph style={styles.detailRow}>
          <Title style={styles.label}>Status: </Title>
          {travel.status || 'Unknown'}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  const renderTravelMap = () => {
    if (!selectedTravel) return null;

    const travelPath = selectedTravel.travelPath || [];
    const mapRegion = getMapRegion(travelPath);
    const startLocation = travelPath[0];
    const endLocation = travelPath[travelPath.length - 1];

    const routeCoordinates = travelPath.map(location => ({
      latitude: location.latitude,
      longitude: location.longitude,
    }));

    const lineSegments = createDottedLineSegments(routeCoordinates);

    return (
      <Modal
        visible={mapVisible}
        animationType="slide"
        onRequestClose={closeMap}
      >
        <View style={styles.modalContainer}>
          <IconButton
            icon="close"
            size={24}
            style={styles.closeButton}
            onPress={closeMap}
          />
          
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
          >
            {startLocation && (
              <Marker
                coordinate={{
                  latitude: startLocation.latitude,
                  longitude: startLocation.longitude,
                }}
                title="Start"
                description={startLocation.placeName}
                pinColor="green"
              />
            )}

            {endLocation && endLocation !== startLocation && (
              <Marker
                coordinate={{
                  latitude: endLocation.latitude,
                  longitude: endLocation.longitude,
                }}
                title="Current Location"
                description={endLocation.placeName}
                pinColor="red"
              />
            )}

            {/* Render dotted line segments */}
            {lineSegments.map((segment, index) => (
              <Polyline
                key={index}
                coordinates={segment}
                strokeColor="#2196F3"
                strokeWidth={3}
                lineDashPattern={[5, 5]} // Creates dotted line effect
              />
            ))}
          </MapView>

          <TravelDetailsCard travel={selectedTravel} />
        </View>
      </Modal>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.meetingType || 'Unknown Meeting Type'}</Title>
          <Paragraph style={styles.cardDetails}>
            Transport: {item.transportMode || 'Not Specified'}
          </Paragraph>
          <Paragraph style={styles.cardDetails}>
            From: {item.startLocation?.city || 'Unknown'}
            {'\n'}
            Distance: {(item.distanceCovered || 0).toFixed(2)} km
          </Paragraph>
          <Paragraph style={styles.cardDetails}>
            Status: {item.status}
            {'\n'}
            Expense: ₹{item.travelExpense || 0}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={travels}
        renderItem={renderItem}
        keyExtractor={item => item._id || Math.random().toString()}
        style={styles.list}
      />
      {renderTravelMap()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardDetails: {
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  detailsCard: {
    margin: 16,
    elevation: 2,
  },
  detailRow: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TravelList;