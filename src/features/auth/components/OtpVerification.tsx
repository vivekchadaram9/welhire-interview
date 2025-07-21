import React, { useState, type ChangeEvent } from 'react';
import { Typography, Box, Checkbox, Link, useTheme } from '@mui/material';
import CountdownTimer from '../../../components/CountDownTimer';
import Button from '../../../components/Button';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducer/authSlice';

interface OtpVerificationProps {
  onCancel: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ onCancel }) => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string>('');
  const email = useSelector((state: any) => state.auth.emailId)
  const navigate = useNavigate()
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setError('');
    setOtpErrorMessage('');
  };

  const handleTermsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    setError('');
  };

  const handleResendOtp = () => {
    setOtp('');
    setError('');
    setOtpErrorMessage('');
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      setError('Please accept the terms to proceed.');
    } else if (otp.length !== 6 || otp !== '123456') {
      setError('The entered OTP is invalid. Please try again.');
    } else {
      dispatch(login({token:email}))//for now as there is no token
      navigate('/interview')
    }
  };

  return (
    <Box>
      <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
        OTP Verification
      </Typography>

      <Typography
        sx={{ color: theme.palette.text.secondary, fontSize: 12, mt: 1 }}
      >
        We’ve sent an OTP to your email: <Link>{email}</Link>.<br />
        Please check your inbox.
      </Typography>

      <Typography
        sx={{ color: theme.palette.text.secondary, fontSize: 12, mt: 2 }}
      >
        Enter Email OTP
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #ddd',
          pb: 1,
          flexWrap: 'wrap',
          mt: 2,
        }}
      >
        <input
          type='text'
          maxLength={6}
          placeholder='******'
          value={otp}
          onChange={handleOtpChange}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '18px',
            letterSpacing: '8px',
            flex: 1,
            minWidth: '150px',
          }}
        />
        <CountdownTimer
          initialSeconds={45}
          onResend={handleResendOtp}
          setOtpErrorMessage={setOtpErrorMessage}
        />
      </Box>

      {(error || otpErrorMessage) && (
        <Typography
          sx={{ color: theme.palette.error.main, fontSize: 12, mt: 1 }}
        >
          {error || otpErrorMessage}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mt: 2,
          flexWrap: 'wrap',
        }}
      >
        <Checkbox
          id='terms'
          checked={termsAccepted}
          onChange={handleTermsChange}
          sx={{
            width: 16,
            height: 16,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
            borderRadius: '4px',
            p: 0,
            mr: 1,
            mt: '2px',
          }}
        />
        <Typography
          variant='body2'
          sx={{
            fontSize: '13px',
            color: '#000',
            lineHeight: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          By signing up, you agree to our{' '}
          <Link href='#' sx={{ color: '#007AFF', textDecoration: 'none' }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='#' sx={{ color: '#007AFF', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mt: 3,
        }}
      >
        <Button
          label='Cancel'
          backgroundColor='#f0f0f0'
          textColor='#000'
          onClick={onCancel}
        />
        <Button
          label='Submit'
          backgroundColor='#005AA9'
          onClick={handleSubmit}
          disabled={otp.length !== 6 || !termsAccepted}
        />
      </Box>
    </Box>
  );
};

export default OtpVerification;
