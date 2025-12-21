import React, { useState, useRef } from 'react';

export default function AboutUsEditor() {
  const [formData, setFormData] = useState({
    heading: '<h1>About Our Company</h1>',
    subHeading: '<h2>Building the Future Together</h2>',
    backgroundColor: '#1e40af',
    bannerLogo: null,
    text: '<p>We are a dedicated team passionate about creating innovative solutions that make a difference.</p>'
  });

  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const textRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, bannerLogo: file }));
  };

  const handleUpdate = () => {
    console.log('Form data:', formData);
  };

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

      <select 
        onChange={(e) => handleRichTextCommand('fontName', e.target.value, editorRef)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm mr-2 hover:bg-gray-50"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

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
        onClick={() => handleRichTextCommand('justifyLeft', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Align Left"
      >
        ⎸
      </button>
      <button
        onClick={() => handleRichTextCommand('justifyCenter', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Align Center"
      >
        ⎹
      </button>
      <button
        onClick={() => handleRichTextCommand('justifyRight', null, editorRef)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Align Right"
      >
        ⎸
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

      <input
        type="color"
        onChange={(e) => handleRichTextCommand('foreColor', e.target.value, editorRef)}
        className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
        title="Text Color"
      />

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
              <h1 className="text-3xl font-bold text-gray-900">About Us Editor</h1>
              <p className="text-gray-600 mt-2">Customize your about us page content</p>
            </div>
            <button
              onClick={handleUpdate}
              className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Update Content
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
                  placeholder="Write heading here..."
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
                  placeholder="Write sub heading here..."
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
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Banner Logo
              </label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                  {formData.bannerLogo ? (
                    <div className="text-center p-4">
                      <div className="text-blue-600 font-medium truncate max-w-[100px]">
                        {formData.bannerLogo.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {(formData.bannerLogo.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🖼️</div>
                      <div className="text-gray-500 text-sm">No logo</div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="px-6 py-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Logo
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Content
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <RichTextToolbar editorRef={textRef} />
                <div
                  ref={textRef}
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: formData.text }}
                  onInput={(e) => setFormData(prev => ({ ...prev, text: e.target.innerHTML }))}
                  className="w-full p-6 min-h-[200px] focus:outline-none resize-none"
                  placeholder="Write your content here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}