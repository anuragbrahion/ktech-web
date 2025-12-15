import React from 'react'
import Pagination from '../Pagination/Pagination'
import NotFound from './NotFound'
const TableData = ({ tableHeadings = [], data, currentPage = 1, size = 10, handlePageChange, total = 10,}) => {
  return (
    <>
    {/* {showDateFilter && (

      <GlobalDateRangePicker onDateChange={handleDateChange} />
    )

    }

  {startDate && endDate && (
    <div className='text-sm text-gray-700 mb-3 px-2 md:px-4'>
      <span className='font-medium'>Filtered Date Range:</span>{' '}
      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
    </div>
  )} */}
    <div className='w-full md:border border border-[#DDDDDDDD]/80 bg-white rounded-md'>
      
      <div className='overflow-x-auto'>
        <div className='hidden xl:block'>
          <table className='w-full rounded-full '>
            <thead className='bg-[#D2D2D2] '>
              <tr>
                {tableHeadings.map((heading, index) => (
                  <th
                    key={index}
                    className='px-5 py-3 text-md text-left font-bold text-black bg-[#F5F3FF] whitespace-nowrap'
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data && Array.isArray(data) && data.length > 0 ? (
                data.map((row, index) => {
                  const rowClass =
                    index % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FFFFFF]'
                  return (
                    <tr
                      key={index}
                      className={`${rowClass} border-b border-[#D2D2D2]`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className='px-5 py-3 text-xs  text-[#475569] whitespace-nowrap'
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={tableHeadings.length}
                    className='px-4 py-3 text-center text-white'
                  >
                    <div className='flex justify-center items-center'>
                      <NotFound heading={`Data not Available`} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>


        {/* Mobile Card View */}
        <div className='block xl:hidden'>
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((row, index) => (
              <div
                key={index}
                className='bg-[#FAFBFE]  mb-4 rounded-lg shadow-lg border border-[#E2E8F0] divide-y divide-white/10 '
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className='flex justify-between items-center py-4 px-4'
                  >
                    <div className='w-full'>
                      <p className='text-sm font-medium text-black'>
                        {tableHeadings[cellIndex]} :
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm font-medium text-gray-600 break-all'>
                        {cell}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className='p-4 text-center bg-[#FAFBFE]  mb-4 rounded-lg shadow-lg border border-[#E2E8F0]'>
              <div className='flex justify-center items-center text-black '>
                <NotFound heading='Data not Available' />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="flex justify-start items-center gap-4 text-md text-black p-2">
                  <p>Total Records :</p>
                  <p>{totalData}</p>
                </div> */}
      <div className='flex items-center justify-between px-4'>


        {total > 0 && <div className='py-5 text-xs font-sm'>
          {`Showing ${((currentPage - 1) * size) + 1} - ${Math.min(currentPage * size, total)} of ${total}`}
        </div>}

        <div>
          {Math.ceil(total / size) > 1 && (
            <>

              <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPages={Math.ceil(total / size)}
              />
            </>

          )


          }

        </div>
      </div>

    </div>
    </>

  )
}

export default TableData
