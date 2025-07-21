import React, { useState, type ChangeEvent } from 'react';
import { FaUser } from 'react-icons/fa';
import { Box, Button } from '@mui/material';
import Input from '../../../components/Input';
import { useDispatch } from 'react-redux';
import { updatedEmail } from '../reducer/authSlice';

interface LoginFormProps {
  onLoginClick: (input: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginClick }) => {
  const [userInput, setUserInput] = useState<string>('');
  const dispatch = useDispatch()
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const cleanInput = userInput.replace(/\s+/g, '').trim();

  const isEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);


  const isValidInput = isEmail(cleanInput) 

  const handleLoginClick = () =>{
    if(isValidInput){
      onLoginClick(cleanInput)
      dispatch(updatedEmail(cleanInput))
    }
  }

  return (
    <Box>
      <Input
        placeholder='Email ID'
        icon={<FaUser />}
        value={userInput}
        onChange={handleInputChange}
      />

      <Box sx={{ margin: '20px 0' }}>
        <Button
          variant='contained'
          sx={{
            backgroundColor: '#005AA9',
            textTransform: 'none',
            width: '100%',
            '&:disabled': {
              backgroundColor: '#cccccc',
              color: '#666666',
            },
          }}
          onClick={handleLoginClick}
          disabled={!isValidInput}
        >
          Login with OTP
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
