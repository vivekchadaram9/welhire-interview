import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography } from '@mui/material';
interface VideoComponentProps {
  startRecording: boolean;
  stopInterview: () => void;
}

const VideoComponent= ({startRecording,stopInterview}: VideoComponentProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(startRecording);
  const [downloadUrl, setDownloadUrl] = useState('');

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
  }, []);

  const startScreenRecording = async () => {
    try {
      const vidStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const combinedStream = new MediaStream([
        ...vidStream.getAudioTracks(),
        ...vidStream.getVideoTracks(),
      ]);
      const recorder = new MediaRecorder(combinedStream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        vidStream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setDownloadUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error('recording failed:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className='relative rounded-lg bg-black'>
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className='rounded-lg '
        width={'100%'}
        height={'100%'}
      />

      {/* Timer */}
      <div className='absolute top-4 left-4 text-sm text-black bg-white/80 px-2 py-1 rounded'>
        00:10
      </div>

      {/* Recording Label */}
     {recording && <div className='absolute top-4 right-4 bg-white px-4 py-1 text-sm text-red-600 rounded-full shadow-md'>
        Recording
      </div>}

      {/* Candidate Info */}
      <div className='absolute bottom-4 left-4 bg-black/70 text-white text-sm px-4 py-2 rounded-md shadow-md'>
        vivek chadaram
      </div>

      {/* Controls */}
      <div className='absolute bottom-5 left-5 flex flex-col md:flex-row gap-4'>
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
          onClick={stopRecording}
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
