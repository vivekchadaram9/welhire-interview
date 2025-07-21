import { Box, Button } from "@mui/material";
import ExitInterview from "./components/ExitInterview";
import InterviewFunc from "./Container";
import StartInterview from "./components/StartInterview";
import VideoComponent from "./components/VideoComponent";
import ChatComponent from "./components/ChatComponent";
import { useEffect } from "react";
import { startSession } from "./services/services";

export const Interview = () => {
  const {
    interviewStarted,
    startInterview,
    recording,
    videoRef,
    timerRef,
    nextDisabled,
    onClickNext,
    showExitInterviewModal,
    dispatch,
    exitInterviewModalStatus,
    handleInterviewStopping,
    interimTranscript,
    transcript,
    currentQuestion,
    questionOver,
    updateCurrentAnswer,
    chatList
  } = InterviewFunc();

  useEffect(()=>{
    startSession();
  },[]);
  return (
      <Box sx={{ height: "100%", overflowY: {xs:"scroll",md:"hidden"} }}>
        <ExitInterview
          open={showExitInterviewModal}
          onClose={() => dispatch(exitInterviewModalStatus(false))}
          onConfirm={handleInterviewStopping}
        />
        <StartInterview
          open={!interviewStarted} //should show if interview is not yet started
          onClose={startInterview}
        />
         <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          gap: "1rem",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
          <VideoComponent
            recording={recording}
            videoRef={videoRef}
            timerRef={timerRef}
            nextDisabled={nextDisabled}
            onClickNext={onClickNext}
            currentQuestion={currentQuestion}
            questionTotalCount={10}
            questionOver={questionOver}
          />

        <ChatComponent
        chatList={chatList}
        interimTranscript={interimTranscript}
        transcript={transcript}
        currentQuestion={currentQuestion}
        questionTotalCount={10}
        updateCurrentAnswer={updateCurrentAnswer}/>
          </Box>
      </Box>
  );
};