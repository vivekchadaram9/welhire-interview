import { Outlet } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Divider, Typography } from '@mui/material';

function InterviewLayout() {
  return (
    <div className='flex flex-col h-full p-2'>
      <div className='flex flex-row w-screen items-center'>
        <Icon name='logo' className='w-35 h-20' />
        <Divider
          orientation='vertical'
          variant='middle'
          flexItem
          sx={{ backgroundColor: '#000000' }}
        />
        <div className='flex flex-col ml-4'>
          <Typography variant='h5' className='text-[#66676A]'>
            AI Interview Platform
          </Typography>
          <Typography className='text-[#C4C5C9]'>
            AI Powered Interview Suite
          </Typography>
        </div>
      </div>
      <div className='rounded-sm bg-white p-2 h-full shadow'>
        <Outlet />
      </div>
    </div>
  );
}

export default InterviewLayout;
