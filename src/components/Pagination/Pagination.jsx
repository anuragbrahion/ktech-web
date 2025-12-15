import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel="Prev"
      nextLabel="Next"
      breakLabel="..."
      pageCount={totalPages}
      forcePage={currentPage - 1} // react-paginate is 0-indexed
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
      containerClassName="flex items-center justify-center gap-2 mt-6"
      pageClassName="w-8 h-8 text-sm font-medium rounded transition-colors"
      pageLinkClassName="flex items-center justify-center w-full h-full"
      previousClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
      nextClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
      breakClassName="px-2 text-gray-500"
      activeClassName="bg-purple-600 text-white"
      disabledClassName="opacity-50 cursor-not-allowed"
    />
  );
};

export default Pagination;
