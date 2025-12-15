import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import StatCard from '../../components/StatCard/StatCard';




// Claims Chart Data
const claimsData = [
  { year: '2015', approved: 25, submitted: 20 },
  { year: '2016', approved: 15, submitted: 10 },
  { year: '2017', approved: 10, submitted: 8 },
  { year: '2018', approved: 45, submitted: 35 },
  { year: '2019', approved: 20, submitted: 15 },
  { year: '2020', approved: 35, submitted: 30 },
];

// Sales Team Performance Data
const salesData = [
  { month: 'Jan', value: 800 },
  { month: 'Feb', value: 900 },
  { month: 'Mar', value: 700 },
  { month: 'Apr', value: 1100 },
  { month: 'May', value: 1300 },
  { month: 'Jun', value: 1400 },
];

// Reusable Chart Card Component
const ChartCard = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      {children}
    </div>
  );
};

// Custom Tooltip for Claims Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-semibold">{payload[0].payload.year}</p>
        <p className="text-xs text-pink-300">Approved: {payload[1]?.value}</p>
        <p className="text-xs text-purple-300">Submitted: {payload[0]?.value}</p>
      </div>
    );
  }
  return null;
};

// Sales Team Card Component
const SalesTeamCard = () => {
  const teamMembers = [
    { id: 1, img: '👩‍💼', name: 'Member 1' },
    { id: 2, img: '👨‍💼', name: 'Member 2' },
    { id: 3, img: '👩‍💼', name: 'Member 3' },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg text-white">
      <div className="mb-6">
        <h3 className="text-sm font-medium opacity-90 mb-2">Sales team target</h3>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-5xl font-bold">82%</h2>
          <div className="flex items-center space-x-2">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl border-2 border-purple-500"
              >
                {member.img}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-sm font-semibold border-2 border-purple-400">
              +4
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/50 flex items-center justify-center border-2 border-purple-400">
              🔒
            </div>
          </div>
        </div>
        <span className="text-sm opacity-90">Achieved</span>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium opacity-90 mb-2">Cleared Queue</h3>
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-bold">1.4k</h2>
          <div className="flex items-center bg-purple-500/50 px-2 py-1 rounded-full">
            <span className="text-xs font-semibold">📊 +15%</span>
          </div>
        </div>
        <span className="text-xs opacity-75">No. of Bills</span>
        
        <div className="mt-4 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#FFD700" 
                strokeWidth={3}
                fill="url(#salesGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '25.1k', percentage: '+15%' },
    { title: 'Active Users Today', value: '25.1k', percentage: '+15%' },
    { title: 'Total Watch Time (Audio/Video)', value: '25.1k', percentage: '+15%' },
    { title: 'Recent Subscriptions', value: '25.1k', percentage: '+15%' },
    { title: 'Content Performance', value: '25.1k', percentage: '+15%' },
  ];

  return (
       <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              percentage={stat.percentage}
              onViewReport={() => console.log(`View report for ${stat.title}`)}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Claims Chart - Takes 2 columns on large screens */}
          <ChartCard title="Claims Over the Years" className="lg:col-span-2">
            <div className="flex items-center justify-end gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-gray-600">Submitted</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={claimsData}>
                <defs>
                  <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F9A8D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F9A8D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="submittedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="submitted" 
                  stroke="#9333EA" 
                  strokeWidth={3}
                  fill="url(#submittedGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#F9A8D4" 
                  strokeWidth={3}
                  fill="url(#approvedGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Sales Team Card */}
          <SalesTeamCard />
        </div>
      </div>
    </div>
  );
}