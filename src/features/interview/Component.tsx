import { Button } from '@mui/material';
import ExitInterview from './components/ExitInterview';
import InterviewFunc from './Container';
import StartInterview from './components/StartInterview';
import VideoComponent from './components/VideoComponent';
import ChatComponent from './components/ChatComponent';

export const Interview = () => {
  const {
    interviewStarted,
    startInterview,
    stopRecording,
    recording,
    videoRef,
    downloadUrl,
    timerRef,
    questionObject,
    nextDisabled,
    onClickNext,
    showExitInterviewModal,
    dispatch,
    exitInterviewModalStatus,
    handleInterviewStopping,
    transcript
  } = InterviewFunc();
  return (
    <div>
      <div className='flex flex-1'>
        <ExitInterview
          open={showExitInterviewModal}
          onClose={() => dispatch(exitInterviewModalStatus(false))}
          onConfirm={handleInterviewStopping}
        />
        <StartInterview
          open={!interviewStarted} //should show if interview is not yet started
          onClose={startInterview}
        />
        <div className='flex justify-between'>
        <div className="w-8/12" >
          <VideoComponent
            recording={recording}
            videoRef={videoRef}
            timerRef={timerRef}
            questionObject={questionObject}
            nextDisabled={nextDisabled}
            onClickNext={onClickNext}
          />

        </div>
          <div className='w-4/12 flex felx-col'>
           {/* for testing if you ever want to download video */}
          {/* <Button
            variant='outlined'
            color='error'
            onClick={stopRecording}
            disabled={!recording}
          >
            Stop & Download
          </Button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download='full_app_recording.mp4'
              className='text-blue-600 underline font-medium'
            >
              Download Recording
            </a>
          )} */}
          <p>{transcript}</p>
          </div>
         
        </div>
      </div>
    </div>
  );
};
