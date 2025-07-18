import { useEffect, useMemo, useRef, useState } from 'react'
import type { TimerHandle } from '../../components/Timer';

function InterviewFunc() {
 const [showExitModal,setShowExitModal] = useState(false)
 const [interviewStarted,setInterviewStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const hasSentRef = useRef<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const timerRef = useRef<TimerHandle>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasSentRef.current) {
        console.log('User tried to reload or close the page');
        hasSentRef.current = true;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);



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
  return () => mediaRecorderRef.current?.stop();
}, []);

const startInterview = async () => {
  setInterviewStarted(true)
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
      const blob = new Blob(chunks, { type: 'video/webm' });
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

const getElapsedTime=()=>{
  if (timerRef.current) {
    const seconds = timerRef.current.getElapsedSeconds();
    alert(`Elapsed time: ${seconds} seconds`);
  }
}

const questionObject = {
  currentQuestion: '1',
  question:
    "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  totalQuestions: '08',
};
 const nextDisabled=useMemo(()=>{return false},[])
 const onClickNext=()=>{}


 return {
   showExitModal,
   setShowExitModal,
   interviewStarted,
   stopRecording,
   recording,
   videoRef,
   startInterview,
   downloadUrl,
   getElapsedTime,
   timerRef,
   questionObject,
   nextDisabled,
   onClickNext,
 };
}

export default InterviewFunc