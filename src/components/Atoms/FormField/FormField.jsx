import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  min,
  max,
  disabled = false,
  rows = 4,
}) => {
  const baseClasses =
    "w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2";

  const normalBorder =
    "border-gray-300 focus:ring-blue-500 focus:border-blue-500";

  const errorBorder =
    "border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}{" "}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Types */}
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`${baseClasses} ${
            error ? errorBorder : normalBorder
          } resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={type === "date" ? min : undefined}
          max={type === "date" ? max : undefined}
          disabled={disabled}
          className={`${baseClasses} ${
            error ? errorBorder : normalBorder
          }`}
        />
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;