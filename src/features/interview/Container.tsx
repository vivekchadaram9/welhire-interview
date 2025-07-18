import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TimerHandle } from '../../components/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { exitInterviewModalStatus } from './reducer/interviewSlice';
import { useSpeechServices } from '../../hooks/useSpeechServices';

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
  const dispatch = useDispatch()  
  const  showExitInterviewModal  = useSelector((state: any)=>state.interview.showExitInterviewModal)
  const {transcript,
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    speak,
    clearError} = useSpeechServices()

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

  }, [showExitInterviewModal]);

useEffect(() => {
  const getPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
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

// const  createScreenShot =(element:any)=> {
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   canvas.width = element.videoWidth;
//   canvas.height = element.videoHeight;
//   ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
//   canvas.toBlob((blob) => {
//     // api to send screenshots
//   }, 'image/jpeg');
// }

// const uploadChunk = async () => {
//   const combinedBlob = new Blob(blobList, { type: 'video/webm' });
//   // const url = URL.createObjectURL(combinedBlob);
//   // const a = document.createElement("a");
//   // a.href = url;
//   // a.download = "recording.webm";
//   // a.click();
//   const formData = new FormData();
//   formData.append('csrfmiddlewaretoken', csrfToken);
//   formData.append('chunk', combinedBlob);
//   formData.append('chunkIndex', chunkCounter++);
//   formData.append('fileName', 'interviewRecording.webm');

//   try {
//     const response = await fetch('/user/api/save_video_blob/', {
//       method: 'POST',
//       headers: {
//         Authorization: `Token ${accessToken}`,
//       },
//       body: formData,
//     });

//     if (response.ok) {
//       //do nothing
//       sendData(email, `video chunk uploaded ${chunkCounter}`);
//     } else {
//       throw new Error('Network response was not ok');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     sendData(`email : ${email},ERROR: ${error}`, 'Error in video sending');
//   }
// };

const startInterview = async () => {
  setInterviewStarted(true)
  try {
    const vidStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: true,
    });
    const combinedStream = new MediaStream([
      ...vidStream.getAudioTracks(),
      ...vidStream.getVideoTracks(),
    ]);
    const recorder = new MediaRecorder(combinedStream);
    recorder.start(1000)
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) chunks.push(e.data);

    };
    recorder.onstop = () => {
      vidStream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: 'video/webm' });
      setDownloadUrl(URL.createObjectURL(blob));
    };
    mediaRecorderRef.current = recorder;
    setRecording(true);
    speak("this is going to be the chitti's first question", undefined, (audioBlob, audioUrl) => {
      console.log("Got audio blob:", audioBlob);
      console.log("Audio URL:", audioUrl);
    });
    // stopListening : () => startListening('en-US')
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

 const handleInterviewStopping = () => {
   dispatch(exitInterviewModalStatus(false));
   stopRecording()
   //navigate to feedback screen
 };

 useEffect(() => {
  if(!isSpeaking){
    startListening('en-US')
  }
   
 }, [isSpeaking])
 

 return {
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
   showExitInterviewModal,
   dispatch,
   exitInterviewModalStatus,
   handleInterviewStopping,
   transcript,
 };
}

export default InterviewFunc