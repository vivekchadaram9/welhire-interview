import { useState } from 'react';
import { Box, Button } from '@mui/material';
import login from '../../../assets/icons/login.svg';
import welhireLogo from '../../../assets/icons/WelhireLogo.svg';
import LoginForm from '../components/LoginForm';
import OtpVerification from '../components/OtpVerification';

const LoginPage = () => {
  const [showOtp, setShowOtp] = useState(false);

  const handleLoginClick = () => setShowOtp(true);
  const handleCancelOtp = () => setShowOtp(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component='img'
        src={welhireLogo}
        alt='WeHire Logo'
        sx={{ maxWidth: '180px', mb: 2 }}
      />

      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#fff',
          borderRadius: '12px',
          overflow: 'hidden',
          width: { xs: '95%', sm: '90%', md: '80%' },
          maxWidth: '900px',
          minHeight: { xs: 'auto', md: '70vh' },
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: '20px', md: '18px' },
          }}
        >
          <Box
            component='img'
            src={login}
            alt='Illustration'
            sx={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            flex: 1,
            padding: { xs: '10px 10px', sm: '10px 20px', md: '20px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '20px',
              padding: '4px',
              backgroundColor: '#f0f4f8',
            }}
          >
            <Button
              sx={{
                flex: 1,
                backgroundColor: '#fff',
                fontWeight: 'bold',
                borderRadius: 0,
                textTransform: 'none',
                boxShadow: 'none',
              }}
              disableElevation
            >
              Log in
            </Button>
          </Box>
          {!showOtp ? (
            <LoginForm onLoginClick={handleLoginClick} />
          ) : (
            <OtpVerification onCancel={handleCancelOtp} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
