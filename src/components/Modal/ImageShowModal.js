import { useState } from "react";
import { IoImagesOutline } from "react-icons/io5";
import ImagePreviewModal from "./imagePreviewModal";

export const ImageShowModal = ({ images, showIcon = true, heading = "Product Images" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) {
    return <span className="text-gray-400">No images</span>;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {showIcon ? (
          <button
            onClick={() => setIsOpen(true)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <IoImagesOutline size={20} className="text-black-500" />
          </button>
        ) : (
          <img
            src={images[0]}
            alt="Thumbnail"
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 object-cover rounded cursor-pointer border"
          />
        )}
      </div>

      <ImagePreviewModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        modalClassName="!max-w-3xl"
        heading={heading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {images.map((img, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="w-full h-48 object-contain"
              />
            </div>
          ))}
        </div>
      </ImagePreviewModal>
    </>
  );
};
