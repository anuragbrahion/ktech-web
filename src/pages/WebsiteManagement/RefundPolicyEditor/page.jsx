import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
 import {
  getWebsiteRefund,
  postWebsiteRefund
} from '../../../redux/slices/website';
import { toast } from 'react-toastify';
import { RichTextEditor } from '../../../components/RichTextEditor';

export default function RefundPolicyEditor() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ fetch: false, submit: false });
  const [formData, setFormData] = useState({
    text: "We focus on quality education, expert instructors, hands-on learning, and real-world outcomes. Our platform is designed to help learners succeed faster and smarter.",
    refundBanner: {
      heading: "<h1>Refund Policy</h1>",
      subHeading: "<h2>Transparent & Fair Refunds</h2>",
      bgColor: "#DC2626",
      textColor: "#FEF2F2",
      bannerLogo: []
    },
    refundPolicyPoints: [
      { id: 1, point: "30-day money-back guarantee" },
      { id: 2, point: "No questions asked refund within 7 days" },
      { id: 3, point: "Partial refunds after course completion" }
    ]
  });

  const getData = useSelector(state => state.website?.websiteRefundGetData);
  const postData = useSelector(state => state.website?.websiteRefundPostData);

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    if (getData && getData.success) {
      const apiData = getData.data;
      setFormData(prev => ({
        text: apiData.text || prev.text,
        refundBanner: {
          heading: apiData.refundBanner?.heading || prev.refundBanner.heading,
          subHeading: apiData.refundBanner?.subHeading || prev.refundBanner.subHeading,
          bgColor: apiData.refundBanner?.bgColor || prev.refundBanner.bgColor,
          textColor: apiData.refundBanner?.textColor || prev.refundBanner.textColor,
          bannerLogo: apiData.refundBanner?.bannerLogo || []
        },
        refundPolicyPoints: apiData.refundPolicyPoints || prev.refundPolicyPoints
      }));
    }
  }, [getData]);

  useEffect(() => {
    if (postData) {
      if (postData.success) {
        toast.success('Refund policy updated successfully!');
        fetchPageData();
      } else {
        toast.error(postData.message || 'Failed to update refund policy');
      }
      setLoading(prev => ({ ...prev, submit: false }));
    }
  }, [postData]);

  const fetchPageData = () => {
    setLoading(prev => ({ ...prev, fetch: true }));
    dispatch(getWebsiteRefund()).then((action) => {
      if (action.error) {
        toast.error('Failed to fetch refund policy data');
      }
      setLoading(prev => ({ ...prev, fetch: false }));
    });
  };

  const handleBannerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      refundBanner: {
        ...prev.refundBanner,
        [field]: value
      }
    }));
  };

  const handleUpdate = () => {
    const payload = {
      text: formData.text,
      refundBanner: {
        heading: formData.refundBanner.heading,
        subHeading: formData.refundBanner.subHeading,
        bgColor: formData.refundBanner.bgColor,
        textColor: formData.refundBanner.textColor
      },
      refundPolicyPoints: formData.refundPolicyPoints
    };

    const formDataToSend = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          formDataToSend.append(`${key}[${subKey}]`, subValue);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    setLoading(prev => ({ ...prev, submit: true }));
    dispatch(postWebsiteRefund(formDataToSend));
  };

  const addRefundPoint = () => {
    const newId = formData.refundPolicyPoints.length > 0 
      ? Math.max(...formData.refundPolicyPoints.map(p => p.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      refundPolicyPoints: [...prev.refundPolicyPoints, { id: newId, point: "" }]
    }));
  };

  const updateRefundPoint = (id, value) => {
    setFormData(prev => ({
      ...prev,
      refundPolicyPoints: prev.refundPolicyPoints.map(point =>
        point.id === id ? { ...point, point: value } : point
      )
    }));
  };

  const removeRefundPoint = (id) => {
    setFormData(prev => ({
      ...prev,
      refundPolicyPoints: prev.refundPolicyPoints.filter(point => point.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Refund Policy Editor</h1>
              <p className="text-gray-600 mt-2">Customize your refund policy page content</p>
            </div>
            <div className="flex items-center gap-4">
              <button
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
                onClick={handleUpdate}
                disabled={loading.submit}
                className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                {loading.submit ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Updating...
                  </>
                ) : (
                  'Update Refund Policy'
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
              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-xl border border-red-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Main Text Content
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px]"
                  placeholder="Enter refund policy main text..."
                />
              </div>

              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-xl border border-red-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Banner Heading
                </label>
                <RichTextEditor
                  content={formData.refundBanner.heading}
                  onChange={(content) => handleBannerChange('heading', content)}
                  placeholder="Write refund policy heading..."
                  minHeight="60px"
                  toolbarConfig="basic"
                />
              </div>

              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-xl border border-red-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Banner Sub Heading
                </label>
                <RichTextEditor
                  content={formData.refundBanner.subHeading}
                  onChange={(content) => handleBannerChange('subHeading', content)}
                  placeholder="Write refund policy sub heading..."
                  minHeight="60px"
                  toolbarConfig="basic"
                />
              </div>

              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-xl border border-red-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      Background Color
                    </label>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
                        style={{ backgroundColor: formData.refundBanner.bgColor }}
                      ></div>
                      <div className="flex-1">
                        <input
                          type="color"
                          value={formData.refundBanner.bgColor}
                          onChange={(e) => handleBannerChange('bgColor', e.target.value)}
                          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.refundBanner.bgColor}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      Text Color
                    </label>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
                        style={{ backgroundColor: formData.refundBanner.textColor }}
                      ></div>
                      <div className="flex-1">
                        <input
                          type="color"
                          value={formData.refundBanner.textColor}
                          onChange={(e) => handleBannerChange('textColor', e.target.value)}
                          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.refundBanner.textColor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-xl border border-red-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Refund Policy Points</h2>
                    <p className="text-gray-600">List key points of your refund policy</p>
                  </div>
                  <button
                    onClick={addRefundPoint}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                  >
                    <span>+ Add Point</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.refundPolicyPoints.map((point, index) => (
                    <div key={point.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-900">Point {index + 1}</span>
                        </div>
                        <button
                          onClick={() => removeRefundPoint(point.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <textarea
                        value={point.point}
                        onChange={(e) => updateRefundPoint(point.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Enter refund policy point..."
                        rows="2"
                      />
                    </div>
                  ))}

                  {formData.refundPolicyPoints.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <div className="text-4xl mb-4">💸</div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No refund points added yet</h3>
                      <p className="text-gray-500 mb-4">Click "Add Point" to create your first refund policy point</p>
                      <button
                        onClick={addRefundPoint}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      >
                        Add Your First Point
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}