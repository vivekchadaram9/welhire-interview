import { Outlet } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Divider, Typography } from '@mui/material';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { exitInterviewModalStatus } from '../features/interview/reducer/interviewSlice';

function InterviewLayout() {
  const dispatch = useDispatch()
  return (
    <div className='flex flex-col h-full p-2'>
      <div className='flex flex-row  items-center justify-between'>
        <div className='flex flex-row items-center'>
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

        <Button
          label='Exit?'
          backgroundColor='white'
          textColor='red'
          borderRadius='150px'
          disableElevation={false}
          onClick={()=>dispatch(exitInterviewModalStatus(true))}
        />
      </div>
      <div className='rounded-sm bg-white p-2 h-full shadow'>
        <Outlet />
      </div>
    </div>
  );
}

export default InterviewLayout;
