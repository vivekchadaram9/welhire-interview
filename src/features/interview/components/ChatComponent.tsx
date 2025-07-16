import { Avatar, Box, LinearProgress, Typography } from '@mui/material';
import { Lightbulb, MessageCircleMore } from 'lucide-react';

const ChatComponent = () => {
  return (
    <Box className='w-full md:w-[380px] bg-gray-100 flex flex-col justify-between border-l border-gray-200 overflow-scroll'>
      {/* Header */}
      <Box className='p-4 border-b border-gray-200 flex items-center justify-between'>
        <Typography variant='h6' className='text-gray-800 font-semibold'>
          Interview Chat
        </Typography>
        <Typography
          variant='body2'
          className='text-xs text-gray-500 font-medium'
        >
          Q <strong>1/10</strong>
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box className='px-4 pt-2'>
        <Typography variant='caption' className='text-gray-600 mb-1'>
          Progress
        </Typography>
        <LinearProgress
          variant='determinate'
          value={10}
          className='h-2 rounded bg-gray-300'
          color='primary'
        />
      </Box>

      {/* Chat Bubble */}
      <Box className='p-4 space-y-4'>
        <Box className='flex gap-2'>
          <Avatar
            alt='AI Avatar'
            src='/assets/ai-avatar.png'
            className='w-8 h-8'
          />
          <Box>
            <Typography variant='body2' className='font-semibold text-sm'>
              Chitti – AI{' '}
              <span className='text-xs text-gray-400 ml-2'>00:10</span>
            </Typography>
            <Box className='bg-white mt-1 p-3 rounded-lg shadow text-sm text-gray-800 max-w-xs'>
              Hello! Welcome to your interview. I’m Alex, your AI interviewer.
              Could you please introduce yourself and tell me a bit about your
              background?
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Empty State */}
      <Box className='px-4 flex flex-col items-center text-center text-sm text-gray-500 py-8'>
        <MessageCircleMore className='text-blue-500 mb-2' fontSize='large' />
        <Typography className='text-gray-600'>
          <span className='text-blue-600 font-medium'>
            Interview conversation will appear here.
          </span>
          <br />
          Start the interview to begin
        </Typography>
      </Box>

      {/* Interview Tips */}
      <Box className='bg-blue-50 p-4 border-t border-gray-200 space-y-2'>
        <Box className='flex items-center gap-2 mb-2'>
          <Lightbulb className='text-yellow-500' />
          <Typography
            variant='subtitle2'
            className='text-blue-800 font-semibold'
          >
            Interview Tips:
          </Typography>
        </Box>
        <ul className='text-sm text-gray-700 list-disc list-inside space-y-1'>
          <li>Speak clearly and maintain eye contact</li>
          <li>Take your time to think before answering</li>
          <li>Use specific examples when possible</li>
        </ul>
      </Box>
    </Box>
  );
};

export default ChatComponent;