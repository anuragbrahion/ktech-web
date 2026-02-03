import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWebsiteQueries } from '../../redux/slices/website';
import Table from '../../components/Atoms/TableData/TableData';
 
const ContactUs = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const resData =
    useSelector(
      (state) => state?.website?.getWebsiteQueriesData?.data?.data?.list
    ) || [];

  const total =
    useSelector(
      (state) => state?.website?.getWebsiteQueriesData?.data?.data?.total
    ) || 0;

  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    dispatch(getWebsiteQueries({ page: currentPage, size: itemsPerPage }));
  }, [dispatch, currentPage]);

  const tableHeaders = ['Name', 'E-mail', 'Mobile', 'Query'];

  const tableData = resData.map((item) => [
    item.name,
    item.email,
    item.mobile,
    item.query,
  ]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Contact Us Form List</h2>

    <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
        renderRow={(row, index) => (
          <tr
            key={index}
            className={`hover:bg-blue-50 ${
              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-3 px-4">
                {cell}
              </td>
            ))}
          </tr>
        )}
      />
    </div>
  );
};

export default ContactUs;