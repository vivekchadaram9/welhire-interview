import { SPEECH_CONFIG } from './../../speechRecognition';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// --- Types ---
interface SpeechToTextOptions {
  language?: string;
  onInterim?: (interimTranscript: string) => void;
  onFinal?: (finalTranscript: string) => void;
  onError: (error: string) => void;
  onStatusChange?: (isListening: boolean) => void;
}

// --- Speech Manager ---
class SpeechToTextManager {
  private recognizer: sdk.SpeechRecognizer | null = null;
  private isListening = false;

  start(options: SpeechToTextOptions): void {
    const { language = 'en-US', onInterim, onFinal, onError, onStatusChange } =
      options;

    if (this.isListening) return;

    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        SPEECH_CONFIG.subscriptionKey,
        SPEECH_CONFIG.region
      );
      speechConfig.speechRecognitionLanguage = language;

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      this.recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      this.recognizer.recognizing = (_, e) => {
        if (e.result.text) onInterim?.(e.result.text);
      };

      this.recognizer.recognized = (_, e) => {
        if (
          e.result.reason === sdk.ResultReason.RecognizedSpeech &&
          e.result.text
        ) {
          onFinal?.(e.result.text);
        }
      };

      this.recognizer.canceled = (_, e) => {
        if (e.reason === sdk.CancellationReason.Error) {
          onError(`Recognition error: ${e.errorDetails}`);
        }
        this.isListening = false;
        onStatusChange?.(false);
      };

      this.recognizer.sessionStopped = () => {
        this.isListening = false;
        onStatusChange?.(false);
      };

      this.recognizer.startContinuousRecognitionAsync(
        () => {
          this.isListening = true;
          onStatusChange?.(true);
        },
        (err) => {
          onError(`Failed to start recognition: ${err}`);
          this.isListening = false;
          onStatusChange?.(false);
        }
      );
    } catch (err) {
      onError(`Speech recognition setup failed: ${err}`);
    }
  }

  stop(): void {
    if (this.recognizer && this.isListening) {
      this.recognizer.stopContinuousRecognitionAsync(
        () => {
          this.recognizer?.close();
          this.recognizer = null;
          this.isListening = false;
        },
        (err) => console.error('Error stopping recognition:', err)
      );
    }
  }
}

export const speechToText = new SpeechToTextManager();

export const startContinuousSpeechToText = (
  onInterim: (interimTranscript: string) => void,
  onFinal: (finalTranscript: string) => void,
  onError: (error: string) => void,
  language: string = 'en-US',
  onStatusChange?: (isListening: boolean) => void
): void => {
  speechToText.start({
    language,
    onInterim,
    onFinal,
    onError,
    onStatusChange,
  });
};

export const stopContinuousSpeechToText = (): void => {
  speechToText.stop();
};

// ----------------- TTS --------------------
interface TextToSpeechOptions {
  voice?: string;
  language?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface TextToSpeechResult {
  audioUrl: string;
  audioBlob: Blob;
  play: () => Promise<void>;
  stop: () => void;
}

let currentAudio: HTMLAudioElement | null = null;

export const textToSpeech = async (
  text: string,
  options: TextToSpeechOptions = {}
): Promise<TextToSpeechResult> => {
  const {
    voice = 'en-US-JennyNeural',
    language = 'en-US',
    rate = 1.0,
    pitch = 1.0,
    onStart,
    onEnd,
    onError,
  } = options;

  return new Promise((resolve, reject) => {
    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        SPEECH_CONFIG.subscriptionKey,
        SPEECH_CONFIG.region
      );
      speechConfig.speechSynthesisVoiceName = voice;
      speechConfig.speechSynthesisLanguage = language;
      
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

      let speechText = text;
      if (rate !== 1.0 || pitch !== 1.0) {
        const rateStr = `${rate * 100}%`;
        const pitchStr = pitch !== 1.0 ? `${(pitch - 1) * 50}%` : '0%';
        speechText = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language}">
            <voice name="${voice}">
              <prosody rate="${rateStr}" pitch="${pitchStr}">
                ${text}
              </prosody>
            </voice>
          </speak>
        `;
      }

      const speakMethod =
        rate !== 1.0 || pitch !== 1.0
          ? synthesizer.speakSsmlAsync
          : synthesizer.speakTextAsync;

      speakMethod.call(
        synthesizer,
        speechText,
        (result: sdk.SpeechSynthesisResult) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const audioData = result.audioData;
            const audioBlob = new Blob([new Uint8Array(audioData)], {
              type: 'audio/mp3',
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audio.onloadstart = () => onStart?.();
            audio.onended = () => {
              onEnd?.();
              URL.revokeObjectURL(audioUrl);
            };
            audio.onerror = () => {
              const err = 'Audio playback failed';
              onError?.(err);
              URL.revokeObjectURL(audioUrl);
            };

            const resultObj: TextToSpeechResult = {
              audioUrl,
              audioBlob,
              play: async () => {
                if (currentAudio) {
                  currentAudio.pause();
                  currentAudio.currentTime = 0;
                }
                currentAudio = audio;
                await audio.play();
              },
              stop: () => {
                if (currentAudio === audio) {
                  audio.pause();
                  audio.currentTime = 0;
                  currentAudio = null;
                }
              },
            };

            resolve(resultObj);
          } else {
            reject(new Error(result.errorDetails));
          }
          synthesizer.close();
        },
        (err) => {
          synthesizer.close();
          reject(new Error(`Speech synthesis error: ${err}`));
        }
      );
    } catch (err) {
      reject(new Error(`Text-to-speech setup failed: ${err}`));
    }
  });
};
