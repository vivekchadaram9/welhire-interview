import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';

export interface TimerHandle {
  getElapsedSeconds: () => number;
}

interface TimerProps {
  start: boolean;
}

const Timer = forwardRef<TimerHandle, TimerProps>(({ start }, ref) => {
  const secondsRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const [, forceRerender] = React.useReducer((x) => x + 1, 0); // To update display

  useImperativeHandle(ref, () => ({
    getElapsedSeconds: () => secondsRef.current,
  }));

  useEffect(() => {
    if (start) {
      intervalRef.current = setInterval(() => {
        secondsRef.current += 1;
        forceRerender(); // Update UI
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return <>{formatTime(secondsRef.current)}</>
});

export default Timer;
