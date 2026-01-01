import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import SourceModal from '../../components/Atoms/UI/SourceModal';

const InquirySource = () => {
  const [sources, setSources] = useState([
    { 
      id: 1, 
      name: 'Reference', 
      status: 'active',
      createdAt: '15/11/2025',
      description: 'Referrals from existing students or staff'
    },
    { 
      id: 2, 
      name: 'permplet', 
      status: 'active',
      createdAt: '12/11/2025',
      description: 'Campus placement drives'
    },
    { 
      id: 3, 
      name: 'Social media', 
      status: 'active',
      createdAt: '10/11/2025',
      description: 'Facebook, Instagram, LinkedIn, etc.'
    },
    { 
      id: 4, 
      name: 'Banner board', 
      status: 'active',
      createdAt: '08/11/2025',
      description: 'Outdoor advertising banners and boards'
    },
    { 
      id: 5, 
      name: 'Website', 
      status: 'active',
      createdAt: '05/11/2025',
      description: 'Institute website inquiries'
    },
    { 
      id: 6, 
      name: 'Newspaper', 
      status: 'inactive',
      createdAt: '01/11/2025',
      description: 'Newspaper advertisements'
    },
    { 
      id: 7, 
      name: 'TV/Radio', 
      status: 'active',
      createdAt: '28/10/2025',
      description: 'Television and radio advertisements'
    },
    { 
      id: 8, 
      name: 'Walk-in', 
      status: 'active',
      createdAt: '25/10/2025',
      description: 'Direct walk-in inquiries'
    },
    { 
      id: 9, 
      name: 'Education Fair', 
      status: 'active',
      createdAt: '22/10/2025',
      description: 'Career and education fairs'
    },
    { 
      id: 10, 
      name: 'Email Marketing', 
      status: 'active',
      createdAt: '20/10/2025',
      description: 'Email campaigns and newsletters'
    },
  ]);

  const [selectedSource, setSelectedSource] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleAddSource = () => {
    setModalMode('add');
    setSelectedSource(null);
    setShowSourceModal(true);
  };

  const handleEditSource = (source) => {
    setModalMode('edit');
    setSelectedSource(source);
    setShowSourceModal(true);
  };

  const handleSaveSource = (sourceData) => {
    if (modalMode === 'add') {
      const newSource = {
        id: sources.length + 1,
        ...sourceData,
        status: 'active',
        createdAt: new Date().toLocaleDateString('en-GB'),
        description: sourceData.description || ''
      };
      setSources([newSource, ...sources]);
    } else {
      setSources(sources.map(source => 
        source.id === selectedSource.id 
          ? { ...source, ...sourceData }
          : source
      ));
    }
    setShowSourceModal(false);
    setSelectedSource(null);
  };

  const handleToggleStatus = (sourceId) => {
    setSources(sources.map(source => 
      source.id === sourceId 
        ? { ...source, status: source.status === 'active' ? 'inactive' : 'active' }
        : source
    ));
  };

  const handleDeleteSource = (sourceId) => {
    if (window.confirm('Are you sure you want to delete this inquiry source?')) {
      setSources(sources.filter(source => source.id !== sourceId));
    }
  };

  const filteredSources = sources.filter(source => {
    const matchesSearch = 
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (source.description && source.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || source.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const tableHeaders = ['Source Name', 'Status', 'Created At', 'Description', 'Actions'];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Inquiry Source Panel</h1>
              <p className="text-black mt-2">Manage all inquiry sources and references</p>
            </div>
            <button
              onClick={handleAddSource}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Inquiry Source
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">--- no select ---</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            
            <div className="md:w-32">
              <button className="w-full px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
                Filter
              </button>
            </div>
          </div>

          <div className="mb-8">
            {/* <div className="lg:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-sky-700 mb-4">Source Categories</h3>
                <div className="space-y-2">
                  {sources.slice(0, 4).map((source, index) => (
                    <div key={source.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-black font-medium">{source.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        source.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {source.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <Table
                  headers={tableHeaders}
                  data={filteredSources}
                  renderRow={(source, index) => (
                    <tr 
                      key={source.id} 
                      className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-black">{source.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            source.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            source.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-black">{source.createdAt}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {source.description}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSource(source)}
                            className="text-sky-500 hover:text-sky-700 text-lg"
                            title="Edit Source"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleToggleStatus(source.id)}
                            className={`text-lg ${
                              source.status === 'active' 
                                ? 'text-yellow-500 hover:text-yellow-700' 
                                : 'text-green-500 hover:text-green-700'
                            }`}
                            title={source.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {source.status === 'active' ? '⏸️' : '▶️'}
                          </button>
                          <button
                            onClick={() => handleDeleteSource(source.id)}
                            className="text-red-500 hover:text-red-700 text-lg"
                            title="Delete Source"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </div>
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-12 col-span-3">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No inquiry sources found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? "No sources match your search criteria" 
                  : "No inquiry sources available. Add your first source!"}
              </p>
              <button
                onClick={handleAddSource}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Source
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredSources.length} of {sources.length} inquiry sources
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-sky-700 mb-4">Quick Notes</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">Inquiry sources help track where your leads are coming from.</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">Active sources are visible when registering new inquiries.</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">You can deactivate sources that are no longer relevant.</span>
            </div>
          </div>
        </div>
      </div>

      <SourceModal
        isOpen={showSourceModal}
        onClose={() => {
          setShowSourceModal(false);
          setSelectedSource(null);
        }}
        sourceData={selectedSource}
        mode={modalMode}
        onSubmit={handleSaveSource}
      />
    </div>
  );
};

export default InquirySource;