import React from "react";

const Input = ({
  label,
  value = "",
  onChange = (e) => { },
  className = "",
  type = "text",
  name,
  placeholder = "",
  disabled = false,
  error = "",
  required = false,
  inputClassName,
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className=" mb-2 text-sm font-bold"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-3 border text-sm
          focus:outline-none focus:ring-0 placeholder-[#475569] placeholder:font-small rounded-md
          ${error ? "border-red-500" : "border-[#D8D8D8] focus:border-[#D8D8D8] disabled: text-gray-900 disabled:cursor-not-allowed"} ${inputClassName}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;