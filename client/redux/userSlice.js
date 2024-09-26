// importing redux toolkit slice which combines redux reducers, action creators and action types
import { createSlice } from '@reduxjs/toolkit';
// manages login and user state, containing properties that are data that is relevant to the user
const initialState = {
  email: '',
  password: '',
  confirmPw: '',
  firstName: '',
  city: '',
  zipCode: '',
  gender: '',
  phone: '',
  isLogin: false,
};
//initializing a new slice of the global state, keeps the related data and state logic in one place
// passes in the initialState above
// reducers is an object that has a setter methods attached that manipulate state
const userSlice = createSlice({
  // this is the "user/" endpoint which is the string that all action types will reference and be generated from - ex. user/setUserData
  name: 'user',
  //starting state for the slice - default values for when the application is first initialized
  initialState,
  // this is the reducers property which is an object that holds functions for each "action case" and how the related state should be updated
  // these functions correspond to an action and will be triggered when that action is dispatched
  reducers: {
    // setUserData is a reducer and the state being passed in represents the current state of this slice - mutable state within this function - Immer library
    //action is an object that represents the dispatched action and has a type property on it that will invoke this "endpoint"(user/setUserData) & a payload property that has the data passed in w/ the action
    setUserData: (state, action) => {
      // deconstructed from the action.payload property, this means that when user/setUserData is called, it should be dispatched with an object containing these properties on it from the client
      const {
        email,
        password,
        confirmPw,
        firstName,
        city,
        zipCode,
        gender,
        phone,
        //the user data from the form submission is included in the action.payload property which holds each inividual value in a variable
      } = action.payload;
      // update each state property that corresponds to the user submitted data which is deconstructed above(so the value should be referenced by the key)
      // **Since Redux Toolkit uses Immer under the hood, you can safely mutate the state object directly here. Immer will create a new immutable state based on the changes made to the draft state.**
      state.email = email;
      state.password = password;
      state.confirmPw = confirmPw;
      state.firstName = firstName;
      state.city = city;
      state.zipCode = zipCode;
      state.gender = gender;
      state.phone = phone;
    },
    // login reducer that takes a state parameter which will reassign the isLogin property to true;
    login: (state) => {
      state.isLogin = true;
    },
    // login reducer that takes a state parameter which will reassign the isLogin property to false;
    logout: (state) => {
      state.isLogin = false;
    },
  },
});
//
export const { setUserData, login, logout } = userSlice.actions;
export default userSlice.reducer;

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
