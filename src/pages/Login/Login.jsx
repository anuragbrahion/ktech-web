import React, { useState } from 'react';
import { Mail, Lock, Home, Award, BookOpen, Globe, Grid, Menu, User, LogOut, RefreshCw, MessageCircle, Store, Book } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-500 mb-6">Welcome back! Log in to your account.</p>
          
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-200"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
       <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-center gap-2">
             <img src="/logonew.png" alt='logo'/>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition">
            <RefreshCw className="w-5 h-5" />
            Switch to Website Management
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="px-6">
            <button className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg flex items-center gap-3 mb-2 hover:bg-blue-800 transition">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Dashboard</span>
            </button>

            <div className="mt-6">
              <h3 className="text-blue-900 font-bold mb-4 text-sm uppercase">COURSES</h3>
              <div className="space-y-2">
                <button className="w-full text-gray-700 py-2 px-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition">
                  <Award className="w-5 h-5" />
                  <span>Exam Grade System</span>
                </button>
                <button className="w-full text-gray-700 py-2 px-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition">
                  <BookOpen className="w-5 h-5" />
                  <span>Subjects</span>
                </button>
                <button className="w-full text-gray-700 py-2 px-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition">
                  <Globe className="w-5 h-5" />
                  <span>Languages</span>
                </button>
                <button className="w-full text-gray-700 py-2 px-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition">
                  <Grid className="w-5 h-5" />
                  <span>Course Categories</span>
                </button>
                <button className="w-full text-gray-700 py-2 px-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition">
                  <Grid className="w-5 h-5" />
                  <span>Course Award Categories</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-2">
              
             </div>
           </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-2xl p-8 mb-6 text-white">
            <h1 className="text-4xl font-bold mb-2">Welcome to Dashboard</h1>
            <p className="text-lg opacity-90">Here's what's happening with your institution today</p>
            <div className="mt-6 flex items-center justify-end gap-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Last Updated</p>
                <p className="text-xl font-semibold">04:23:23 PM</p>
              </div>
              <button className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-gray-500 font-semibold uppercase text-sm">STUDENT DETAILS LOOKUP</h2>
            </div>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-500">
              <option>Select a student to view details...</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Overview Statistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">TOTAL ADMISSIONS</p>
                  <p className="text-4xl font-bold text-gray-800">0</p>
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">TOTAL ENQUIRIES</p>
                  <p className="text-4xl font-bold text-gray-800">0</p>
                </div>
                <div className="bg-green-500 p-4 rounded-2xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">TOTAL FRANCHISES</p>
                  <p className="text-4xl font-bold text-gray-800">0</p>
                </div>
                <div className="bg-red-500 p-4 rounded-2xl">
                  <Store className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">TOTAL COURSES</p>
                  <p className="text-4xl font-bold text-gray-800">0</p>
                </div>
                <div className="bg-orange-500 p-4 rounded-2xl">
                  <Book className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;