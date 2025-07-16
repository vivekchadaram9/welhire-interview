import { Dialog, DialogContent, Typography, Box } from '@mui/material';
import Button from '../../../components/Button';
import { ArrowRight } from 'lucide-react';

interface ConfirmStartModalProps {
  open: boolean;
  onClose: () => void;
}

const StartInterview = ({
  open,
  onClose,
}: ConfirmStartModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        console.log(event,'event')
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      maxWidth='xs'
      fullWidth
    >
      <DialogContent className='relative p-6 rounded-xl bg-gray-100 shadow-xl'>
        {/* Title */}
        <Typography
          variant='h6'
          className='text-center text-lg md:text-xl font-bold text-[#292F66] '
          fontWeight={600}
        >
          Ready to Start Your Interview
        </Typography>
        {/* Subtitle */}
        <Typography className='text-center text-gray-800' marginY={3}>
          Join <span className='font-bold'>Chitti - AI</span>, your AI
          interviewer, for a comprehensive interview session
        </Typography>

        {/* Buttons */}
        <Box className='flex items-center justify-center gap-4'>
          <Button
            onClick={onClose}
            label={
              <div className='flex flex-row items-center text-white'>
                <p className='font-bold mr-1.5'>Start Interview</p>{' '}
                <ArrowRight size={15} />
              </div>
            }
            backgroundColor={'#292F66'}
            padding='5px 30px'
            fontWeight={500}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StartInterview;
