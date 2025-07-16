import { cn } from "../utils/helpers";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

const Card : React.FC<CardProps> = ({className,children}) => {
    const updatedClass = cn('flex flex-1 bg-white border-solid border-1 rounded-[16px] border-[#E8EEF6]', className)
  return (
    <div
      className={updatedClass}
    >
      {children}
    </div>
  );
}

export default Card