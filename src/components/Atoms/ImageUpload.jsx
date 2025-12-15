import React from "react";
import { MdAttachFile } from "react-icons/md";

const ImageUpload = React.memo(
  ({
    handleFileChange,
    handleDrop,
    textContain = "+ Upload here",
    id,
    capture = "",
    label = "Upload Image",
  }) => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleIconClick = () => {
      document.getElementById(id)?.click();
    };

    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium text-[#212121]" htmlFor={id}>
            {label}
          </label>
        )}

        <div
          className="relative w-full rounded-md mt-2"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Hidden file input */}
          <input
            type="file"
            id={id}
            accept="image/*"
            onChange={handleFileChange}
            capture={capture}
            style={{ display: "none" }}
          />

          {/* Clickable display box */}
          <div
            className="w-full px-3 py-3 border border-[#D8D8D8] rounded-lg text-sm text-[#212121] cursor-pointer
            focus:outline-none focus:ring-0 focus:border-[#D8D8D8] pl-5"
            onClick={handleIconClick}
          >
            {textContain}
          </div>

          {/* File icon in the right corner */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#212121] cursor-pointer"
            onClick={handleIconClick}
          >
            <MdAttachFile size={20} />
          </div>
        </div>
      </div>
    );
  }
);

export default ImageUpload;
