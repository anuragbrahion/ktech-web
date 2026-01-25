import Pagination from '../Pagination/Pagination';
import NotFound from './NotFound';

const TableData = ({ 
  tableHeadings = [], 
  data, 
  currentPage = 1, 
  size = 10, 
  handlePageChange, 
  total = 0,
  renderRow = null,
  renderMobileRow = null
}) => {
  
  // Default renderRow function if not provided
  const defaultRenderRow = (row, index) => {
    const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    return (
      <tr key={index} className={`${rowClass} border-b border-gray-200`}>
        {row.map((cell, cellIndex) => (
          <td key={cellIndex} className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
            {cell}
          </td>
        ))}
      </tr>
    );
  };

  // Default mobile render function
  const defaultRenderMobileRow = (row, index) => (
    <div key={index} className='bg-white mb-4 rounded-lg shadow border border-gray-200'>
      {row.map((cell, cellIndex) => (
        <div key={cellIndex} className='flex justify-between items-center py-3 px-4 border-b border-gray-100'>
          <div className='w-1/3'>
            <p className='text-sm font-medium text-gray-700'>{tableHeadings[cellIndex]}:</p>
          </div>
          <div className='w-2/3'>
            <p className='text-sm text-gray-900 break-words'>{cell}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFunction = renderRow || defaultRenderRow;
  const renderMobileFunction = renderMobileRow || defaultRenderMobileRow;

  return (
    <div className='w-full border border-gray-200 bg-white rounded-lg'>
      <div className='overflow-x-auto'>
        {/* Desktop Table View */}
        <div className='hidden md:block'>
          <table className='w-full'>
            <thead className='bg-gray-100'>
              <tr>
                {tableHeadings.map((heading, index) => (
                  <th key={index} className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data && Array.isArray(data) && data.length > 0 ? (
                data.map((row, index) => renderFunction(row, index))
              ) : (
                <tr>
                  <td colSpan={tableHeadings.length} className='px-6 py-12 text-center'>
                    <NotFound heading="No data available" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className='block md:hidden'>
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((row, index) => renderMobileFunction(row, index))
          ) : (
            <div className='p-6 text-center'>
              <NotFound heading='No data available' />
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {total > 0 && (
        <div className='flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-t border-gray-200'>
          <div className='text-sm text-gray-600 mb-4 md:mb-0'>
            Showing {Math.min(((currentPage - 1) * size) + 1, total)} - {Math.min(currentPage * size, total)} of {total} entries
          </div>
          {Math.ceil(total / size) > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={Math.ceil(total / size)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TableData;