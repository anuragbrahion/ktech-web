import React from 'react';
 
const AddForm = ({ onSubmit, title, children, error, formLayoutClassName = "" }) => {
  return (
    <div className={`flex justify-center items-center ${formLayoutClassName}`}>
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 min-w-2xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/Logo/Login/Logo.png" alt="logo" className="h-16 w-auto" />
        </div>
        <form className="space-y-6" onSubmit={onSubmit}>
          {title && (
            <h2 className="mt-2 text-center text-2xl font-semibold text-black">
              {title}
            </h2>
          )}
 
          {/* Add general error message display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
 
          {children}
        </form>
      </div>
    </div>
  );
};
 
export default AddForm;