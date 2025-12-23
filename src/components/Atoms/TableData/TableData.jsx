// components/Table/Table.jsx
import React from 'react';

const Table = ({ 
  headers, 
  data, 
  renderRow, 
  className = '' 
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-sky-100">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index} 
                className="py-3 px-4 text-left text-black font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;