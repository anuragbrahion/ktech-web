import React, { useState } from "react";
import StatusBadge from "../../components/Atoms/badge/StatusBadge";
import TabSwitch from "../../components/TabSwitch/TabSwitch";
import { AddButton, FilterButton } from "../../components/Atoms/buttons/AllButtons.jsx";
import Table from "../../components/Atoms/Table.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { MoreVertical, Eye, Edit, Star, Trash2, RefreshCcw } from "lucide-react";
import Toggle from "../../components/Atoms/Toggle.jsx";
import SearchInput from "../../components/SearchInput/SearchInput.jsx";
import TableData from "../../components/Atoms/Table.jsx";

const Language = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null); 

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-y-auto bg-white p-4 md:p-6 lg:p-8 relative">
      <div className="border rounded-xl p-5">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Tab Switch */}
          <div className="">
            <SearchInput/>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <FilterButton onClick={() => console.log("Filter clicked")} />
            <AddButton onClick={() => console.log("Add new clicked")} />
          </div>
        </div>

        {/* Table */}
     <TableData
          tableHeadings={[
            '#',
            'Key',
            'Value',
            'Fee Type',
            'Description',
            'CreatedAt',
            'Status',
            'Action'
          ]}
          />

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>

      {/* Background overlay to close dropdown */}
      {openMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
};

export default Language;
