import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';

const VideoComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    getPermissions();


    return () => recognitionRef.current?.stop();
  }, [dispatch, isListening]);

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const startScreenRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' },
        audio: true,
      });

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();

      if (screenStream.getAudioTracks().length > 0) {
        const systemSource = audioContext.createMediaStreamSource(screenStream);
        systemSource.connect(destination);
      }

      if (micStream.getAudioTracks().length > 0) {
        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(destination);
      }

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        screenStream.getTracks().forEach((t) => t.stop());
        micStream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setDownloadUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error('Screen recording failed:', err);
    }
  };

  const stopScreenRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className='relative rounded-lg overflow-hidden bg-black'>
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className='w-[60%] h-[60%] object-cover rounded-lg scale-x-[-1]'
      />

      {/* Timer */}
      <div className='absolute top-4 left-4 text-sm text-black bg-white/80 px-2 py-1 rounded'>
        00:10
      </div>

      {/* Recording Label */}
      <div className='absolute top-4 right-4 bg-white px-4 py-1 text-sm text-red-600 rounded-full shadow-md'>
        Recording
      </div>

      {/* Candidate Info */}
      <div className='absolute bottom-4 left-4 bg-black/70 text-white text-sm px-4 py-2 rounded-md shadow-md'>
        Candidate Name
      </div>

     

      {/* Controls */}
      <div className='absolute bottom-5 left-5 flex flex-col md:flex-row gap-4'>
        <Button
          variant='contained'
          color='primary'
          onClick={handleStartListening}
        >
          Start Listening
        </Button>
        <Button
          variant='contained'
          color='success'
          onClick={startScreenRecording}
          disabled={recording}
        >
          Start Recording Screen
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={stopScreenRecording}
          disabled={!recording}
        >
          Stop & Download
        </Button>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download='full_app_recording.mp4'
            className='text-blue-600 underline font-medium'
          >
            Download Recording
          </a>
        )}
      </div>
    </div>
  );
};

export default VideoComponent;
