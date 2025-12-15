import React, { useState } from "react";
import { AddButton, FilterButton } from "../../components/Atoms/buttons/AllButtons.jsx";
import Table from "../../components/Atoms/Table.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { MoreVertical } from "lucide-react";
import Toggle from "../../components/Atoms/Toggle.jsx";
import SearchInput from "../../components/SearchInput/SearchInput.jsx";
import TableData from "../../components/Atoms/Table.jsx";

const LearningContent = () => {
  const [openMenu, setOpenMenu] = useState(null);
  return (
    <div className="min-h-[calc(100vh-80px)] overflow-y-auto bg-white p-4 md:p-6 lg:p-8 relative">
      <div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Tab Switch */}
          {/* <div className="w-full md:w-auto md:min-w-[400px]">
            <TabSwitch tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div> */}

          {/* Action Buttons */}
          <div>
            <SearchInput />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FilterButton onClick={() => console.log("Filter clicked")} />
            <AddButton onClick={() => console.log("Add new clicked")} />
          </div>
        </div>

        {/* Table */}
        {/* <Table columns={columns} data={tableData} /> */}
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
        // data={tableData}
        />
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

export default LearningContent;
