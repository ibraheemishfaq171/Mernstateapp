import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error;
    },
    signInfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserstart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSUccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSUccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInfailure,
  updateUserstart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSUccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSUccess,
} = userSlice.actions;
export default userSlice.reducer;
