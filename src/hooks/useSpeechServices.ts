// // hooks/useSpeechServices.ts
// import { useState, useEffect, useCallback } from 'react';
// import { startContinuousSpeechToText,stopContinuousSpeechToText,
//     textToSpeech,
//     speakText } from '../utils/speechUtils';

// export const useSpeechServices = () => {
//   const [transcript, setTranscript] = useState<string>('');
//   const [isListening, setIsListening] = useState<boolean>(false);
//   const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const startListening = useCallback((language: string = 'en-US') => {
//     setError(null);
//     setTranscript('');
    
//     startContinuousSpeechToText(
//       (newTranscript: string) => setTranscript(newTranscript),
//       (errorMessage: string) => {
//         setError(errorMessage);
//         setIsListening(false);
//       },
//       language,
//       (listening: boolean) => setIsListening(listening)
//     );
//   }, []);

//   const stopListening = useCallback(() => {
//     stopContinuousSpeechToText();
//     setIsListening(false);
//   }, []);

//   const speak = useCallback(async (
//     text: string, 
//     options?: any, 
//     callback?: (audioBlob: Blob, audioUrl: string) => void
//   ) => {
//     if (!text.trim()) return;
  
//     try {
//       setIsSpeaking(true);
//       setError(null);
      
//       // Get the full result instead of just playing
//       const result = await textToSpeech(text, {
//         voice: options?.voice,
//         language: options?.language,
//         rate: options?.rate,
//         pitch: options?.pitch,
//         onEnd: () => setIsSpeaking(false),
//         onError: (error: string) => {
//           setError(error);
//           setIsSpeaking(false);
//         }
//       });
      
//       // Call the callback with audio data BEFORE playing
//       if (callback) {
//         callback(result.audioBlob, result.audioUrl);
//       }
      
//       // Then play the audio
//       await result.play();
      
//     } catch (error) {
//       setError('Speech synthesis failed');
//       setIsSpeaking(false);
//     }
//   }, []);
  

//   const clearError = useCallback(() => setError(null), []);
//   const clearTranscript = useCallback(() => setTranscript(''), []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopContinuousSpeechToText();
//     };
//   }, []);

//   return {
//     // State
//     transcript,
//     isListening,
//     isSpeaking,
//     error,
    
//     // Actions
//     startListening,
//     stopListening,
//     speak,
//     clearError,
//     clearTranscript
//   };
// };





import { useState, useEffect, useCallback } from 'react';
import {
  startContinuousSpeechToText,
  stopContinuousSpeechToText,
  textToSpeech,
} from '../utils/speechUtils';

export const useSpeechServices = () => {
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [transcript, setTranscript] = useState<string>(''); // Final
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback((language: string = 'en-US') => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    startContinuousSpeechToText(
      (interim: string) => setInterimTranscript(interim),
      (finalText: string) =>
        setTranscript((prev) => `${prev} ${finalText}`.trim()),
      (err: string) => {
        setError(err);
        setIsListening(false);
      },
      language,
      (listening) => setIsListening(listening)
    );
  }, []);

  const stopListening = useCallback(() => {
    stopContinuousSpeechToText();
    setIsListening(false);
  }, []);

  const speak = useCallback(
    async (
      text: string,
      options?: any,
      callback?: (audioBlob: Blob, audioUrl: string) => void
    ) => {
      if (!text.trim()) return;

      try {
        setIsSpeaking(true);
        setError(null);

        const result = await textToSpeech(text, {
          voice: options?.voice,
          language: options?.language,
          rate: options?.rate,
          pitch: options?.pitch,
          onEnd: () => setIsSpeaking(false),
          onError: (err: string) => {
            setError(err);
            setIsSpeaking(false);
          },
        });

        callback?.(result.audioBlob, result.audioUrl);
        await result.play();
      } catch (err) {
        setError('Speech synthesis failed');
        setIsSpeaking(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      stopContinuousSpeechToText();
    };
  }, []);

  return {
    transcript, // Final
    interimTranscript, // Interim
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    speak,
    clearError,
    clearTranscript,
  };
};
