import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  postWebsiteCourseFaq, 
  getWebsiteCourseFaq 
} from '../../../redux/slices/website';

export default function CourseFAQEditor() {
  const dispatch = useDispatch();
  const websiteCourseFaqData = useSelector(state => state.website?.getWebsiteCourseFaqData);
  const postFaqResponse = useSelector(state => state.website?.postWebsiteCourseFaqData);
  
  // Loading states
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false
  });
  
  // Initialize form data with dynamic structure
  const [formData, setFormData] = useState({
    text: "Course", // Default text field
    courseFaqBanner: {
      heading: '<h1>Course FAQ</h1>',
      subHeading: '<h2>FAQ about how to learn computer courses</h2>',
      bgColor: '#2563eb',
      textColor: '#ffffff' // Added textColor as per payload structure
    },
    courseFaq: []
  });

  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const textRef = useRef(null);

  // Fetch FAQ data on component mount
  useEffect(() => {
    fetchFaqData();
  }, []);

  // Update form data when API data is received
  useEffect(() => {
    if (websiteCourseFaqData && websiteCourseFaqData.success) {
      const apiData = websiteCourseFaqData.data;
      
      // Merge API data with default structure, preserving defaults if API data is missing
      setFormData(prev => ({
        text: apiData.text || prev.text,
        courseFaqBanner: {
          heading: apiData.courseFaqBanner?.heading || prev.courseFaqBanner.heading,
          subHeading: apiData.courseFaqBanner?.subHeading || prev.courseFaqBanner.subHeading,
          bgColor: apiData.courseFaqBanner?.bgColor || prev.courseFaqBanner.bgColor,
          textColor: apiData.courseFaqBanner?.textColor || prev.courseFaqBanner.textColor
        },
        courseFaq: apiData.courseFaq || []
      }));
    }
  }, [websiteCourseFaqData]);

  // Handle API response for POST request
  useEffect(() => {
    if (postFaqResponse) {
      if (postFaqResponse.success) {
        toast.success('FAQ updated successfully!');
        // Refresh data after successful update
        fetchFaqData();
      } else {
        toast.error(postFaqResponse.message || 'Failed to update FAQ');
      }
      setLoading(prev => ({ ...prev, submit: false }));
    }
  }, [postFaqResponse]);

  // Fetch FAQ data from API
  const fetchFaqData = () => {
    setLoading(prev => ({ ...prev, fetch: true }));
    dispatch(getWebsiteCourseFaq()).then((action) => {
      if (action.error) {
        toast.error('Failed to fetch FAQ data');
      }
      setLoading(prev => ({ ...prev, fetch: false }));
    });
  };

  const handleRichTextCommand = (command, value = null, ref) => {
    document.execCommand(command, false, value);
    if (ref.current) {
      const content = ref.current.innerHTML;
      switch (ref) {
        case headingRef:
          setFormData(prev => ({
            ...prev,
            courseFaqBanner: {
              ...prev.courseFaqBanner,
              heading: content
            }
          }));
          break;
        case subHeadingRef:
          setFormData(prev => ({
            ...prev,
            courseFaqBanner: {
              ...prev.courseFaqBanner,
              subHeading: content
            }
          }));
          break;
        case textRef:
          setFormData(prev => ({
            ...prev,
            courseFaqBanner: {
              ...prev.courseFaqBanner,
              heading: content // Assuming text editor updates the main heading
            }
          }));
          break;
      }
    }
  };

   const handleUpdate = () => {
     const payload = {
      text: formData.text,
      courseFaqBanner: {
        heading: formData.courseFaqBanner.heading,
        subHeading: formData.courseFaqBanner.subHeading,
        bgColor: formData.courseFaqBanner.bgColor,
        textColor: formData.courseFaqBanner.textColor
      },
      courseFaq: formData.courseFaq.map(faq => ({
        question: faq.question,
        answer: faq.answer
      }))
    };
    setLoading(prev => ({ ...prev, submit: true }));
    dispatch(postWebsiteCourseFaq(payload)).then((res) => {
       if(res){
         toast.success(res?.payload?.message)
      }
    }).catch((error) => {
      console.log("error", error);
      toast.error(error || "Error in Fetching Edit Data");
    });
  };

  const handleAddFAQ = () => {
    const newId = formData.courseFaq.length > 0 
      ? Math.max(...formData.courseFaq.map(f => f.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      courseFaq: [
        ...prev.courseFaq,
        { 
          id: newId, 
          question: '', 
          answer: '' 
        }
      ]
    }));
  };

  const handleDeleteFAQ = (id) => {
    setFormData(prev => ({
      ...prev,
      courseFaq: prev.courseFaq.filter(faq => faq.id !== id)
    }));
  };

  const handleFAQChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseFaq: prev.courseFaq.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    }));
  };

   const handleBannerColorChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      courseFaqBanner: {
        ...prev.courseFaqBanner,
        [field]: value
      }
    }));
  };

  const RichTextToolbar = ({ editorRef }) => (
    <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-wrap">
      <select 
        onChange={(e) => handleRichTextCommand('formatBlock', e.target.value, editorRef)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm mr-2 hover:bg-gray-50"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <button
        onClick={() => handleRichTextCommand('bold', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => handleRichTextCommand('italic', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] italic"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => handleRichTextCommand('underline', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] underline"
        title="Underline"
      >
        U
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={() => handleRichTextCommand('insertUnorderedList', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Bullet List"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        onClick={() => handleRichTextCommand('insertOrderedList', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Numbered List"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a1 1 0 000 2h10a1 1 0 100-2H5zM3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={() => handleRichTextCommand('removeFormat', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] text-sm"
        title="Clear Format"
      >
        Clear
      </button>
    </div>
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course FAQ Editor</h1>
              <p className="text-gray-600 mt-2">Manage frequently asked questions</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchFaqData}
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
                className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                {loading.submit ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Updating...
                  </>
                ) : (
                  'Update FAQ'
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
                  Text
                </label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter text (e.g., Course)"
                />
              </div>

               <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Banner Heading
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <RichTextToolbar editorRef={headingRef} />
                  <div
                    ref={headingRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: formData.courseFaqBanner.heading }}
                    onInput={(e) => handleBannerColorChange('heading', e.target.innerHTML)}
                    className="w-full p-6 min-h-[60px] focus:outline-none resize-none text-2xl font-bold"
                  />
                </div>
              </div>

               <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Banner Sub Heading
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <RichTextToolbar editorRef={subHeadingRef} />
                  <div
                    ref={subHeadingRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: formData.courseFaqBanner.subHeading }}
                    onInput={(e) => handleBannerColorChange('subHeading', e.target.innerHTML)}
                    className="w-full p-6 min-h-[60px] focus:outline-none resize-none text-xl"
                  />
                </div>
              </div>

               <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Additional Text
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <RichTextToolbar editorRef={textRef} />
                  <div
                    ref={textRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: formData.courseFaqBanner.heading }}
                    onInput={(e) => handleBannerColorChange('heading', e.target.innerHTML)}
                    className="w-full p-6 min-h-[100px] focus:outline-none resize-none"
                  />
                </div>
              </div>

               <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Background Color
                    </label>
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-16 h-16 rounded-xl border border-gray-300 shadow-md"
                        style={{ backgroundColor: formData.courseFaqBanner.bgColor }}
                      ></div>
                      <div className="flex-1">
                        <input
                          type="color"
                          value={formData.courseFaqBanner.bgColor}
                          onChange={(e) => handleBannerColorChange('bgColor', e.target.value)}
                          className="w-full h-12 border border-gray-300 rounded-xl cursor-pointer shadow-sm"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {formData.courseFaqBanner.bgColor}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Text Color
                    </label>
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-16 h-16 rounded-xl border border-gray-300 shadow-md flex items-center justify-center"
                        style={{ backgroundColor: formData.courseFaqBanner.textColor }}
                      >
                        <span className="text-white font-bold">Aa</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="color"
                          value={formData.courseFaqBanner.textColor}
                          onChange={(e) => handleBannerColorChange('textColor', e.target.value)}
                          className="w-full h-12 border border-gray-300 rounded-xl cursor-pointer shadow-sm"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {formData.courseFaqBanner.textColor}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

               <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">FAQ Questions</h2>
                    <p className="text-gray-600">Manage your frequently asked questions</p>
                  </div>
                  <button
                    onClick={handleAddFAQ}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                  >
                    <span>+ Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.courseFaq.map((faq, index) => (
                    <div key={faq.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <span className="text-lg font-semibold text-gray-900">Q{index + 1}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                          </label>
                          <textarea
                            value={faq.question}
                            onChange={(e) => handleFAQChange(faq.id, 'question', e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[100px]"
                            placeholder="Enter question here..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => handleFAQChange(faq.id, 'answer', e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[100px]"
                            placeholder="Enter answer here..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.courseFaq.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <div className="text-4xl mb-4">❓</div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No FAQ questions added yet</h3>
                      <p className="text-gray-500 mb-4">Click "Add FAQ" to create your first question</p>
                      <button
                        onClick={handleAddFAQ}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                      >
                        Add Your First FAQ
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