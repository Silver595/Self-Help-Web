type PrimaryButtonProps ={
    content:string
    onClick?:()=>void;
}

const PrimaryButton = ({content,onClick}:PrimaryButtonProps) => {
  return (
    <button onClick={onClick} className='px-4 py-2 cursor-pointer bg-[#F4F4F4] hover:bg-[#EEEEEE] text-[#171A20] rounded-md text-sm font-medium transition-all shrink-0'>
      {content}
    </button>
  );
};

export default PrimaryButton;
