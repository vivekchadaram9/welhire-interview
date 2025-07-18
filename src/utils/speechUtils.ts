import { SPEECH_CONFIG } from './../../speechRecognition';
// utils/speechToText.ts
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

interface SpeechToTextOptions {
  language?: string;
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  onStatusChange?: (isListening: boolean) => void;
}

class SpeechToTextManager {
  private recognizer: sdk.SpeechRecognizer | null = null;
  private isListening = false;

  start(options: SpeechToTextOptions): void {
    const {
      language = 'en-US',
      onTranscript,
      onError,
      onStatusChange
    } = options;

    if (this.isListening) {
      console.warn('Speech recognition is already running');
      return;
    }

    try {
      // Create speech config
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        SPEECH_CONFIG.subscriptionKey,
        SPEECH_CONFIG.region
      );
      speechConfig.speechRecognitionLanguage = language;

      // Create audio config from microphone
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

      // Create recognizer
      this.recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      // Set up event handlers
      this.recognizer.recognizing = (sender, e) => {
        // Interim results (partial transcription)
        if (e.result.text) {
          onTranscript(e.result.text);
        }
      };

      this.recognizer.recognized = (sender, e) => {
        // Final results
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech && e.result.text) {
          onTranscript(e.result.text);
        }
      };

      this.recognizer.canceled = (sender, e) => {
        if (e.reason === sdk.CancellationReason.Error) {
          onError(`Recognition error: ${e.errorDetails}`);
        }
        this.isListening = false;
        onStatusChange?.(false);
      };

      this.recognizer.sessionStopped = (sender, e) => {
        this.isListening = false;
        onStatusChange?.(false);
      };

      // Start continuous recognition
      this.recognizer.startContinuousRecognitionAsync(
        () => {
          this.isListening = true;
          onStatusChange?.(true);
          console.log('Speech recognition started');
        },
        (error) => {
          onError(`Failed to start recognition: ${error}`);
          this.isListening = false;
          onStatusChange?.(false);
        }
      );

    } catch (error) {
      onError(`Speech recognition setup failed: ${error}`);
    }
  }

  stop(): void {
    if (this.recognizer && this.isListening) {
      this.recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log('Speech recognition stopped');
          this.recognizer?.close();
          this.recognizer = null;
          this.isListening = false;
        },
        (error) => {
          console.error('Error stopping recognition:', error);
        }
      );
    }
  }

  getStatus(): boolean {
    return this.isListening;
  }
}

// Export singleton instance
export const speechToText = new SpeechToTextManager();

// Export the main function
export const startContinuousSpeechToText = (
  onTranscript: (transcript: string) => void,
  onError: (error: string) => void,
  language: string = 'en-US',
  onStatusChange?: (isListening: boolean) => void
): void => {
  speechToText.start({
    language,
    onTranscript,
    onError,
    onStatusChange
  });
};

export const stopContinuousSpeechToText = (): void => {
  speechToText.stop();
};

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
    onError
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create speech config
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        SPEECH_CONFIG.subscriptionKey,
        SPEECH_CONFIG.region
      );
      speechConfig.speechSynthesisVoiceName = voice;
      speechConfig.speechSynthesisLanguage = language;

      // Create synthesizer
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

      // Create SSML if rate or pitch is different from default
      let speechText = text;
      if (rate !== 1.0 || pitch !== 1.0) {
        const rateStr = rate !== 1.0 ? `${rate * 100}%` : '100%';
        const pitchStr = pitch !== 1.0 ? `${pitch > 1 ? '+' : ''}${(pitch - 1) * 50}%` : '0%';
        
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

      // Choose synthesis method
      const synthesizeMethod = (rate !== 1.0 || pitch !== 1.0) ? 
        synthesizer.speakSsmlAsync : synthesizer.speakTextAsync;

      synthesizeMethod.call(synthesizer, speechText,
        (result: sdk.SpeechSynthesisResult) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            // Convert audio data to blob
            const audioData = result.audioData;
            const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create audio element
            const audio = new Audio(audioUrl);
            
            // Set up audio event handlers
            audio.onloadstart = () => onStart?.();
            audio.onended = () => {
              onEnd?.();
              URL.revokeObjectURL(audioUrl);
            };
            audio.onerror = () => {
              const errorMsg = 'Audio playback failed';
              onError?.(errorMsg);
              URL.revokeObjectURL(audioUrl);
            };

            const ttsResult: TextToSpeechResult = {
              audioUrl,
              audioBlob,
              play: async () => {
                // Stop any currently playing audio
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
              }
            };

            resolve(ttsResult);
          } else {
            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
          }
          synthesizer.close();
        },
        (error: string) => {
          synthesizer.close();
          reject(new Error(`Speech synthesis error: ${error}`));
        }
      );

    } catch (error) {
      reject(new Error(`Text-to-speech setup failed: ${error}`));
    }
  });
};

// Simple wrapper function for immediate playback
export const speakText = async (
  text: string,
  voice: string = 'en-US-JennyNeural',
  language: string = 'en-US'
): Promise<void> => {
  try {
    const result = await textToSpeech(text, { voice, language });
    await result.play();
  } catch (error) {
    console.error('Speech synthesis failed:', error);
    throw error;
  }
};
