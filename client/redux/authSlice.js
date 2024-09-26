// importing redux toolkit slice
import { createSlice } from '@reduxjs/toolkit';
// manages login and user state
const initialState = {
  isLogin: false,
  user: {
    email: '',
    password: '',
    confirmPw: '',
    firstName: '',
    activity: '',
    skillLevel: '',
    city: '',
    zipCode: '',
    gender: '',
    phone: '',
    selectedA: {},
  },
  zipcodes: [],
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = initialState.user; 
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const slice = createSlice({
//   name: 'sliceName',  // A name for your slice (used in action types)
//   initialState: {},   // Initial state for this slice of the state
//   reducers: {         // An object containing reducer functions
//     actionOne: (state, action) => { /* logic for updating state */ },
//     actionTwo: (state, action) => { /* logic for another update */ },
//   }
// });

// export const { actionOne, actionTwo } = slice.actions;  // Generated action creators
// export default slice.reducer;                           // The generated reducer function
