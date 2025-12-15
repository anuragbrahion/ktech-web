import React from "react";

const ServiceCard = ({ icon, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center w-36 h-44 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F5F5F5] mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-800">{title}</p>
    </div>
  );
};

export default ServiceCard;
