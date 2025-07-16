import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  onResend?: () => void;
  setOtpErrorMessage?: (message: string) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 45,
  onResend,
  setOtpErrorMessage,
}) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    if (seconds <= 0) {
      setExpired(true);
      if (setOtpErrorMessage) {
        setOtpErrorMessage("Click on 'Resend' to get a new OTP.");
      }
      return;
    }

    const timerId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds, setOtpErrorMessage]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  const handleResend = () => {
    setSeconds(initialSeconds);
    setExpired(false);
    if (setOtpErrorMessage) {
      setOtpErrorMessage(''); 
    }
    if (onResend) onResend();
  };

  return (
    <div
      style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#000',
        marginTop: '10px',
        textAlign: 'center',
      }}
    >
      {!expired ? (
        <span>| {formatTime(seconds)}</span>
      ) : (
        <button
          style={{
            backgroundColor: 'transparent',
            color: '#007AFF',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0',
          }}
          onClick={handleResend}
        >
          Resend
        </button>
      )}
    </div>
  );
};

export default CountdownTimer;
