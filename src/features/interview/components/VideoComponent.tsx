import React from 'react';
import Timer, { type TimerHandle } from '../../../components/Timer';
import { CircleDot, TimerIcon } from 'lucide-react';
import CurrentQuestion, { type CurrentQuestionProps } from './CurrentQuestion';
interface VideoComponentProps extends CurrentQuestionProps {
  recording: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  timerRef: React.RefObject<TimerHandle | null>;
}

const VideoComponent = ({
  recording,
  videoRef,
  timerRef,
  questionObject,
  nextDisabled,
  onClickNext,
}: VideoComponentProps) => {
  return (
    <div className='flex flex-1 flex-col'>
      <CurrentQuestion
        questionObject={questionObject}
        nextDisabled={nextDisabled}
        onClickNext={onClickNext}
      />
      <div className='relative rounded w-[70%]'>
        {/* Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className='rounded object-cover w-full h-full aspect-video'
        />
        {recording && (
          <div className='absolute top-4 flex flex-1 justify-between  text-sm w-full px-2'>
            {/* Timer */}
            <div className='rounded flex flex-row items-center px-2 py-1'>
              <TimerIcon size={15} />
              <p className='ml-2 mt-0.5'>
                <Timer ref={timerRef} start={recording} />
              </p>
            </div>

            {/* Recording Label */}
            <div className='text-red-600 rounded-full shadow-md flex items-center bg-white px-2 py-1'>
              <CircleDot size={12} />
              <p className='ml-2'>Recording</p>
            </div>
          </div>
        )}

        {/* Candidate Info */}
        <div className='absolute bottom-4 left-4 bg-black/70 text-white text-sm px-4 py-2 rounded-md shadow-md'>
          vivek chadaram
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
