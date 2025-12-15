import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, percentage, onViewReport }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-shadow">
      <div className="flex flex-col">
        <span className="text-gray-600 text-sm font-medium mb-2">{title}</span>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
         
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center bg-green-50 text-green-600 px-2 py-1 rounded-full">
            <TrendingUp size={14} className="mr-1" />
            <span className="text-xs font-semibold">{percentage}</span>
          </div>
           <button 
            onClick={onViewReport}
            className="text-sm text-[#5041BC] underline transition-colors"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatCard