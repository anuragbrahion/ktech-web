import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { LuAsterisk } from 'react-icons/lu'

const SelectDropdown = ({
  id = 'select-dropdown',
  name = 'default-name',
  options = [],
  placeholder = 'Select an option',
  value = '',
  onChange = () => {},
  required = false,
  errorMessage = '',
  isDisabled = false,
  containerClassName = '',
  selectClassName = '',
  iconClassName = '',
  label = '',
  labelClassName = '',
}) => {
  return (
    <div className={`w-full mt-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-white/70 text-sm font-medium mb-2 block relative ${labelClassName}`}
        >
          {label}
          {required && (
            <LuAsterisk className="inline text-red-500 ml-1" size={10} />
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          className={`block w-full px-4 py-4 border bg-transparent border-white/15 text-white rounded-md shadow-sm focus:outline-none appearance-none pr-10 ${
            errorMessage ? 'border-red-500' : ''
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${selectClassName}`}
        >
          <option value="" disabled className="bg-[#1D222E] text-white/70">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#1D222E] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <FaChevronDown
          className={`absolute top-1/2 right-3 transform -translate-y-1/2 text-white/70 pointer-events-none ${iconClassName}`}
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

export default SelectDropdown
