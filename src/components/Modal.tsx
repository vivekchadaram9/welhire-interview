import { Box, Modal } from '@mui/material';

interface ModalProps {
  children: React.ReactNode;
  style?: object;
  open: boolean;
  onClose: () => void;
}
const ModalComponent: React.FC<ModalProps> = ({ children, open, style,onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default ModalComponent;
