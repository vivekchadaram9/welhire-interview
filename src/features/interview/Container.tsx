import { useState } from 'react'

function InterviewFunc() {
 const [showExitModal,setShowExitModal] = useState(false)
 const [showInterviewModal, setShowInterviewModal] = useState(true);
 return {
   showExitModal,
   setShowExitModal,
   showInterviewModal,
   setShowInterviewModal,
 };
}

export default InterviewFunc