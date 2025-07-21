import React from "react";
import Timer, { type TimerHandle } from "../../../components/Timer";
import { CircleDot, TimerIcon } from "lucide-react";
import CurrentQuestion, { type CurrentQuestionProps } from "./CurrentQuestion";
import { Box } from "@mui/material";
import Webcam from 'react-webcam';
interface VideoComponentProps extends CurrentQuestionProps {
  recording: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  timerRef: React.RefObject<TimerHandle | null>;
}

const VideoComponent = ({
  recording,
  videoRef,
  timerRef,
  // questionObject,
  nextDisabled,
  onClickNext,
  questionTotalCount,
  currentQuestion,
  questionOver
}: VideoComponentProps) => {
  return (
    <Box
      sx={{
        flex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1rem 0.5rem",
        position: "relative",
        minHeight: {sx:"100vh", md: "0"}
      }}
    >
      <CurrentQuestion
        // questionObject={questionObject}
        nextDisabled={nextDisabled}
        onClickNext={onClickNext}
        currentQuestion={currentQuestion}
        questionTotalCount={questionTotalCount}
        questionOver={questionOver}
      />
      {/* Video Feed */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: {sx:"100vh", md: "0"},
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="rounded object-cover aspect-video"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            flex: 1,
            position: "relative",
          }}
        />
        {/* <Webcam
          height={720}
          screenshotFormat='image/jpeg'
          width={1280}
          className='w-[83%] h-[30%] object-contain'
          videoConstraints={{
            width: 1000,
            height: 400,
            facingMode: 'user',
          }}
        /> */}
        {recording && (
          <div className="absolute top-4 flex flex-1 justify-between  text-sm w-full px-2">
            {/* Timer */}
            <div className="rounded flex flex-row items-center px-2 py-1">
              <TimerIcon size={15} />
              <p className="ml-2 mt-0.5">
                <Timer ref={timerRef} start={recording} />
              </p>
            </div>

            {/* Recording Label */}
            <div className="text-red-600 rounded-full shadow-md flex items-center bg-white px-2 py-1">
              <CircleDot size={12} />
              <p className="ml-2">Recording</p>
            </div>
          </div>
        )}

        {/* Candidate Info */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-4 py-2 rounded-md shadow-md">
          Candidate's Name
        </div>
      </Box>
    </Box>
  );
};

export default VideoComponent;