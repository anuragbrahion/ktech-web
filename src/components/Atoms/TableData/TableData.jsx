
const Table = ({
  headers,
  data,
  renderRow,
  className = '',
  currentPage = 1,
  totalPages = 1,
  handlePageChange,
}) => {

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages - 1, currentPage + Math.floor(maxVisible / 2));

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

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
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="py-6 text-center text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>

          <div className="flex gap-2 items-center">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg border transition ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;

// const Table = ({
//   headers,
//   data,
//   renderRow,
//   className = '',
//   currentPage = 1,
//   totalPages = 1,
//   handlePageChange,
// }) => {
//   return (
//     <div className={`overflow-x-auto ${className}`}>
//       <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//         <thead className="bg-sky-100">
//           <tr>
//             {headers.map((header, index) => (
//               <th
//                 key={index}
//                 className="py-3 px-4 text-left text-black font-semibold"
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-gray-200">
//           {data.length > 0 ? (
//             data.map((item, index) => renderRow(item, index))
//           ) : (
//             <tr>
//               <td
//                 colSpan={headers.length}
//                 className="py-6 text-center text-gray-500"
//               >
//                 No data found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//        {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-4 px-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
//           >
//             Previous
//           </button>

//           <div className="flex gap-2 max-w-md mx-auto overflow-hidden overflow-y-auto ">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`px-3 py-1 rounded-lg border ${
//                   page === currentPage
//                     ? 'bg-blue-600 text-white'
//                     : 'hover:bg-gray-100'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;