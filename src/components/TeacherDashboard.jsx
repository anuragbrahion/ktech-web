import React from 'react';
import { User, Calendar, DollarSign, Award, Book, Users } from 'lucide-react';

const TeacherDashboard = () => {
  const stats = [
    { label: "MY STUDENTS", icon: Users, value: 45, color: "from-blue-500 to-cyan-400" },
    { label: "TODAY'S CLASSES", icon: Calendar, value: 3, color: "from-green-500 to-emerald-400" },
    { label: "MY INCENTIVE", icon: DollarSign, value: "₹12,500", color: "from-amber-500 to-yellow-400" },
    { label: "PENDING EXAMS", icon: Award, value: 5, color: "from-purple-500 to-pink-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Teacher!</h1>
        <p className="text-blue-100">Here's your teaching dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Mathematics - Grade 10</h3>
                <p className="text-sm text-gray-500">10:00 AM - 11:30 AM</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Room {item}0{1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;