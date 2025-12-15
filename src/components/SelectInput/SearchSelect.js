import React from 'react'
import Select from 'react-select'
import { LuAsterisk } from 'react-icons/lu'
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    borderColor: state.isFocused
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    padding: '8px',
    borderRadius: '0.375rem',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(255, 255, 255, 0.7)' : 'none',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.7)'
    },
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    opacity: state.isDisabled ? 0.5 : 1  
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.15)' : '#1D222E',
    color: 'white',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer'
  }),
  singleValue: provided => ({
    ...provided,
    color: 'white'
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: '#1D222E',
    borderRadius: '0.375rem'
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isDisabled
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(255, 255, 255, 0.7)',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer'
  }),
  input: provided => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.7)'
  })
}

const SearchSelect = ({
  id = 'select-dropdown',
  name = 'default-name',
  options = [],
  placeholder = 'Select an option',
  value = null,
  onChange = () => {},
  required = false,
  errorMessage = '',
  isDisabled = false,
  containerClassName = '',
  selectClassName = '',
  label = '',
  labelClassName = ''
}) => {
  const defaultOption = { value: '', label: placeholder }
  const allOptions = [defaultOption, ...options]

  return (
    <div className={`w-full mt-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-white/70 text-sm font-medium mb-2 block relative ${labelClassName}`}
        >
          {label}
          {required && (
            <LuAsterisk className='inline text-red-500 ml-1' size={10} />
          )}
        </label>
      )}

      <Select
        id={id}
        name={name}
        options={allOptions}
        value={
          allOptions.find(option => option.value === value) || defaultOption
        }
        onChange={onChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        className={`text-black ${selectClassName}`}
        classNamePrefix='react-select'
        styles={customStyles}
      />

      {errorMessage && (
        <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>
      )}
    </div>
  )
}

export default SearchSelect
