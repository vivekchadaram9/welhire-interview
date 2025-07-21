import { Box, LinearProgress, Typography } from "@mui/material";
import type { FC } from "react";
import styles from "./styles/ChatComponent.module.css";
import ChatBubble from "./ChatBubble";
import React, { useEffect, useState } from "react";

interface ChatComponentProps {
  interimTranscript: string;
  transcript: string;
  currentQuestion: {
    questionId: string;
    question: string;
    number: number;
  };
  chatList: any;
  questionTotalCount: number;
  updateCurrentAnswer: (answer: string) => void;
}

const ChatComponent: FC<ChatComponentProps> = ({
  interimTranscript,
  transcript,
  currentQuestion,
  questionTotalCount,
  chatList,
}) => {
  const [chatInfo, toggleChatInfo] = useState(true);
  const endRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      if (chatList.length > 0 || interimTranscript || transcript) {
        endRef.current.scrollIntoView({ behavior: "smooth" });
        toggleChatInfo(false);
      }
    }
  }, [chatList, transcript, interimTranscript]);

  const getProgressPercentage = (): number => {
    if (!currentQuestion || !currentQuestion.number || !questionTotalCount)
      return 0;

    const questionNumber = Number(currentQuestion.number);
    const numerator = Math.min(
      Math.max(questionNumber - 1, 0),
      questionTotalCount
    );

    const percentage = (numerator / questionTotalCount) * 100;
    return Math.round(percentage);
  };

  return (
    <Box
      className={styles.chatContainer}
      sx={{
        flex: 1,
      }}
    >
      {/* Header */}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1rem 1rem 1.5rem",
        }}
      >
        <Typography variant="h6">Interview Chat</Typography>
        <Box className={styles.questionCounter}>
          <Typography>
            Q {currentQuestion?.number ?? 0}/{questionTotalCount}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box className="px-10 py-2" style={{ backgroundColor: "#E6EFFC" }}>
        <Box className="flex justify-between items-center">
          <Typography variant="caption">Progress</Typography>
          <Typography variant="caption">{getProgressPercentage()}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={getProgressPercentage()}
          sx={{
            height: 5,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": {
              backgroundColor: "rgb(30, 30, 169)",
              borderRadius: 5,
            },
            backgroundColor: "#ddd",
          }}
        />
      </Box>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "hidden",
        }}
      >
        {/* Chat Scrollable Area */}
        <div
          className={styles.chatScrollableArea}
          style={{
            flex: 3,
            background: "#F5F5F5",
            overflowY: "auto",
          }}
        >
          {chatList?.map(
            (data: any) =>
              data.message && (
                <ChatBubble
                  key={data.id}
                  isBot={data.isBot}
                  id={data.id}
                  message={data.message}
                  timestamp={data.timestamp}
                />
              )
          )}
          {(transcript || interimTranscript) && (
            <ChatBubble
              isBot={false}
              id="user"
              message={transcript || interimTranscript}
            />
          )}
          <div ref={endRef}></div>
        </div>

        {/* background text*/}
        {chatInfo && (
          <Box
            className="px-4 flex flex-col items-center text-center text-sm text-gray-500 py-8"
            sx={{
              background: "#F5F5F5",
            }}
          >
            <img
              alt="AI Avatar"
              src="/src/assets/icons/chatImg.svg"
              className="w-10 h-10"
            />
            <Typography className="text-gray-600" color="#595959">
              <span className="font-medium" style={{ color: "#0B32C2" }}>
                Interview conversation will appear here.
              </span>
              <br />
              Start the interview to begin
            </Typography>
          </Box>
        )}

        {/* Interview Tips */}
        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0.2rem 0",
              backgroundColor: "#E6EFFC",
              position: "relative",
            }}
          >
            <img
              className="text-yellow-500"
              style={{ position: "absolute", top: "-0.5rem", left: "0.5rem" }}
              src="/src/assets/icons/light.svg"
            />
            <Typography
              variant="subtitle2"
              className="font-semibold"
              color="#0B32C2"
            >
              Interview Tips:
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "1rem 0",
              background: "#F5F5F5",
            }}
          >
            <ul
              className="text-sm text-gray-700 list-disc list-inside space-y-1"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <li>Speak clearly and maintain eye contact</li>
              <li>Take your time to think before answering</li>
              <li>Use specific examples when possible</li>
            </ul>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ChatComponent;
