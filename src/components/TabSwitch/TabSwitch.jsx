import React from "react";

const TabSwitch = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="bg-[#7038C4] rounded-full p-0.5 sm:p-1 flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onChange(tab)}
          className={`flex-shrink-0 px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full sm:rounded-3xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 relative whitespace-nowrap ${
            activeTab === tab
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-white hover:bg-white/10'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSwitch;