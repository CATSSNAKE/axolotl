// Redux store library that gives functionality, which is the centralized State Management tool for the application
import { configureStore } from '@reduxjs/toolkit';
// userReducer function that handles all state from the user Slice
import userReducer from './userSlice';
// activityReducer function that handles all state relative to activities
import activityReducer from './activitySlice';

// initialize the Redux Store using the configureStore method
// store object is the "single source of truth" for the entire application's state
// holds the state tree and also allows state updates through dispatched actions
const store = configureStore({
    // reducer property to specify the different slices of state in this application that are managed by this store
  reducer: {
    // keys are the names of the slices in the global state, values are the reducer functions that are defined on another file
    // user slice of state and the userReducer is the function that manages this slice
    user: userReducer, 
    // activity slice of state and the activityReducer is the function the manages this slice
    activity: activityReducer,
  },
});

export default store;
