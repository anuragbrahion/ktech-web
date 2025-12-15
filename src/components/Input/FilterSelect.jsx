import React from 'react';

const FilterSelect = ({
  options = [],
  selectedOption,
  onChange,
  containerClassName = '',
  selectClassName = ''
}) => {
  return (
    <div className={`relative w-full ${containerClassName} rounded-lg`}>
      {/* Filter Icon positioned absolutely inside the input */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
        {/* <img src="/filter.png" alt="filter" className="w-4 h-4" /> */}
      </div>

      <select
        value={selectedOption}
        onChange={onChange}
        className={`bg-white text-[#667085] py-3 font-medium pl-2 pr-4 border-[1px] border-gray-400 rounded-full w-full focus:outline-none ${selectClassName}`}
        aria-label="Filter By"
      >
        {options.map(option => (
          <option key={option?.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(FilterSelect);
