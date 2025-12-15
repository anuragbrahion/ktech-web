import React, { useRef } from "react";
import { FaFilePdf, FaTimes } from "react-icons/fa";
import { LuAsterisk } from "react-icons/lu";

const UploadImage = ({
  id = "default-image-upload",
  label = "Upload Image",
  accept = "image/*",
  file,
  onChange,
  onRemove,
  errorMessage = "",
  isDisabled = false,
  containerClassName = "",
  labelClassName = "",
  previewClassName = "",
  iconClassName = "",
  options = [],
  selectValue = "",
  onSelectChange,
  required = false,
}) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (isDisabled) return;
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  return (
    <div className={`mt-4 ${containerClassName}`}>
      {/* Label with SearchSelect */}
      <div className="mb-4">
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-[#1E293B] relative ${labelClassName}`}
          >
            {label}
            {required && (
              <LuAsterisk className="inline text-red-500 ml-1 mb-2" size={12} />
            )}
          </label>
        )}
        {/* <SearchSelect
          id='image-select'
          name='imageSelect'
          options={options}
          value={selectValue}
          onChange={selected => onSelectChange(selected.value)}
          containerClassName=''
          selectClassName='capitalize text-white/70'
          isDisabled={isDisabled}
        /> */}
      </div>

      {/* Dropzone */}
      <div
        className={`relative bg-[#7038C41A] w-full max-w-[1000px] border-dashed  border-[#D8D8D8] border-2 text-black rounded-md shadow-sm p-4 focus:outline-none cursor-pointer flex items-center justify-center ${
          errorMessage ? "border-red-500" : ""
        } ${isDisabled ? "cursor-not-allowed" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isDisabled && fileInputRef.current.click()}
      >
        <input
          type="file"
          id={id}
          accept={accept}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isDisabled}
        />

        {file ? (
          <div className="relative w-full flex justify-center items-center">
            <div className="relative">
              {file.endsWith(".pdf") || file.includes("application/pdf") ? (
                // Show PDF preview as embed or icon
                <div className="flex flex-col items-center">
                  <FaFilePdf size={36} color="red" />
                  <span className="text-sm text-gray-600 mt-2">PDF File</span>
                </div>
              ) : (
                // Show image preview
                <img
                  src={file}
                  alt="Preview"
                  className={`w-auto h-auto object-cover rounded-md ${previewClassName}`}
                />
              )}

              {!isDisabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="absolute top-1 right-1 bg-white text-black rounded-full p-1"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
              className={`mx-auto text-black ${iconClassName}`}
            >
              <path d="M15 8h.01"></path>
              <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"></path>
              <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"></path>
              <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"></path>
              <path d="M19 22v-6"></path>
              <path d="M22 19l-3 -3l-3 3"></path>
            </svg>
            <span className="block text-black mt-2">
              Drop your files here or <span className="text-[#7038C4]">browse</span> 
            </span>
            <span className="text-[14px] text-[#0B0910B2]">
              Upload PDF file or any image file, Maximum File size upto 20.00 MB
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default React.memo(UploadImage);
