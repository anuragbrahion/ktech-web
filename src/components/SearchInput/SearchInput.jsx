import React from "react";
import { IoClose } from "react-icons/io5";

const SearchInput = ({
  label,
  value = "",
  onChange = () => {},
  className = "",
  type = "text",
  name,
  placeholder = "",
  disabled = false,
  error = "",
  required = false,
  inputClassName = "",
  onClear, // optional callback when clearing
  ...rest
}) => {
  const handleClear = () => {
    // Trigger empty value
    onChange({ target: { name, value: "" } });
    if (onClear) onClear();
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 text-sm font-bold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-3 border text-sm rounded-md pr-10
            focus:outline-none focus:ring-0 placeholder-[#475569]
            ${error
              ? "border-red-500"
              : "border-[#D8D8D8] focus:border-[#D8D8D8]"
            } disabled:text-gray-900 disabled:cursor-not-allowed ${inputClassName}`}
          {...rest}
        />

        {/* Clear Icon (only when value exists) */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default SearchInput;
