import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

interface Props {
  email: string;
  jdid: string;
  mediaRecorder: MediaRecorder;
  recordedBlobs: Blob[];
  videoElement: HTMLVideoElement | null;
  updateInterviewStatus: (email: string, jdid: string, message: string) => void;
  sendData: (email: string, message: string) => void;
  uploadVideoToServer: (blob: Blob) => void;
}

const InterviewSecurityHandler: React.FC<Props> = ({
  email,
  jdid,
  mediaRecorder,
  recordedBlobs,
  videoElement,
  updateInterviewStatus,
  sendData,
  uploadVideoToServer,
}) => {
  const changedScreen = useRef(false);
  const countScreenChanged = useRef(0);
  const countScreen = useRef(0);
  const leavingPage = useRef(false);
  const interviewCompleted = useRef(false);
  const isReload = useRef(false);

  useEffect(() => {
    const csrfToken = (
      document.querySelector(
        'input[name=csrfmiddlewaretoken]'
      ) as HTMLInputElement
    )?.value;

    const checkUserInterview = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        window.location.href = '/';
        return;
      }

      try {
        const response = await fetch('/user/check_user_interview/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify({
            csrfmiddlewaretoken: csrfToken,
            email,
            jdid,
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.Intstatus) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error checking user interview:', error);
      }
    };

    checkUserInterview();

    const handleFocus = () => {
      changedScreen.current = false;
    };

    const handleBlur = () => {
      if (!interviewCompleted.current) {
        if (countScreen.current > 4) {
          updateInterviewStatus(
            email,
            jdid,
            'This meeting will be terminated due to multiple warnings [Change Screen]'
          );
          sendData(email, 'Terminated due to change Screen');
          console.log('Terminating interview due to repeated screen change');

          Swal.fire({
            title: 'Warning!',
            text: 'This meeting will be terminated due to multiple warnings.',
            icon: 'warning',
            timer: 3000,
            showConfirmButton: true,
          }).then(() => {
            interviewCompleted.current = true;
            mediaRecorder.stop();
            mediaRecorder.onstop = () => {
              const blob = new Blob(recordedBlobs, { type: 'video/webm' });
              uploadVideoToServer(blob);
              window.speechSynthesis.cancel();
              const speech = new SpeechSynthesisUtterance(
                'Moye Moye Terminating interview session due to unacceptable activities'
              );
              window.speechSynthesis.speak(speech);
            };
            if (videoElement) {
              videoElement.srcObject = null;
            }
          });
        } else if (countScreenChanged.current > 1) {
          countScreen.current++;
          Swal.fire({
            title: 'Warning!',
            text: `This is warning ${countScreen.current}, Do not change the tab. It will result in disqualification.`,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });
          countScreenChanged.current++;
          sendData(email, `User changed chrome tab ${countScreen.current}`);
          console.log('lost focus');
        }
        countScreenChanged.current++;
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      alert(leavingPage.current.toString());
      console.log('User tried to reload or close the page');
      sendData(email, 'User tried to reload or close the page');
      leavingPage.current = true;

      // e.preventDefault();
      // e.returnValue = '';
    };

    const handleUnload = () => {
      if (leavingPage.current) {
        sendData(email, 'User tried to reload the page');
        leavingPage.current = false;
      } else {
        console.log('Page was closed');
        sendData(email, 'User tried to close the page');
      }

      // Final beacon logging
      if (!isReload.current) {
        navigator.sendBeacon(
          '/user/trigger-action/',
          JSON.stringify({ email, action: 'User closed the page' })
        );
      }
    };

    const handleLoad = () => {
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        console.log('Page was reloaded.');
        isReload.current = true;
        sendData(email, 'User reloaded the page');
      }
    };

    // Event listeners
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [
    email,
    jdid,
    mediaRecorder,
    recordedBlobs,
    updateInterviewStatus,
    sendData,
    uploadVideoToServer,
    videoElement,
  ]);

  return null;
};

export default InterviewSecurityHandler;
