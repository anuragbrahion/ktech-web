import React from "react";
import Select from "react-select";

const Dropdown = ({
  options = [],
  value = "",
  onChange = () => {},
  className = "",
  disabled = false,
  placeholder = "Please Select Option",
  name = "",
  id = "",
  label = "",
  error = "",
  mainClassName = "",
  required = false,
  isMulti = false,
  showSelectAll = false,
  ...rest
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: 6,
      borderColor: error ? "#ff0000" : "#D8D8D8",
      minHeight: 41,
      boxShadow: "none",
      padding: "4px 6px",
      fontSize: 14,
      "&:hover": { borderColor: "#D8D8D8" },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#00000070",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#212121",
      fontWeight: 400,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontWeight: 500,
    }),
    input: (provided) => ({
      ...provided,
      color: "#212121",
    }),
  };

  // Determine selected value for react-select
  const getSelectedValue = () => {
    if (isMulti) {
      return Array.isArray(value) ? value : [];
    } else {
      // If value is an object (value+label), return it
      if (value && value.value) return value;
      // Otherwise, find the matching object by value
      return options.find((opt) => opt.value === value) || null;
    }
  };

  // Handle Select All toggle for multi-select
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onChange(options); // select all
    } else {
      onChange([]); // clear all
    }
  };

  return (
    <div className={`relative w-full ${mainClassName}`}>
      {/* Label & Select All */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        {label && (
          <label htmlFor={id} className="text-sm font-bold flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {showSelectAll && isMulti && (
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 text-[#7038C4] border-gray-300 rounded focus:ring-[#7038C4] focus:ring-2"
              onChange={handleSelectAll}
              checked={Array.isArray(value) && value.length === options.length}
            />
            <span className="font-bold text-[#1E293B]">Select All</span>
          </label>
        )}
      </div>

      {/* Dropdown */}
      <div className={className}>
        <Select
          id={id}
          name={name}
          value={getSelectedValue()}
          onChange={(selected) => onChange(selected)}
          options={options}
          isDisabled={disabled}
          isMulti={isMulti}
          placeholder={placeholder}
          styles={customStyles}
          {...rest}
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
