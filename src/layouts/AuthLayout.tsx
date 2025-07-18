import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const AuthLayout = () => {
  return (
    <div className='flex flex-col h-screen flex-1 bg-[#f5f5f5] overflow-hidden'>
      <main className='flex-1 px-2.5'>
        <Outlet />
      </main>
      <Box
        component='footer'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem',
          backgroundColor: '#292F66',
          fontSize: '0.75rem', // same as 12px
          color: '#FFFFFF',
          fontWeight: 500,
          width: '100%',
        }}
      >
        <Typography variant='body2'>
          © Copyright By Welspun Transformation Services Limited
        </Typography>
        <Typography variant='body2'>
          Privacy Policy | Term & Condition
        </Typography>
      </Box>
    </div>
  );
};

export default AuthLayout;
