import React from 'react';
import { Box, InputBase } from '@mui/material';

interface InputProps {
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  borderColor?: string;
  textColor?: string;
  borderRadius?: string;
}

const Input : React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  icon,
  value,
  onChange,
  borderColor = '#ccc',
  textColor = '#333',
  borderRadius = '0',
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        marginBottom: '20px',
      }}
    >
      {icon && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            color: '#050505',
            fontSize: '16px',
          }}
        >
          {icon}
        </Box>
      )}

      <InputBase
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        sx={{
          border: 'none',
          borderBottom: `1px solid ${borderColor}`,
          borderRadius: borderRadius,
          color: textColor,
          padding: '10px 10px 10px 36px',
          backgroundColor: 'transparent',
          outline: 'none',
          fontSize: '14px',
          '&:focus': {
            borderBottom: '2px solid #007bff',
          },
        }}
      />
    </Box>
  );
};

export default Input;
