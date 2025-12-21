import React from "react";
import { FileText } from "lucide-react";

const WebsiteDashboard = () => {
  const stats = [
    { title: "Total Pages", value: "12", color: "bg-blue-100 text-blue-600" },
    { title: "Media Files", value: "156", color: "bg-green-100 text-green-600" },
    { title: "Active Users", value: "84", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Website Management</h1>
        <p className="text-sm md:text-lg text-emerald-100">
          Manage your website content and settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div
              className={`${stat.color} p-2 md:p-3 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3 md:mb-4`}
            >
              <FileText className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-500 text-sm md:text-base mt-1 md:mt-2">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteDashboard;