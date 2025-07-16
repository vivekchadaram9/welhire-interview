import { Container, Box } from '@mui/material';
import ExitInterview from './components/ExitInterview';
import InterviewFunc from './Container';
import StartInterview from './components/StartInterview';
import VideoComponent from './components/VideoComponent';
import ChatComponent from './components/ChatComponent';

export const Interview = () => {
    const {
      showExitModal,
      setShowExitModal,
      showInterviewModal,
      setShowInterviewModal,
    } = InterviewFunc();
  return (
    <Box className='bg-white'>
      <Container>
          <ExitInterview
            open={showExitModal}
            onClose={() => setShowExitModal(false)}
            onConfirm={() => console.log('stop interview')}
          />
          <StartInterview
            open={showInterviewModal}
            onClose={() => setShowInterviewModal(false)}
          />
          <div className='flex flex-row justify-between'>
            <VideoComponent />
          {/* <ChatComponent /> */}
          </div>
      </Container>
    </Box>
  );
};
