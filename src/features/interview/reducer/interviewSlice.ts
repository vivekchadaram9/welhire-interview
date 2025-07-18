import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interviewStarted : false,
  showExitInterviewModal : false,
  
};

const interviewSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    exitInterviewModalStatus(state, action) {
      state.showExitInterviewModal = action.payload;
    },
    
  },
});

export const { exitInterviewModalStatus } = interviewSlice.actions;
export default interviewSlice.reducer;
