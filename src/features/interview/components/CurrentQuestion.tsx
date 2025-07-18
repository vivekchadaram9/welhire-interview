import {
  Box,
  Divider,
} from '@mui/material';
import Button from '../../../components/Button';
import { ChevronRight } from 'lucide-react';

interface QuestionObjectProps {
  currentQuestion: string;
  question: string;
  totalQuestions: string;
}

export interface CurrentQuestionProps {
  questionObject: QuestionObjectProps;
  nextDisabled: boolean;
  onClickNext: () => void;
}

const CurrentQuestion = ({
  questionObject,
  nextDisabled,
  onClickNext,
}: CurrentQuestionProps) => {
  return (
    <div className='flex flex-row items-cenmter'>
      <div className='flex flex-col justify-center'>
        <p className='font-bold text-4xl'>Q{questionObject?.currentQuestion}</p>
        <div className='flex flex-row items-center'>
          <p className='text-lg'>/</p>
          <p>{questionObject?.totalQuestions}</p>
        </div>
      </div>
      <Divider orientation='vertical' flexItem className='mx-2' style={{marginX:10}} />
      <p className="grow-1">{questionObject.question}</p>
      <Button
        onClick={onClickNext}
        label={
          <div className='flex flex-row items-center text-white'>
            <p className=' mr-1.5'>Next Question</p>
            <ChevronRight size={25} />
          </div>
        }
        backgroundColor={'#292F66'}
        padding='5px 30px'
        fontWeight={500}
        disabled={nextDisabled}
        borderRadius='30'
      />
    </div>
  );
};

export default CurrentQuestion;
