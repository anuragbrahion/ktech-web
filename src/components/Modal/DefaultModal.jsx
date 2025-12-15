import React from "react";
import { IoClose } from "react-icons/io5";
import Button from "../Atoms/Button";


/**
 * DefaultPreviewModal - A global, reusable modal component
 *
 * Props:
 * - isOpen (bool): Controls modal visibility
 * - closeModal (func): Function to close the modal
 * - children (node): Modal content
 * - heading (string): Modal title
 * - modalClassName (string): Extra classes for modal container
 * - headingClassName (string): Extra classes for heading
 * - childrenClassName (string): Extra classes for content wrapper
 * - handleSubmit (func): Callback for submit button
 * - isLoading (bool): Show loading state on submit button
 * - isEditMode (bool): Changes submit button text
 * - showCancelButton (bool): Show/hide cancel button
 * - showSubmitButton (bool): Show/hide submit button
 */
const DefaultPreviewModal = ({
  isOpen,
  closeModal,
  children,
  heading = "",
  modalClassName = "",
  headingClassName = "",
  childrenClassName = "",
  handleSubmit,
  isLoading = false,
  isEditMode = false,
  showCancelButton = true,
  showSubmitButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div
        className={`bg-[#FAFAFA] rounded-lg w-11/12 lg:w-[900px] max-h-[90vh] flex flex-col shadow-lg ${modalClassName}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#00000010] py-3 px-5 shrink-0">
          <h2
            className={`lg:text-2xl text-xl text-[#0F172A] font-bold ${headingClassName}`}
          >
            {heading}
          </h2>

          <button
            onClick={closeModal}
            className="w-7 h-7 rounded-full bg-[#00000033] flex justify-center items-center cursor-pointer hover:bg-[#00000050] transition"
          >
            <IoClose fill="white" size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className={`p-5 overflow-y-auto flex-1 hide-scrollbar ${childrenClassName}`}
        >
          {children}
        </div>

        {/* Footer Buttons */}
        {(showCancelButton || showSubmitButton) && (
          <div className="flex justify-end gap-4 p-5 border-t border-[#00000010] bg-[#F9FAFB] shrink-0">
            {showCancelButton && (
              <Button
                className="!bg-white !text-black hover:!bg-gray-200 border"
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}

            {showSubmitButton && (
              <Button
                className="base-bg-color text-white font-extrabold"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultPreviewModal;
