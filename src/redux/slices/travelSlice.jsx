import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../constant/Constatnt';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    // console.log('Retrieved token:', token); // Log the token value
    if (!token) {
      console.warn('No token found in AsyncStorage');
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};


// Helper function to create authenticated axios instance
const createAuthenticatedAxios = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export const fetchTravels = createAsyncThunk(
  'travel/fetchTravels',
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await createAuthenticatedAxios();
      const response = await axiosInstance.get('/api/v1/meeting-travel/my-travels');
      return response.data;
    } catch (error) {
      console.error('Fetch travels error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkActiveTravel = createAsyncThunk(
  'travel/checkActiveTravel',
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = await createAuthenticatedAxios();
      const response = await axiosInstance.get('/api/v1/meeting-travel/travel/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const startTravel = createAsyncThunk(
  'travel/start',
  async (data, { rejectWithValue }) => {
    try {
      const axiosInstance = await createAuthenticatedAxios();

      // Send data directly as received from the component
      const response = await axiosInstance.post('/api/v1/meeting-travel/start', data);
      return response.data;
    } catch (error) {
      console.error('Start travel error:', error.response?.data || error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLocation = createAsyncThunk(
  'travel/update',
  async ({ travelId, latitude, longitude }, { rejectWithValue }) => {
    try {
      const axiosInstance = await createAuthenticatedAxios();

      const locationData = {
        latitude,
        longitude
      };

      console.log('Updating location:', { travelId, locationData });

      const response = await axiosInstance.post(
        `/api/v1/meeting-travel/${travelId}/update`,
        locationData
      );
      return response.data;
    } catch (error) {
      console.error('Update location error:', error.response?.data || error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// In travelSlice.js, replace the endTravel function with:
export const endTravel = createAsyncThunk(
  'travel/end',
  async (data, { rejectWithValue, getState }) => {
    try {
      const axiosInstance = await createAuthenticatedAxios();

      // If no data was provided, try to get info from state
      const state = getState();
      const travelId = data?.travelId || state.travel.currentTravel?.id;

      if (!travelId) {
        throw new Error('No travel ID available to end travel');
      }

      // Change this structure to match API expectations
      const endData = {
        latitude: data?.latitude || 0,
        longitude: data?.longitude || 0
      };

      console.log('Ending travel:', { travelId, endData });

      const response = await axiosInstance.post(
        `/api/v1/meeting-travel/${travelId}/end`,
        endData
      );
      return response.data;
    } catch (error) {
      console.error('End travel error:', error.response?.data || error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const travelSlice = createSlice({
  name: 'travel',
  initialState: {
    currentTravel: null,
    travelHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTravel: (state) => {
      state.currentTravel = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Travels
      .addCase(fetchTravels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravels.fulfilled, (state, action) => {
        state.loading = false;
        state.travelHistory = action.payload.data;
      })
      .addCase(fetchTravels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Start Travel
      .addCase(startTravel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTravel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTravel = action.payload.data;
      })
      .addCase(startTravel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update Location
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTravel = action.payload.data;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // End Travel
      .addCase(endTravel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In travelSlice.js, modify the endTravel.fulfilled case
      .addCase(endTravel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTravel = null;
        if (action.payload.data) {
          // Ensure the travel has a unique ID before adding to history
          const travelToAdd = action.payload.data;
          // Check if this travel is already in the history
          const existingIndex = state.travelHistory.findIndex(t => t._id === travelToAdd._id);
          if (existingIndex >= 0) {
            // Replace existing entry
            state.travelHistory[existingIndex] = travelToAdd;
          } else {
            // Add new entry
            state.travelHistory = [...state.travelHistory, travelToAdd];
          }
        }
      })

      .addCase(endTravel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, clearCurrentTravel } = travelSlice.actions;
export default travelSlice.reducer;