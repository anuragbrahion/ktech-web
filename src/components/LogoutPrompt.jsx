import React from 'react';
import { LogOut, X, Clock } from 'lucide-react';

const LogoutPrompt = ({ isOpen, onStayLoggedIn, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Session Expiring</h3>
          </div>
          <button 
            onClick={onLogout} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Your session has been inactive for a while. For your security, you'll be logged out soon.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Logout
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPrompt;