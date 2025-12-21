import React, { useState } from 'react';

export default function BranchManagement() {
  const [filters, setFilters] = useState({
    branchName: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    city: '',
    state: '',
    address: '',
    pincode: ''
  });

  const branches = [
    {
      name: 'Downtown Branch',
      state: 'California',
      city: 'Los Angeles',
      address: '123 Main Street',
      pincode: '90001',
      status: 'Active',
      createdAt: '2023-10-15'
    },
    {
      name: 'Uptown Branch',
      state: 'New York',
      city: 'New York',
      address: '456 Park Avenue',
      pincode: '10001',
      status: 'Active',
      createdAt: '2023-09-22'
    },
    {
      name: 'Westside Branch',
      state: 'Texas',
      city: 'Houston',
      address: '789 Oak Lane',
      pincode: '77001',
      status: 'Inactive',
      createdAt: '2023-11-05'
    },
    {
      name: 'Eastside Branch',
      state: 'Florida',
      city: 'Miami',
      address: '101 Beach Blvd',
      pincode: '33101',
      status: 'Pending',
      createdAt: '2023-12-10'
    }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    console.log('Filtering with:', filters);
  };

  const handleAddBranchClick = () => {
    setShowAddPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
    setNewBranch({
      name: '',
      city: '',
      state: '',
      address: '',
      pincode: ''
    });
  };

  const handleInputChange = (field, value) => {
    setNewBranch(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBranch = () => {
    console.log('Adding new branch:', newBranch);
    handleClosePopup();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600 mt-2">Manage your branches and their details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name
              </label>
              <select
                value={filters.branchName}
                onChange={(e) => handleFilterChange('branchName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
              >
                <option value="">All Branches</option>
                <option value="branch1">Downtown Branch</option>
                <option value="branch2">Uptown Branch</option>
                <option value="branch3">Westside Branch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-all shadow-md hover:shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Branch List</h2>
            <p className="text-gray-600">{branches.length} branches found</p>
          </div>
          <button
            onClick={handleAddBranchClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Add Branch</span>
            <span className="text-xl font-bold">+</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sky-600 to-sky-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Branch Name</th>
                  <th className="px-6 py-4 text-left font-semibold">State</th>
                  <th className="px-6 py-4 text-left font-semibold">City</th>
                  <th className="px-6 py-4 text-left font-semibold">Address</th>
                  <th className="px-6 py-4 text-left font-semibold">Pincode</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{branch.name}</td>
                    <td className="px-6 py-4 text-gray-700">{branch.state}</td>
                    <td className="px-6 py-4 text-gray-700">{branch.city}</td>
                    <td className="px-6 py-4 text-gray-700">{branch.address}</td>
                    <td className="px-6 py-4 text-gray-700">{branch.pincode}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(branch.status)}`}>
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{branch.createdAt}</td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-2 bg-sky-50 text-sky-600 font-medium rounded-lg hover:bg-sky-100 transition-all">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-gray-600">
              Showing 1 to {branches.length} of {branches.length} entries
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Previous
              </button>
              <button className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-all">
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Branch</h2>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={newBranch.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter branch name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={newBranch.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={newBranch.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newBranch.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={newBranch.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter pincode"
                  />
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
                  onClick={handleAddBranch}
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all"
                >
                  Add Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}