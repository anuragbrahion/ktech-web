import React, { useEffect, useRef, useState } from 'react'
import { LuAsterisk } from 'react-icons/lu'
import { FaInfoCircle } from 'react-icons/fa'

const ToggleButton = ({
  id = 'default-toggle',
  label = '',
  isChecked = true,
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
  toggleOnColor = 'bg-green-400',
  toggleOffColor = 'bg-gray-200',
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
    <div className={`flex flex-col ${containerClassName}`}>
      {/* Label and info section */}
      {(label || otherContext) && (
        <div className="mb-2">
          {label && (
            <label
              htmlFor={id}
              className={`text-sm font-medium flex items-center gap-1 ${labelClassName}`}
            >
              {label}
              {required && <LuAsterisk className='text-red-500 flex-shrink-0' size={12} />}
              {info && (
                <div
                  className='relative flex items-center'
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <FaInfoCircle
                    className='text-blue-500 cursor-pointer flex-shrink-0'
                    size={14}
                  />
                  {showTooltip && (
                    <div className='absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg w-40 z-10'>
                      {info}
                    </div>
                  )}
                </div>
              )}
            </label>
          )}

          {otherContext && (
            <p className='text-xs text-gray-600 mt-1'>{otherContext}</p>
          )}
        </div>
      )}

      {/* Toggle and error section */}
      <div className="flex flex-col">
        <div className="flex items-center">
          <button
            id={id}
            ref={toggleRef}
            type="button"
            role="switch"
            aria-checked={isChecked}
            disabled={isDisabled}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5  transition-colors duration-200 ease-in-out focus:outline-none  ${
              isChecked ? toggleOnColor : toggleOffColor
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${toggleClassName}`}
            onClick={!isDisabled ? onToggle : undefined}
            {...rest}
          >
            <span
              className={`pointer-events-none  inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isChecked ? 'translate-x-5' : 'translate-x-0'
              } ${knobClassName}`}
            />
          </button>
        </div>

        {errorMessage && (
          <p className='text-red-500 text-xs mt-2'>{errorMessage}</p>
        )}
      </div>
    </div>
  )
}

export default React.memo(ToggleButton)