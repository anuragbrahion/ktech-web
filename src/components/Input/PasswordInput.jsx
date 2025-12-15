import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
const PasswordInput = ({
  label,
  value = "",
  onChange = () => {},
  className = "",
  name,
  placeholder = "",
  disabled = false,
  error="",
  required=false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className=" mb-2 text-sm font-medium text-[#1E293B]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-0 placeholder-[#47556966] placeholder:font-medium 
            ${error ? 'border-red-500' : 'border-[#151E2814]'} focus:border-[#151E2814]`}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
        >
          {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </span>
      </div>
      {/* Display error message if there's an error */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
