import { Button } from '@mui/material';
import ExitInterview from './components/ExitInterview';
import InterviewFunc from './Container';
import StartInterview from './components/StartInterview';
import VideoComponent from './components/VideoComponent';
import ChatComponent from './components/ChatComponent';

export const Interview = () => {
  const {
    showExitModal,
    setShowExitModal,
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
  } = InterviewFunc();
  return (
    <div>
      <div className='flex flex-1 grow-1'>
        <ExitInterview
          open={showExitModal}
          onClose={() => setShowExitModal(false)}
          onConfirm={() => console.log('stop interview')}
        />
        <StartInterview
          open={!interviewStarted} //should show if interview is not yet started
          onClose={startInterview}
        />
        <div className='flex flex-1 justify-between w-11/12'>
          <VideoComponent
            recording={recording}
            videoRef={videoRef}
            timerRef={timerRef}
            questionObject={questionObject}
            nextDisabled={nextDisabled}
            onClickNext={onClickNext}
          />
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
          <ChatComponent />
        </div>
      </div>
    </div>
  );
};
