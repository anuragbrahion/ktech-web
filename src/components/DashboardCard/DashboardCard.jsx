const Card = ({ title, iconSrc, content, number, editableCompleted }) => {
  return (
    <div className="w-full">
      <div className="bg-white/70 border hover:bg-[#FDE5CF] transition-colors duration-300 border-white rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center">
          <span className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center bg-white">
            <img src={iconSrc} alt="Icon" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </span>
         
        </div>
        <div className="flex justify-between">
           <p className="text-sm sm:text-base md:text-lg font-bold text-[#0F172ACC]/80 pt-3">
          {title} 
        </p>
         <span className="text-2xl font-bold mt-2">{content}</span>

        </div>
       
        
{/* 
        <p className="text-xs sm:text-sm text-[#637381] mt-1">
          <span className="text-sm text-[#454F5B] pe-2">
            {content}
          </span>
          {editableCompleted || 'Completed'}
        </p> */}
      </div>
    </div>
  );
};

export default Card;
