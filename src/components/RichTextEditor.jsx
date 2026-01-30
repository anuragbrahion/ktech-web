import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiUrl } from '../utils/axiosProvider';
 
export const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Write your content here...", 
  minHeight = "200px",
  toolbarConfig = "full",
  allowImageUpload = false
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleRichTextCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleImageUpload = async (file) => {
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
        const imageUrl = response.data.data[0].url;
        document.execCommand('insertImage', false, imageUrl);
        onChange(editorRef.current.innerHTML);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  const basicToolbar = () => (
    <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-wrap">
      <select 
        onChange={(e) => handleRichTextCommand('formatBlock', e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm mr-2 hover:bg-gray-50"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => handleRichTextCommand('bold')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('italic')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] italic"
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('underline')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] underline"
        title="Underline"
      >
        U
      </button>

      {allowImageUpload && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] text-sm flex items-center gap-1"
            title="Insert Image"
          >
            <Upload size={16} />
            Image
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => handleRichTextCommand('removeFormat')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] text-sm"
        title="Clear Format"
      >
        Clear
      </button>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
            e.target.value = '';
          }
        }}
        className="hidden"
      />
    </div>
  );

  const fullToolbar = () => (
    <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-wrap">
      <select 
        onChange={(e) => handleRichTextCommand('formatBlock', e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm mr-2 hover:bg-gray-50"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <select 
        onChange={(e) => handleRichTextCommand('fontName', e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm mr-2 hover:bg-gray-50"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => handleRichTextCommand('bold')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('italic')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] italic"
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('underline')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] underline"
        title="Underline"
      >
        U
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => handleRichTextCommand('justifyLeft')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Align Left"
      >
        ⎸
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('justifyCenter')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Align Center"
      >
        ⎹
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('justifyRight')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Align Right"
      >
        ⎸
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => handleRichTextCommand('insertUnorderedList')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px]"
        title="Bullet List"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => handleRichTextCommand('insertOrderedList')}
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
        onChange={(e) => handleRichTextCommand('foreColor', e.target.value)}
        className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
        title="Text Color"
      />

      {allowImageUpload && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] text-sm flex items-center gap-1"
            title="Insert Image"
          >
            <Upload size={16} />
            Image
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => handleRichTextCommand('removeFormat')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] text-sm"
        title="Clear Format"
      >
        Clear
      </button>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
            e.target.value = '';
          }
        }}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {toolbarConfig === 'full' ? fullToolbar() : basicToolbar()}
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => onChange(e.target.innerHTML)}
        className="w-full p-6 focus:outline-none resize-none"
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );
};