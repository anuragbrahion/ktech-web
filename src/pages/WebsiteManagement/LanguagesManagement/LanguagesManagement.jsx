import React, { useState } from 'react';

export default function LanguageManagement() {
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    status: 'active'
  });

  const languages = [
    {
      id: 1,
      name: 'English',
      status: 'Active',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Gujarati',
      status: 'Active',
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      name: 'Hindi',
      status: 'Inactive',
      createdAt: '2023-03-10'
    },
    {
      id: 4,
      name: 'Spanish',
      status: 'Active',
      createdAt: '2023-04-05'
    },
    {
      id: 5,
      name: 'French',
      status: 'Pending',
      createdAt: '2023-05-18'
    }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    console.log('Filtering languages:', filters);
  };

  const handleAddLanguageClick = () => {
    setShowAddPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
    setNewLanguage({
      name: '',
      status: 'active'
    });
  };

  const handleInputChange = (field, value) => {
    setNewLanguage(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = () => {
    console.log('Adding new language:', newLanguage);
    handleClosePopup();
  };

  const handleStatusToggle = (id, currentStatus) => {
    console.log(`Toggling status for language ${id} from ${currentStatus}`);
  };

  const handleEdit = (id) => {
    console.log(`Editing language ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleting language ${id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
     case 'Active': return 'text-green-800';
      case 'Inactive': return 'text-red-800';
      case 'Pending': return 'text-yellow-800';
      default: return 'text-gray-800';
    }
  };

  const renderToggleSwitch = (language) => {
    const isActive = language.status === 'Active';
    return (
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleEdit(language.id)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
          onClick={() => handleStatusToggle(language.id, language.status)}
          className="relative"
        >
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>

        <button
          onClick={() => handleDelete(language.id)}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Language Management</h1>
          <p className="text-gray-600 mt-2">Manage application languages and their status</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category Name
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option value="">No Selected</option>
                <option value="primary">Primary Languages</option>
                <option value="secondary">Secondary Languages</option>
                <option value="regional">Regional Languages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option value="">No Selected</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Languages</h2>
            <p className="text-gray-600">{languages.length} languages configured</p>
          </div>
          <button
            onClick={handleAddLanguageClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Add Language</span>
            <span className="text-xl font-bold">+</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Language</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((language, index) => (
                  <tr 
                    key={language.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-3">
                          {language.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{language.name}</div>
                          <div className="text-sm text-gray-500">Added: {language.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(language.status)}`}>
                        {language.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {renderToggleSwitch(language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-gray-600">
              Showing 1 to {languages.length} of {languages.length} entries
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Add Language</h2>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    value={newLanguage.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter language name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    {['Active', 'Inactive', 'Pending'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleInputChange('status', status.toLowerCase())}
                        className={`px-4 py-2 rounded-lg transition-all ${newLanguage.status === status.toLowerCase() ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleClosePopup}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLanguage}
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all"
                >
                  Create Language
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}