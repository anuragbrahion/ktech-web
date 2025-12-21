import React from "react";
import {
  User,
  BookOpen,
  MessageCircle,
  Store,
  Book,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "TOTAL ADMISSIONS", icon: User, color: "from-blue-600 to-blue-400" },
    { label: "TOTAL ENQUIRIES", icon: MessageCircle, color: "from-cyan-600 to-cyan-400" },
    { label: "TOTAL FRANCHISES", icon: Store, color: "from-indigo-600 to-indigo-400" },
    { label: "TOTAL COURSES", icon: Book, color: "from-sky-600 to-sky-400" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-gradient-to-r from-[#303d63] via-[#82aec2] to-[#0ea5e9] rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome to Dashboard</h1>
        <p className="text-sm md:text-lg text-blue-100">
          Here's what's happening with your institution today
        </p>
        <div className="mt-4 md:mt-6 flex items-center justify-end gap-4">
          <div className="text-right">
            <p className="text-xs md:text-sm text-blue-200">Last Updated</p>
            <p className="text-lg md:text-xl font-semibold">04:23:23 PM</p>
          </div>
          <button className="bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-xl hover:bg-white/30 transition">
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          <h2 className="text-slate-700 font-semibold uppercase text-xs md:text-sm">
            Student Details Lookup
          </h2>
        </div>
        <select className="w-full px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 text-sm md:text-base">
          <option>Select a student to view details...</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="p-2 md:p-3 rounded-xl">
          <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-[#0f172a]" />
        </div>
        <h2 className="text-x font-bold text-gray-800">
          Overview Statistics
        </h2>
      </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
  {stats.map(({ label, icon: Icon, color }, i) => (
    <div
      key={i}
      className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-3 md:p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium mb-1">
            {label}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-gray-800">
            0
          </p>
        </div>

        <div
          className={`bg-gradient-to-br ${color} p-2.5 md:p-3 rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      </div>
    </div>
  ))}
</div>       
    </div>
  );
};

export default Dashboard;