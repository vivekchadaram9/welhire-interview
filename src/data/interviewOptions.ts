import quickSetupImg from '../assets/images/interview/quickSetup.svg';
import smartAssistantImg from '../assets/images/interview/smartAssistant.svg';
import expertModeImg   from '../assets/images/interview/expertMode.svg';

export interface InterviewOption {
  title: string
  image: string
  time: string
  description: string
  target: string
  goal: string
  features: string[]
  route: string              
}


export const interviewOptions: InterviewOption[] = [
  {
    title: "Quick Setup",
    image: quickSetupImg,
    time: "--30 seconds",
    description: "Zero configuration - AI creates instantly",
    target: "Target: Busy recruiters",
    goal: "Goal: Instantly generate complete interview",
    features: [
      "Auto-generated from JD & CV",
      "Ready in 30 seconds",
      "Complete interview set",
    ],
    route: "quick-setup",
  },
  {
    title: "Smart Assistant",
    image: smartAssistantImg,
    time: "~2 minutes",
    description: "Semi-guided builder with basic controls",
    target: "Target: Recruiters seeking control",
    goal: "Goal: Guide AI with your preferences",
    features: [
      "Choose skill focus areas",
      "Select categories & difficulty",
      "AI guides the process",
    ],
    route: "smart-assistant",
  },
  {
    title: "Expert Mode",
    image: expertModeImg,
    time: "5+ minutes",
    description: "Advanced control over every detail",
    target: "Target: Interview specialists",
    goal: "Goal: Complete manual control",
    features: [
      "Dynamic + Pre-generated + Manual",
      "Full customization",
      "Professional templates",
    ],
    route: "expert-mode",
  },
];
