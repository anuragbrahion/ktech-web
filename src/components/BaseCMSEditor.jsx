import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RichTextEditor } from './RichTextEditor';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiUrl } from '../utils/axiosProvider';
 
const BaseCMSEditor = ({
  pageTitle,
  pageDescription,
  apiConfig,
  defaultFormData,
  bannerFieldName
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ fetch: false, submit: false });
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
   const getData = useSelector(state => state.website?.[apiConfig.getDataKey]);
  const postData = useSelector(state => state.website?.[apiConfig.postDataKey]);

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    if (getData && getData.success) {
      const apiData = getData.data;
      
      setFormData(prev => ({
        text: apiData.text || prev.text,
        [bannerFieldName]: {
          heading: apiData[bannerFieldName]?.heading || prev[bannerFieldName].heading,
          subHeading: apiData[bannerFieldName]?.subHeading || prev[bannerFieldName].subHeading,
          bgColor: apiData[bannerFieldName]?.bgColor || prev[bannerFieldName].bgColor,
          textColor: apiData[bannerFieldName]?.textColor || prev[bannerFieldName].textColor,
          bannerLogo: apiData[bannerFieldName]?.bannerLogo || []
        }
      }));
    }
  }, [getData]);

  useEffect(() => {
    if (postData) {
      if (postData.success) {
        toast.success('Content updated successfully!');
        fetchPageData();
      } else {
        toast.error(postData.message || 'Failed to update content');
      }
      setLoading(prev => ({ ...prev, submit: false }));
    }
  }, [postData]);

  const fetchPageData = () => {
    setLoading(prev => ({ ...prev, fetch: true }));
    dispatch(apiConfig.getAction()).then((action) => {
      if (action.error) {
        toast.error('Failed to fetch data');
      }
      setLoading(prev => ({ ...prev, fetch: false }));
    });
  };

  const handleBannerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [bannerFieldName]: {
        ...prev[bannerFieldName],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (file) => {
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
      
      if (response.data && response.data.data && response.data.data.length > 0) {
         setFormData(prev => ({
          ...prev,
          [bannerFieldName]: {
            ...prev[bannerFieldName],
            bannerLogo: response.data.data
          }
        }));
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      [bannerFieldName]: {
        ...prev[bannerFieldName],
        bannerLogo: []
      }
    }));
  };

  const handleUpdate = () => {
    const formDataToSend = new FormData();
    
    formDataToSend.append('text', formData.text);
    formDataToSend.append(`${bannerFieldName}[heading]`, formData[bannerFieldName].heading);
    formDataToSend.append(`${bannerFieldName}[subHeading]`, formData[bannerFieldName].subHeading);
    formDataToSend.append(`${bannerFieldName}[bgColor]`, formData[bannerFieldName].bgColor);
    formDataToSend.append(`${bannerFieldName}[textColor]`, formData[bannerFieldName].textColor);

    if (formData[bannerFieldName].bannerLogo && formData[bannerFieldName].bannerLogo.length > 0) {
      formData[bannerFieldName].bannerLogo.forEach((logo, index) => {
        if (logo.url && !logo.file) {
          formDataToSend.append(`${bannerFieldName}[bannerLogo][${index}][url]`, logo.url);
          formDataToSend.append(`${bannerFieldName}[bannerLogo][${index}][filename]`, logo.filename || '');
          formDataToSend.append(`${bannerFieldName}[bannerLogo][${index}][path]`, logo.path || '');
          formDataToSend.append(`${bannerFieldName}[bannerLogo][${index}][mimetype]`, logo.mimetype || '');
        }
      });
    }

    setLoading(prev => ({ ...prev, submit: true }));
    dispatch(apiConfig.postAction(formDataToSend));
  };

  const ColorPicker = ({ label, value, onChange, field }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
          style={{ backgroundColor: value }}
        ></div>
        <div className="flex-1">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  const ImageUploader = () => {
    const bannerLogo = formData[bannerFieldName].bannerLogo;
    const hasImage = bannerLogo && bannerLogo.length > 0;

    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Banner Logo
        </label>
        
        {hasImage ? (
          <div className="relative">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={bannerLogo[0].url} 
                  alt="Banner logo" 
                  className="w-32 h-32 object-contain rounded-lg border"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {bannerLogo[0].filename || 'Uploaded Image'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {(bannerLogo[0].size / 1024).toFixed(1)} KB
                  </div>
                  <div className="text-sm text-blue-600 mt-2 truncate">
                    {bannerLogo[0].url}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])} 
              className="hidden" 
              id="banner-logo-upload" 
            />
            <label htmlFor="banner-logo-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Click to upload banner logo</div>
                <div className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</div>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Files
              </button>
            </label>
          </div>
        )}
        
        {uploading && (
          <div className="text-sm text-blue-600 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Uploading image...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 mt-2">{pageDescription}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={fetchPageData}
                disabled={loading.fetch}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                {loading.fetch ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></span>
                    Refreshing...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading.submit || uploading}
                className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                {loading.submit ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Updating...
                  </>
                ) : (
                  'Update Content'
                )}
              </button>
            </div>
          </div>

          {loading.fetch ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Main Text Content
                </label>
                <RichTextEditor
                  content={formData.text}
                  onChange={(content) => setFormData(prev => ({ ...prev, text: content }))}
                  placeholder="Enter main text content..."
                  minHeight="120px"
                  toolbarConfig="full"
                  allowImageUpload={true}
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Banner Heading
                </label>
                <RichTextEditor
                  content={formData[bannerFieldName].heading}
                  onChange={(content) => handleBannerChange('heading', content)}
                  placeholder="Write banner heading here..."
                  minHeight="60px"
                  toolbarConfig="basic"
                  allowImageUpload={true}
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Banner Sub Heading
                </label>
                <RichTextEditor
                  content={formData[bannerFieldName].subHeading}
                  onChange={(content) => handleBannerChange('subHeading', content)}
                  placeholder="Write banner sub heading here..."
                  minHeight="60px"
                  toolbarConfig="basic"
                  allowImageUpload={true}
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Background Color"
                    value={formData[bannerFieldName].bgColor}
                    onChange={handleBannerChange}
                    field="bgColor"
                  />
                  <ColorPicker
                    label="Text Color"
                    value={formData[bannerFieldName].textColor}
                    onChange={handleBannerChange}
                    field="textColor"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <ImageUploader />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseCMSEditor;