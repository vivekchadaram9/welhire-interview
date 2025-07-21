import { Avatar, Box, Typography } from '@mui/material';
import type { FC } from 'react';
import styles from "./styles/ChatBubble.module.css";

interface ChatBubbleProps {
  isBot: boolean;
  id: string;
  message: string;
  timestamp?: string;
}

const ChatBubble: FC<ChatBubbleProps>  = ({isBot,id,message,timestamp}) => {
  return (
        <Box className="flex gap-2" sx={{display: "flex", flexDirection: isBot ? "row":"row-reverse", justifyContetnt: "flex-end",alignItems:"end",margin: "1.2rem 0.5rem", padding:"0.8rem 1rem"}}>
          <Avatar
            alt="AI Avatar"
            src={isBot ? "/src/assets/icons/chitti.svg" :"/src/assets/icons/user.svg" }
            className="w-6 h-6"
            sx={{ bgcolor: '#000000'}}
          />
          <Box>
            <Typography variant="body2" className="font-semibold text-sm" align={isBot ? "left" : "right"}>
              {isBot ? "Chitti – AI" : "Sonal Pandey"}
              {timestamp && <span className="text-xs text-black-400 ml-2">{timestamp}</span>}
            </Typography>
            <Box className={`${isBot ? styles['chat-left'] : styles['chat-right']} mt-1 p-3 rounded-lg text-sm text-gray-800 max-w-xs`}>
              {message}
            </Box>
          </Box>
        </Box>
  )
}

export default ChatBubble