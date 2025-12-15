import React, { useState } from "react";
import StatusBadge from "../../components/Atoms/badge/StatusBadge";
import TabSwitch from "../../components/TabSwitch/TabSwitch";
import {
  AddButton,
  FilterButton,
} from "../../components/Atoms/buttons/AllButtons.jsx";
import Table from "../../components/Atoms/Table.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { MoreVertical } from "lucide-react";
import SearchInput from "../../components/SearchInput/SearchInput.jsx";
import TableData from "../../components/Atoms/Table.jsx";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('Audio / Video Library');
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Tab Switch */}
           <div>
            <SearchInput/>
           </div>
          {/* Action Buttons */}
          <div className="grid  grid-cols-2 gap-3">
            <FilterButton onClick={() => console.log("Filter clicked")} />
            <AddButton onClick={() => setIsOpenModal(true)} />
          </div>
        </div>

        {/* Table */}
        {activeTab === "Audio / Video Library" && (
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
        )}

          {activeTab === "Playlists" && (
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
        )}

         {activeTab === "Voice Styles" && (
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
        )}

        {/* Pagination */}
      </div>
    </div>
  );
};

export default ContentManagement;
