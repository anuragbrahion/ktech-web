import React from 'react'
import { IoClose } from 'react-icons/io5'

const ImagePreviewModal = ({
  isOpen,
  closeModal,
  children,
  heading = '',
  modalClassName = "",
  headingClassName = "",
  childrenClassName = "",
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className={`bg-[#FAFAFA] rounded-lg w-11/12 lg:w-[900px] ${modalClassName}`}>
        <div className='flex justify-between items-center border-b border-[#ffff]/10 py-3 px-5'>
          <h2 className={`text-xl text-[#212121] font-semibold ${headingClassName}`}>{heading}</h2>
          <button onClick={closeModal} className='text-2xl text-gray-600 hover:text-black transition'>
            <IoClose />
          </button>
        </div>

        <div className={`p-5 ${childrenClassName}`}>{children}</div>
      </div>
    </div>
  )
}

export default ImagePreviewModal
