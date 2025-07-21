import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimerHandle } from '../../components/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { exitInterviewModalStatus } from './reducer/interviewSlice';
import { useSpeechServices } from '../../hooks/useSpeechServices';
import { updateAnswer, updateQuestion } from './reducer/questionSlice';
import { getNextQuestion, uploadAudioBlobs, uploadImageFile, uploadVideoBlobs } from './services/services';
import { chunksSize } from '../../utils/constants';
import { logout } from '../auth/reducer/authSlice';

function InterviewFunc() {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const hasSentRef = useRef<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const timerRef = useRef<TimerHandle>(null);
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  const [questionOver, setQuestionOver] = useState<boolean>(false);
  const [chatList, updateChatList] = useState<any[]>([]);
  const [audioTimeStamps, setAudioTimeStamps] = useState<any[]>([]);
  const [activeAudioBlob,setActiveAudioBlob] = useState<Blob>()
  const [chunkCounter, setChunkCounter] = useState<number>(0);
  const isAlreadySpeaking = useRef<boolean>(false);
  const startSpeakingTimestamp = useRef<Date>(null);
  const dispatch = useDispatch();
  const showExitInterviewModal = useSelector(
    (state: any) => state.interview.showExitInterviewModal
  );
  const { currentQuestion, currentAnswer } = useSelector(
    (state: any) => state.question
  );

  const {
    interimTranscript,
    transcript,
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    speak,
    clearError,
    clearTranscript,
  } = useSpeechServices();
  const onSuccess = (res: object) => {
    console.log(res, 'res');
  };
  const onFailure = (error: Error) => {
    console.error(error, 'err');
  };
  useEffect(() => {
    console.log(isSpeaking, 'isSpeaking');
    console.log(isListening, 'isListening');
    console.log(transcript, 'transcript');
    console.log(interimTranscript, 'interimTranscript');

    if ((transcript || interimTranscript) && !isAlreadySpeaking.current) {
      startSpeakingTimestamp.current = new Date();
      isAlreadySpeaking.current = true;
    }
  }, [transcript]);

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

  useEffect(() => {}, [showExitInterviewModal]);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
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

  useEffect(() => {
    if (
      currentQuestion &&
      currentQuestion?.number > 0 &&
      currentQuestion?.number < 999
    ) {
      speak(
        currentQuestion.question,
        undefined,
        (audioBlob, audioUrl) => {
          setActiveAudioBlob(audioBlob)
        }
      )
    }
  }, [currentQuestion.number]);

  const takeScreenshot = (screenshotIndex: number) => {
    console.log(`Taking screenshot ${screenshotIndex}`);

    const element = document.getElementById('#video') as HTMLVideoElement | null;

    if (!element) {
      console.error('Video element not found');
      return;
    }

    // Wait for video to be ready
    if (element.readyState < 2) {
      console.warn('Video not ready for screenshot');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Use actual video dimensions or fallback
    canvas.width = element.videoWidth || element.clientWidth || 640;
    canvas.height = element.videoHeight || element.clientHeight || 480;

    try {
      ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob: Blob | null) => {
          if (!blob) {
            console.error('Failed to create screenshot blob');
            return;
          }

          const formData = new FormData();
          formData.append('snapshotImage', blob);
          formData.append('emailId', 'joe@gmail.com');
          formData.append('interviewSessionId', 'session-67');
          formData.append('candidateId', 'CANDIDATE-898');
          formData.append('chunkIndex', screenshotIndex.toString());

          console.log(`Uploading screenshot ${screenshotIndex}`);
          uploadImageFile(formData, onSuccess, onFailure);
        },
        'image/jpeg',
        0.8
      );
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };


  

  const uploadVideoChunks = async (
    blobList: any,
    counter: number,
    isLastChunk: boolean = false
  ) => {
    const combinedBlob = new Blob(blobList, { type: 'video/webm' });
    // const url = URL.createObjectURL(combinedBlob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'recording.webm';
    // a.click();
    const formData = new FormData();
    formData.append('chunkIndex', counter.toString());
    formData.append('videoFile', combinedBlob);
    formData.append('emailId', 'joe@gmail.com');
    formData.append('interviewSessionId', 'session-67');
    formData.append('candidateId', 'CANDIDATE-898');
    if (isLastChunk) {
      formData.append('isLastChunk', 'true');
    }
    console.log('this api is calling', formData, counter);
    uploadVideoBlobs(formData, onSuccess, onFailure);
  };

  const uploadAudioChunks = async (
    blob: any,
    counter: number,
    isLastChunk: boolean = false
  ) => {
    const formData = new FormData();
    formData.append('chunkIndex', counter.toString());
    formData.append('audioFile', blob);
    formData.append('emailId', 'joe@gmail.com');
    formData.append('interviewSessionId', 'session-67');
    formData.append('candidateId', 'CANDIDATE-898');
    formData.append('timeStamps', JSON.stringify([...audioTimeStamps, getElapsedTime()]));
    if (isLastChunk) {
      formData.append('isLastChunk', 'true');
    }
    console.log('audio api is calling', formData, counter);
    uploadAudioBlobs(formData, onSuccess, onFailure);
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    try {
      const vidStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: true,
      });
      const combinedStream = new MediaStream([
        ...vidStream.getAudioTracks(),
        ...vidStream.getVideoTracks(),
      ]);
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000,
      };
      const recorder = new MediaRecorder(combinedStream, options);
      recorder.start(1000);
      let chunks: Blob[] = [];
      let videoChunkCounter = 0;
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          if (chunks.length >= chunksSize) {
            takeScreenshot(videoChunkCounter)
            setChunkCounter((prev) => prev + 1);
            uploadVideoChunks(chunks, ++videoChunkCounter);
            chunks = [];
          }
        }
      };
      recorder.onstop = () => {
        vidStream.getTracks().forEach((t) => t.stop());
        uploadVideoChunks(chunks, ++videoChunkCounter, true);
      };
      mediaRecorderRef.current = recorder;
      setRecording(true);
     
      const questionData = await getNextQuestion(null);
      console.log('  ->>>> ', questionData);
      dispatch(updateQuestion(questionData));
      if (questionData.data.number == '999') {
        setNextDisabled(true);
      } else {
        setNextDisabled(false);
        updateChatList((prev) => [
          ...prev,
          {
            id: questionData.data.id,
            message: questionData.data.question,
            timestamp: getCurrentTimestamp(new Date()),
            isBot: true,
          },
        ]);
      }
    } catch (err) {
      console.error('recording failed:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    stopListening();
  };

  const getElapsedTime = () => {
    let seconds = 0
    if (timerRef.current) {
      seconds = timerRef.current.getElapsedSeconds();
    }
    return seconds
  };

  const getCurrentTimestamp = (date: Date) => {
    const now = new Date(date);
    const hours: number = now.getHours();
    const minutes: number = now.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const questionObject = {
    currentQuestion: '1',
    question:
      "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    totalQuestions: '08',
  };

  const onClickNext = async () => {
    setNextDisabled(true);
    const questionData = await getNextQuestion({
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: currentAnswer,
    });
    console.log(questionData.data);

    dispatch(updateQuestion(questionData));
    if (questionData.data.number == '999') {
      setNextDisabled(true);
      setQuestionOver(true);
      updateChatList((prev) => [
        ...prev,
        {
          id:
            startSpeakingTimestamp.current?.toISOString() ||
            new Date().toISOString(),
          message: transcript || interimTranscript,
          timestamp: getCurrentTimestamp(
            new Date(startSpeakingTimestamp.current || new Date())
          ),
          isBot: false,
        },
      ]);
    } else {
      setNextDisabled(false);

      updateChatList((prev) => [
        ...prev,
        {
          id:
            startSpeakingTimestamp.current?.toISOString() ||
            new Date().toISOString(),
          message: transcript || interimTranscript,
          timestamp: getCurrentTimestamp(
            new Date(startSpeakingTimestamp.current || new Date())
          ),
          isBot: false,
        },
        {
          id: questionData.data.id,
          message: questionData.data.question,
          timestamp: getCurrentTimestamp(new Date()),
          isBot: true,
        },
      ]);
    }
    isAlreadySpeaking.current = false;
    clearTranscript();
  };

  const handleInterviewStopping = () => {
    dispatch(exitInterviewModalStatus(false));
    stopRecording();
    dispatch(logout())
    //navigate to feedback screen
  };


  useEffect(() => {
    if (!isSpeaking && recording) {
      startListening('en-US');
      setAudioTimeStamps((prev)=>[...prev,getElapsedTime()]);
      uploadAudioChunks(activeAudioBlob,currentQuestion?.number,currentQuestion?.number === 999)
    }else{
      stopListening()
      setAudioTimeStamps([getElapsedTime()])
    }

  }, [isSpeaking]);

  const updateCurrentAnswer = (answer: string): void => {
    dispatch(updateAnswer(answer));
  };

  return {
    interviewStarted,
    stopRecording,
    recording,
    videoRef,
    startInterview,
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
    interimTranscript,
    currentQuestion,
    currentAnswer,
    isListening,
    isSpeaking,
    questionOver,
    speak,
    clearTranscript,
    updateCurrentAnswer,
    chatList,
  };
}

export default InterviewFunc;
