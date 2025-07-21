import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/reducer/authSlice'
import interviewReducer from '../features/interview/reducer/interviewSlice'
import questionReducer from "../features/interview/reducer/questionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    interview:interviewReducer,
    question: questionReducer
  },
});

export default store;
