import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, Image as ImageIcon, FileText, Award, IdCard, Ticket, GraduationCap, DollarSign, BookOpen, Building, Type } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  getWebsiteConfigs,
  postWebsiteConfigs,
  getWebsiteConfigTemplates,
  postWebsiteConfigTemplates
} from '../../../redux/slices/website';
import { apiUrl } from '../../../utils/axiosProvider';

const ConfigDetailsForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const [companyData, setCompanyData] = useState({
    companyName: '',
    websiteName: '',
    companyPhoneNo: '',
    companyAddress: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    companyLogo: []
  });

  console.log(companyData,"companyData")

  const [templatesData, setTemplatesData] = useState({
    certificate: [],
    idcard: [],
    hallticket: [],
    admission: [],
    fees: [],
    marksheet: [],
    trainingCenter: [],
    typing: []
  });

  const websiteConfigsData = useSelector(state => state.website?.websiteConfigsGetData);
  const websiteConfigsPostData = useSelector(state => state.website?.websiteConfigsPostData);
  const websiteConfigTemplatesData = useSelector(state => state.website?.websiteConfigTemplatesGetData);
  const websiteConfigTemplatesPostData = useSelector(state => state.website?.websiteConfigTemplatesPostData);

  useEffect(() => {
    fetchCompanyData();
    fetchTemplatesData();
  }, []);

  useEffect(() => {
    if (websiteConfigsData?.data?.data) {
      const data = websiteConfigsData.data.data;
      setCompanyData({
        companyName: data.companyName || '',
        websiteName: data.websiteName || '',
        companyPhoneNo: data.companyPhoneNo || '',
        companyAddress: data.companyAddress || '',
        facebook: data.facebook || '',
        twitter: data.twitter || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        companyLogo: data.companyLogo || []
      });
    }
  }, [websiteConfigsData]);

  useEffect(() => {
    if (websiteConfigTemplatesData?.data?.data?.templates) {
      setTemplatesData(websiteConfigTemplatesData.data.data.templates);
    }
  }, [websiteConfigTemplatesData]);

  const fetchCompanyData = () => {
    setLoading(true);
    dispatch(getWebsiteConfigs()).then((action) => {
      if (action.error) {
        toast.error('Failed to fetch company data');
      }
      setLoading(false);
    });
  };

  const fetchTemplatesData = () => {
    dispatch(getWebsiteConfigTemplates());
  };

  const handleCompanyChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateChange = (templateType, value) => {
    setTemplatesData(prev => ({ ...prev, [templateType]: value }));
  };

  const handleImageUpload = async (file, type, templateType = null) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        if (type === 'companyLogo') {
          setCompanyData(prev => ({
            ...prev,
            companyLogo: [response.data.data[0]]
          }));
          toast.success('Company logo uploaded successfully');
        } else if (type === 'template' && templateType) {
          handleTemplateChange(templateType, [response.data.data]);
          toast.success(`${templateType} template uploaded successfully`);
        }
      }
    } catch (error) {
      toast.error(error||'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCompanyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file, 'companyLogo');
    }
  };

  const handleTemplateImageChange = (e, templateType) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file, 'template', templateType);
    }
  };

  const removeCompanyLogo = () => {
    setCompanyData(prev => ({ ...prev, companyLogo: [] }));
  };

  const removeTemplate = (templateType) => {
    handleTemplateChange(templateType, []);
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      companyName: companyData.companyName,
      websiteName: companyData.websiteName,
      companyPhoneNo: companyData.companyPhoneNo,
      companyAddress: companyData.companyAddress,
      facebook: companyData.facebook,
      twitter: companyData.twitter,
      instagram: companyData.instagram,
      youtube: companyData.youtube,
      companyLogo: companyData.companyLogo
    };

    dispatch(postWebsiteConfigs(payload)).then((action) => {
      if (!action.error) {
        toast.success('Company configuration updated successfully');
        fetchCompanyData();
      } else {
        toast.error(action.payload || 'Failed to update configuration');
      }
      setLoading(false);
    });
  };

  const handleTemplatesSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      templates: templatesData
    };

    dispatch(postWebsiteConfigTemplates(payload)).then((action) => {
      if (!action.error) {
        toast.success('Templates updated successfully');
        fetchTemplatesData();
      } else {
        toast.error(action.payload || 'Failed to update templates');
      }
      setLoading(false);
    });
  };

  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'templates', label: 'Templates', icon: FileText }
  ];

  const templateTypes = [
    { id: 'certificate', label: 'Certificate', icon: Award, description: 'Certificate template for student certificates' },
    { id: 'idcard', label: 'ID Card', icon: IdCard, description: 'ID card template for student identification' },
    { id: 'hallticket', label: 'Hall Ticket', icon: Ticket, description: 'Hall ticket template for examinations' },
    { id: 'admission', label: 'Admission', icon: GraduationCap, description: 'Admission form template' },
    { id: 'fees', label: 'Fees Receipt', icon: DollarSign, description: 'Fees receipt template' },
    { id: 'marksheet', label: 'Marksheet', icon: BookOpen, description: 'Marksheet template for results' },
    { id: 'trainingCenter', label: 'Training Center', icon: Building, description: 'Training center letterhead' },
    { id: 'typing', label: 'Typing', icon: Type, description: 'Typing test certificate template' }
  ];

  return (
         <div className="">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Configuration Management</h1>
            <p className="text-gray-600 mt-2">Update company information and document templates</p>
          </div>

          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {loading && !uploading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          )}

          {!loading && activeTab === 'company' && (
            <form onSubmit={handleCompanySubmit}>
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Company Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={companyData.companyName}
                        onChange={(e) => handleCompanyChange('companyName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Website Name *
                      </label>
                      <input
                        type="text"
                        value={companyData.websiteName}
                        onChange={(e) => handleCompanyChange('websiteName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        value={companyData.companyPhoneNo}
                        onChange={(e) => handleCompanyChange('companyPhoneNo', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Company Address *
                      </label>
                      <input
                        type="text"
                        value={companyData.companyAddress}
                        onChange={(e) => handleCompanyChange('companyAddress', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Links</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
                      { id: 'twitter', label: 'Twitter', color: 'bg-blue-400' },
                      { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-r from-purple-600 to-pink-500' },
                      { id: 'youtube', label: 'YouTube', color: 'bg-red-600' }
                    ].map((social) => (
                      <div key={social.id}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 ${social.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold">
                              {social.id === 'facebook' ? 'f' : 
                               social.id === 'twitter' ? '𝕏' :
                               social.id === 'instagram' ? 'IG' : 'YT'}
                            </span>
                          </div>
                          <label className="block text-sm font-semibold text-gray-800">
                            {social.label}
                          </label>
                        </div>
                        <input
                          type="text"
                          value={companyData[social.id]}
                          onChange={(e) => handleCompanyChange(social.id, e.target.value)}
                          placeholder={`Enter ${social.label} link...`}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                          disabled={uploading}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Company Logo</h2>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                      {uploading ? (
                        <div className="text-center p-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                        </div>
                      ) : companyData.companyLogo[0]?.url ? (
                        <div className="relative w-full h-full">
                          <img
                            src={companyData.companyLogo[0].url}
                            alt="Company Logo"
                            className="w-full h-full object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={removeCompanyLogo}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <div className="text-gray-500">No logo uploaded</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <label className="px-6 py-3 bg-black text-white rounded-xl cursor-pointer hover:bg-gray-800 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 mb-3 disabled:opacity-50">
                        <Upload className="w-5 h-5" />
                        {companyData.companyLogo[0]?.url ? 'Change Logo' : 'Upload Logo'}
                        <input
                          type="file"
                          onChange={handleCompanyImageChange}
                          className="hidden"
                          accept="image/*"
                          disabled={uploading}
                        />
                      </label>
                      <p className="text-sm text-gray-500">
                        Recommended: PNG or JPG format, max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="px-10 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploading || loading}
                  >
                    {uploading ? 'Uploading...' : 'Update Company Configuration'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {!loading && activeTab === 'templates' && (
            <form onSubmit={handleTemplatesSubmit}>
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Document Templates</h2>
                  <p className="text-gray-600 mb-8">Upload templates for various documents and certificates</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templateTypes.map((template) => (
                      <div key={template.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <template.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{template.label}</h3>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {uploading ? (
                            <div className="py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                            </div>
                          ) : templatesData[template.id]?.[0]?.url ? (
                            <div className="space-y-3">
                              <div className="relative">
                                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img
                                    src={templatesData[template.id][0].url}
                                    alt={template.label}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeTemplate(template.id)}
                                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleTemplateImageChange(e, template.id)}
                                className="hidden"
                                id={`${template.id}-upload`}
                                accept="image/*"
                              />
                              <label htmlFor={`${template.id}-upload`} className="block px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer text-sm">
                                Change Template
                              </label>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                onChange={(e) => handleTemplateImageChange(e, template.id)}
                                className="hidden"
                                id={`${template.id}-upload`}
                                accept="image/*"
                              />
                              <label htmlFor={`${template.id}-upload`} className="cursor-pointer block">
                                <div className="space-y-2 py-4">
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                  <p className="text-gray-500 text-sm">Click to upload template</p>
                                  <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
                                </div>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="px-10 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploading || loading}
                  >
                    {uploading ? 'Uploading...' : 'Save All Templates'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
    
  );
};

export default ConfigDetailsForm;