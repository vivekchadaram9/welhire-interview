import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/reducer/authSlice'
import interviewReducer from '../features/interview/reducer/interviewSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    interview:interviewReducer,
  },
});

export default store;
