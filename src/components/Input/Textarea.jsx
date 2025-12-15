/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { LuAsterisk } from 'react-icons/lu';

const Textarea = ({
  id = 'default-id',
  name = 'default-name',
  placeholder = 'Enter text',
  label = '',
  rows = 4,
  containerClassName = '',
  labelClassName = '',
  textareaClassName = '',
  autoFocus = false,
  required = false,
  value = '',
  errorMessage = '',
  isDisabled = false,
  onChange = () => { },
  ...rest
}) => {
  const textareaRef = useRef();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-bold  relative ${labelClassName}`}
        >
          {label}
          {required && (
            <LuAsterisk className="inline text-red-500 ml-1" size={12} />
          )}
        </label>
      )}

      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={textareaRef}
        disabled={isDisabled}
        className={`w-full px-4 py-2 mt-2 rounded-md border text-sm focus:outline-none  text-white bg-transparent ${textareaClassName} ${errorMessage ? 'border-red-500' : 'border-[#D8D8D8]'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...rest}
      />

      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default React.memo(Textarea);
