import { Plus } from 'lucide-react';

type SecoundaryButtonProps = {
  content: string;
  onClick?: () => void;
  addPlus?: boolean;
};

const SecoundaryButton = ({
  content,
  addPlus,
  onClick,
}: SecoundaryButtonProps) => {
  return (
    <button onClick={onClick} className='flex items-center cursor-pointer gap-1 bg-[#171A20] hover:bg-[#393C41] text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all'>
      {addPlus && <Plus className='w-4 h-4' />} {content}
    </button>
  );
};

export default SecoundaryButton;
