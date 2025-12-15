import React from "react";
import Select from "react-select";

const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange = () => { },
  className = "",
  disabled = false,
  placeholder = "Select an option",
  name = "",
  id = "",
  label = "",
  error = "",
  required = false,
  isMulti = false,
  containerClassName = "",
  ...rest
}) => {
  // Format value for react-select


  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block mb-2 text-sm font-medium text-[#1E293B]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Select
        id={id}
        name={name}
        isDisabled={disabled}
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        classNamePrefix="react-select"
        className={`react-select-container ${className}`}
        {...rest}
      />

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelectDropdown;
