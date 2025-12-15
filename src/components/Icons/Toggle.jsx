import React, { useEffect, useRef, useState } from 'react'
import { LuAsterisk } from 'react-icons/lu'
import { FaInfoCircle } from 'react-icons/fa'

const ToggleButton = ({
  id = 'default-toggle',
  label = '',
  isChecked = false,
  onToggle = () => {},
  autoFocus = false,
  required = false,
  containerClassName = '',
  labelClassName = '',
  toggleClassName = '',
  knobClassName = '',
  errorMessage = '',
  otherContext = '',
  info = '',
  isDisabled = false,
  toggleOnColor = 'bg-green-500',
toggleOffColor = 'bg-gray-700',
  ...rest
}) => {
  const toggleRef = useRef()
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (autoFocus && toggleRef.current) {
      toggleRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium mb-1 flex items-center gap-1 relative ${labelClassName}`}
        >
          {label}
          {required && <LuAsterisk className='text-red-500' size={12} />}
          {info && (
            <div
              className='relative flex items-center'
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <FaInfoCircle
                className='text-blue-500 cursor-pointer'
                size={14}
              />
              {showTooltip && (
                <div className='absolute top-full mt-1 left-1/2 transform -translate-x-1/2  text-white text-xs rounded-md p-2 shadow-lg w-40 z-10'>
                  {info}
                </div>
              )}
            </div>
          )}
        </label>
      )}

      {otherContext && (
        <p className='text-xs text-white/70 mb-1'>{otherContext}</p>
      )}

      <div className='flex items-center'>
        <div
          id={id}
          ref={toggleRef}
          tabIndex={0}
          role='switch'
          aria-checked={isChecked}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer focus:outline-none ${
            isChecked ? toggleOnColor : toggleOffColor
          } ${toggleClassName} ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={!isDisabled ? onToggle : undefined}
          {...rest}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform cursor-pointer ${
              isChecked ? 'translate-x-6' : 'translate-x-0'
            } transition-transform duration-300 ${knobClassName}`}
          />
        </div>
      </div>

      {errorMessage && (
        <p className='text-red-500 text-xs mt-1'>{errorMessage}</p>
      )}
    </div>
  )
}

export default React.memo(ToggleButton)
