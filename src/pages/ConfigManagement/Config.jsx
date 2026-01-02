import React, { useState } from 'react';

const Config = () => {
  const [uploads, setUploads] = useState({
    certificate: null,
    idCard: null,
    hallTicket: null,
    admission: null,
    fees: null
  });

  const [previews, setPreviews] = useState({
    certificate: null,
    idCard: null,
    hallTicket: null,
    admission: null,
    fees: null
  });

  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update uploads state
    setUploads(prev => ({
      ...prev,
      [field]: file
    }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [field]: previewUrl
    }));
  };

  const handleRemoveFile = (field) => {
    if (previews[field]) {
      URL.revokeObjectURL(previews[field]);
    }

    setUploads(prev => ({
      ...prev,
      [field]: null
    }));

    setPreviews(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploaded files:', uploads);
    alert('Files uploaded successfully!');
  };

  const handleReset = () => {
    Object.values(previews).forEach(preview => {
      if (preview) URL.revokeObjectURL(preview);
    });

    setUploads({
      certificate: null,
      idCard: null,
      hallTicket: null,
      admission: null,
      fees: null
    });

    setPreviews({
      certificate: null,
      idCard: null,
      hallTicket: null,
      admission: null,
      fees: null
    });
  };

  const uploadCards = [
    {
      id: 'certificate',
      title: 'Certificate Upload',
      description: 'Upload certificate template (PDF, DOC, or image formats)',
      icon: '📜',
      preview: previews.certificate,
      fileName: uploads.certificate?.name
    },
    {
      id: 'idCard',
      title: 'ID Card Upload',
      description: 'Upload ID card template (PDF or image formats)',
      icon: '🪪',
      preview: previews.idCard,
      fileName: uploads.idCard?.name
    },
    {
      id: 'hallTicket',
      title: 'Hall Ticket Upload',
      description: 'Upload hall ticket template (PDF or DOC formats)',
      icon: '🎫',
      preview: previews.hallTicket,
      fileName: uploads.hallTicket?.name
    },
    {
      id: 'admission',
      title: 'Admission Upload',
      description: 'Upload admission form template (PDF or DOC formats)',
      icon: '📝',
      preview: previews.admission,
      fileName: uploads.admission?.name
    },
    {
      id: 'fees',
      title: 'Fees Upload',
      description: 'Upload fees receipt template (PDF or image formats)',
      icon: '💰',
      preview: previews.fees,
      fileName: uploads.fees?.name
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Template Upload Form</h1>
        <p className="text-gray-600 mt-2">Upload and manage your document templates</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadCards.map((card) => (
              <div key={card.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{card.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* File Input */}
                  <div className="flex items-center gap-4">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(card.id, e)}
                        className="hidden"
                        id={`file-${card.id}`}
                      />
                      <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">
                        <span className="text-blue-700 font-medium">
                          {card.fileName ? card.fileName : 'Choose File'}
                        </span>
                        <span className="text-blue-500">
                          📁
                        </span>
                      </div>
                    </label>

                    {card.fileName && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(card.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        title="Remove file"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {/* Preview and Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      {card.fileName ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          No file chosen
                        </span>
                      )}
                    </div>

                    {card.preview && (
                      <a
                        href={card.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors duration-200"
                      >
                        👁️ Preview
                      </a>
                    )}
                  </div>

                  {/* File Info */}
                  {card.fileName && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">File:</span> {card.fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {(uploads[card.id]?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>↻</span>
              Reset All
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>📤</span>
              Upload All Templates
            </button>
          </div>
        </div>
      </form>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Upload Guidelines</h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start gap-2">
            <span className="mt-1">✅</span>
            <span>Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✅</span>
            <span>Maximum file size: 10MB per template</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✅</span>
            <span>Click "Preview" to view uploaded templates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✅</span>
            <span>Use the trash icon to remove any uploaded file</span>
          </li>
        </ul>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {uploadCards.map((card) => (
          <div key={card.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <span className={`w-3 h-3 rounded-full ${uploads[card.id] ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mt-2">{card.title.split(' ')[0]}</h4>
            <p className="text-xs text-gray-500">
              {uploads[card.id] ? 'Uploaded' : 'Pending'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Config;