import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentQuestion: {},
    currentAnswer: ""
};

const questionSlice = createSlice({
    name:"question",
    initialState,
    reducers: {
        updateQuestion: (state, action) => {
            state.currentQuestion = action.payload.data;
            state.currentAnswer = "";
        },
        updateAnswer: (state, action) => {
            state.currentAnswer = action.payload;
        }
    }
});

export const {updateQuestion, updateAnswer} = questionSlice.actions;
export default questionSlice.reducer;