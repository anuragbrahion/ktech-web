import React, { useState, useRef } from 'react';

export default function CourseFAQEditor() {
  const [formData, setFormData] = useState({
    heading: '<h1>Course FAQ</h1>',
    subHeading: '<h2>FAQ about how to learn computer courses</h2>',
    backgroundColor: '#2563eb',
    text: '<p>Your all questions About computer courses please check it here</p>'
  });

  const [faqs, setFaqs] = useState([
    { id: 1, question: 'What programming languages are covered?', answer: 'We cover Python, JavaScript, Java, and C++.' },
    { id: 2, question: 'Is there any prerequisite required?', answer: 'Basic computer knowledge is sufficient for beginners.' },
    { id: 3, question: 'How long is the course duration?', answer: 'Courses range from 3 to 6 months depending on the program.' }
  ]);

  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const textRef = useRef(null);

  const handleRichTextCommand = (command, value = null, ref) => {
    document.execCommand(command, false, value);
    if (ref.current) {
      const content = ref.current.innerHTML;
      switch (ref) {
        case headingRef:
          setFormData(prev => ({ ...prev, heading: content }));
          break;
        case subHeadingRef:
          setFormData(prev => ({ ...prev, subHeading: content }));
          break;
        case textRef:
          setFormData(prev => ({ ...prev, text: content }));
          break;
      }
    }
  };

  const handleUpdate = () => {
    console.log('Form data:', { ...formData, faqs });
  };

  const handleAddFAQ = () => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
    setFaqs([...faqs, { 
      id: newId, 
      question: `Q${newId}`, 
      answer: `A${newId}` 
    }]);
  };

  const handleDeleteFAQ = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleFAQChange = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course FAQ Editor</h1>
              <p className="text-gray-600 mt-2">Manage frequently asked questions</p>
            </div>
            <button
              onClick={handleUpdate}
              className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Update FAQ
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Heading
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <RichTextToolbar editorRef={headingRef} />
                <div
                  ref={headingRef}
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: formData.heading }}
                  onInput={(e) => setFormData(prev => ({ ...prev, heading: e.target.innerHTML }))}
                  className="w-full p-6 min-h-[60px] focus:outline-none resize-none text-2xl font-bold"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Text
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <RichTextToolbar editorRef={textRef} />
                <div
                  ref={textRef}
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: formData.text }}
                  onInput={(e) => setFormData(prev => ({ ...prev, text: e.target.innerHTML }))}
                  className="w-full p-6 min-h-[100px] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Sub Heading
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <RichTextToolbar editorRef={subHeadingRef} />
                <div
                  ref={subHeadingRef}
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: formData.subHeading }}
                  onInput={(e) => setFormData(prev => ({ ...prev, subHeading: e.target.innerHTML }))}
                  className="w-full p-6 min-h-[60px] focus:outline-none resize-none text-xl"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Background Color
              </label>
              <div className="flex items-center gap-6">
                <div 
                  className="w-16 h-16 rounded-xl border border-gray-300 shadow-md"
                  style={{ backgroundColor: formData.backgroundColor }}
                ></div>
                <div className="flex-1">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-12 border border-gray-300 rounded-xl cursor-pointer shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {formData.backgroundColor}
                  </p>
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
                {faqs.map((faq, index) => (
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

                {faqs.length === 0 && (
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
        </div>
      </div>
    </div>
  );
}