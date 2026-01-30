import React from 'react'
import Textarea from '../Input/Textarea.jsx'
import SelectDropdown from '../SelectInput/SelectDropDown.jsx'
import Button from '../Atoms/Button.jsx'
const AlertModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title = 'Are you sure you want to delete?',
  description = 'This action cannot be undone. Please confirm your decision.',
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  icon = null,
  isReason = false,
  inputValue = '',
  onInputChange = null,
  inputError = '',
  isDropDown = false,
  dropValue = '',
  onDropChange = null,
  dropError = '',
  imageUrl = "/img/delete.svg",
  dropOptions = [],
  isVisibleCancelButton = false,
  isVisibleConfirmButton = false,
  confirmClassNameButton = "",
  cancelClassNameButton = '',
  imageClassName=""
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
      <div className='bg-white p-6 md:p-8 rounded-lg w-full lg:w-[500px] shadow-lg'>
        {/* Icon Section */}
        <div className='flex justify-center mb-5'>
          <div className='w-16 h-16 rounded-full bg-[#7038C41A] text-black flex items-center justify-center shadow-md'>
            {icon || (
              <img src={imageUrl} className={imageClassName} alt="" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className='space-y-2 text-center mb-5'>
          <h2 className='md:text-lg text-sm text-black font-bold'>{title}</h2>
          <p className='text-[#212121CC]/80 md:text-sm text-xs'>{description}</p>
        </div>

        {/* Textarea for Reason */}
        {isReason && (
          <Textarea
            id='reason'
            name='reason'
            label='Reason'
            placeholder='Enter reason'
            rows={3}
            value={inputValue}
            onChange={onInputChange}
            textareaClassName='border-white/15'
            labelClassName='text-white/70'
            required
            errorMessage={inputError}
            maxLength={500}
          />
        )}
        {isDropDown && (
          <SelectDropdown
            id='type'
            name='type'
            label='Type'
            placeholder='Select Type'
            required={true}
            options={dropOptions}
            value={dropValue}
            onChange={onDropChange}
            errorMessage={dropError}
          />
        )}


        <div className='flex justify-end place-items-center gap-3 pt-5'>

          {isVisibleCancelButton && <Button className={`w-full !bg-[#F5F5F5] !text-black !hover:text-red-500 cursor-pointer ${cancelClassNameButton}`} onClick={onCancel} variant='cancel'>
            {cancelLabel}
          </Button>}
          {isVisibleConfirmButton && <Button onClick={onConfirm} variant='confirm' className={`w-full px-4 py-2 !bg-[#E93E3E] flex justify-center items-center text-white font-bold font-size:16px gap-1 rounded-md cursor-pointer ${confirmClassNameButton}`}>
            {confirmLabel}
          </Button>}

        </div>
      </div>
    </div>
  )
}

export default AlertModal
