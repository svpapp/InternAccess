import { configureStore } from '@reduxjs/toolkit';
import travelReducer from '../slices/travelSlice';
import authReducer from '../slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    travel: travelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Needed for handling non-serializable data like Date objects
    })
});

export default store;