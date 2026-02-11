import React from 'react';
import { Book, Award, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const stats = [
    { label: "ENROLLED COURSES", icon: Book, value: 4, color: "from-blue-500 to-cyan-400" },
    { label: "UPCOMING EXAMS", icon: Award, value: 3, color: "from-amber-500 to-orange-400" },
    { label: "ATTENDANCE %", icon: CheckCircle, value: "92%", color: "from-green-500 to-emerald-400" },
    { label: "COMPLETED ASSIGNMENTS", icon: TrendingUp, value: 24, color: "from-purple-500 to-pink-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome to Student Portal</h1>
        <p className="text-emerald-100">Track your learning progress and upcoming activities</p>
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

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Mathematics Assignment Submitted</h3>
              <p className="text-sm text-gray-500">Yesterday, 4:30 PM</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Submitted
            </span>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Physics Quiz - Score: 85%</h3>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;