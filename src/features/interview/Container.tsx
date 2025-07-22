import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimerHandle } from '../../components/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { exitInterviewModalStatus } from './reducer/interviewSlice';
import { useSpeechServices } from '../../hooks/useSpeechServices';
import { updateAnswer, updateQuestion } from './reducer/questionSlice';
import {
  getNextQuestion,
  uploadAudioBlobs,
  uploadImageFile,
  uploadVideoBlobs,
} from './services/services';
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
  const [activeAudioBlob, setActiveAudioBlob] = useState<Blob>();
  const isAlreadySpeaking = useRef<boolean>(false);
  const startSpeakingTimestamp = useRef<Date>(null);
  const dispatch = useDispatch();
  const showExitInterviewModal = useSelector(
    (state: any) => state.interview.showExitInterviewModal
  );
  const { currentQuestion, currentAnswer } = useSelector(
    (state: any) => state.question
  );

  const emailId = useSelector((state:any)=>state.auth.emailId)

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
      speak(currentQuestion.question, undefined, (audioBlob, audioUrl) => {
        setActiveAudioBlob(audioBlob);
      });
    }
  }, [currentQuestion.number]);

  const takeScreenshot = (screenshotIndex: number) => {
    const element = document.getElementById(
      '#video'
    ) as HTMLVideoElement | null;

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
          formData.append('emailId', emailId);
          formData.append('interviewSessionId', 'session-67');
          formData.append('candidateId', 'CANDIDATE-898');
          formData.append('chunkIndex', screenshotIndex.toString());
          uploadImageFile(formData, onSuccess, onFailure);
        },
        'image/jpeg',
        0.8
      );
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  const validateChunk = (blob: Blob): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(blob);

      const cleanup = () => {
        URL.revokeObjectURL(url);
        video.remove();
      };

      video.addEventListener('loadedmetadata', () => {
        cleanup();
        resolve(true);
      });

      video.addEventListener('error', () => {
        cleanup();
        resolve(false);
      });

      setTimeout(() => {
        cleanup();
        resolve(false);
      }, 3000);

      video.src = url;
    });
  };

  const uploadVideoChunks = async (
    blobList: any,
    counter: number,
    isLastChunk: boolean = false
  ) => {
    const combinedBlob = new Blob(blobList, { type: 'video/webm' });
    const isValid = await validateChunk(combinedBlob)
    if(!isValid){
      console.warn(`Chunk ${counter} failed validation`)
      return 
    }
    const formData = new FormData();
    formData.append('chunkIndex', counter.toString());
    formData.append('videoFile', combinedBlob);
    formData.append('emailId', emailId);
    formData.append('interviewSessionId', 'session-67');
    formData.append('candidateId', 'CANDIDATE-898');
    formData.append('isLastChunk', isLastChunk.toString());
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
    formData.append('emailId', emailId);
    formData.append('interviewSessionId', 'session-67');
    formData.append('candidateId', 'CANDIDATE-898');
    formData.append(
      'timeStamps',
      JSON.stringify([...audioTimeStamps, getElapsedTime()])
    );
    if (isLastChunk) {
      formData.append('isLastChunk', 'true');
    }
    uploadAudioBlobs(formData, onSuccess, onFailure);
  };

  const startInterview = async () => {
    setInterviewStarted(true)
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
      let videoChunkCounter = 0;
      setRecording(true);
      const recordAndUploadChunk = async(isLastChunk = false) =>{
        return new Promise<void>((resolve, reject) => {
          const recorder = new MediaRecorder(combinedStream, options);
          const chunks: Blob[] = [];
          takeScreenshot(videoChunkCounter);
          recorder.ondataavailable = (e: BlobEvent) => {
            if (e.data.size > 0) chunks.push(e.data);
          };
          recorder.onstop = async () => {
            uploadVideoChunks(chunks,videoChunkCounter,isLastChunk)
            resolve()
            videoChunkCounter++
          };

          recorder.onerror = (event) =>
            reject(new Error(`Recording error: ${event}`)); 

          recorder.start();

          setTimeout(() => {
            if (recorder.state === 'recording') {
              recorder.stop();
            }
          }, chunksSize*1000);
        })
      }
      await recordAndUploadChunk()
      let recordingInterval: ReturnType<typeof setInterval>;
      recordingInterval = setInterval(async () => {
        try {
          await recordAndUploadChunk();
        } catch (error) {
          console.error('Chunk recording failed:', error);
        }
      }, chunksSize * 1000); 

      mediaRecorderRef.current = {
        stop: () => {
          clearInterval(recordingInterval); 
          recordAndUploadChunk(true).finally(() => {
            vidStream.getTracks().forEach((t) => t.stop());
            setRecording(false);
            console.log('Interview recording completed');
          });
        },
      } as any;

      const questionData = await getNextQuestion(null);
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
    setRecording(false);
    stopListening();
      if (
        mediaRecorderRef.current
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
  };

  const getElapsedTime = () => {
    let seconds = 0;
    if (timerRef.current) {
      seconds = timerRef.current.getElapsedSeconds();
    }
    return seconds;
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
    dispatch(logout());
    //navigate to feedback screen
  };

  useEffect(() => {
    if (!isSpeaking && recording) {
      startListening('en-US');
      setAudioTimeStamps((prev) => [...prev, getElapsedTime()]);
      uploadAudioChunks(
        activeAudioBlob,
        currentQuestion?.number,
        currentQuestion?.number === 999
      );
    } else {
      stopListening();
      setAudioTimeStamps([getElapsedTime()]);
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
