import { createSlice } from '@reduxjs/toolkit';
import { ActivityIcon } from 'lucide-react';

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  emailId : ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.emailId = '';
      localStorage.removeItem('token');
    },
    updatedEmail(state, action) {
      state.emailId = action.payload;
    },
  },
});

export const { login, logout, updatedEmail } = authSlice.actions;
export default authSlice.reducer;
