import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { X } from 'lucide-react';
import Button from '../../../components/Button';

interface ConfirmExitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ExitInterview = ({ open, onClose, onConfirm }: ConfirmExitModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogContent className='relative p-6 rounded-xl bg-gray-100 shadow-xl'>
        <div className='flex flex-row justify-end'>
          {/* Close Icon */}
          <IconButton
            onClick={onClose}
            className='absolute top-2 right-2 text-black'
            size='small'
          >
            <X fontSize='small' />
          </IconButton>
        </div>
        {/* Title */}
        <Typography
          variant='h6'
          className='text-center text-lg md:text-xl font-bold text-[#DE0000] '
          fontWeight={600}
        >
          Are you sure?
        </Typography>
        {/* Subtitle */}
        <Typography className='text-center text-gray-800' marginY={3}>
          you want to exit from Interview.
        </Typography>

        {/* Buttons */}
        <Box className='flex items-center justify-center gap-4'>
          <Button
            onClick={onConfirm}
            label={'Yes'}
            backgroundColor={'#DE0000'}
            padding='5px 30px'
          />

          <Button
            onClick={onClose}
            label={'No'}
            backgroundColor={'#A8A8A8'}
            padding='5px 30px'
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExitInterview;
