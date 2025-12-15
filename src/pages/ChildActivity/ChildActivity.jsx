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

const ChildActivity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null); // Track which row menu is open

const tableData = [
  {
    id: 1,
    controlType: "Screen Time Limit",
    description: "Set max daily or weekly watch time per child profile",
    ageGroup: "3-5",
    language: "English, Hindi, Urdu",
    status: true,
  },
  {
    id: 2,
    controlType: "Content Restrictions",
    description: "Control what type of content is viewable by age",
    ageGroup: "6-8",
    language: "English, Hindi, Urdu",
    status: true,
  },
  {
    id: 3,
    controlType: "Age-Based Filters",
    description: "Automatically block inappropriate content",
    ageGroup: "9-12",
    language: "English, Hindi, Urdu",
    status: false,
  },
  {
    id: 4,
    controlType: "Language Restrictions",
    description: "Lock profile access with PIN or parental approval",
    ageGroup: "13+",
    language: "English, Hindi, Urdu",
    status: true,
  },
  {
    id: 5,
    controlType: "Child Lock",
    description: "Automatically block inappropriate content",
    ageGroup: "9-12",
    language: "English, Hindi, Urdu",
    status: true,
  },
];


  const actionMenuItems = [
    { label: "Edit", image: "/icons/edit.png" },
    { label: "Delete", image: '/icons/delete.png' },
    { label: "Assign to Users", image: '/icons/userIcon.png' }
  ];

 

const columns = [
  { header: "S. No.", key: "id" },
  { header: "Control Type", key: "controlType" },
  { header: "Description", key: "description" },
  { header: "Age Group", key: "ageGroup" },
  { header: "Language", key: "language" },
  {
    header: "Status",
    key: "status",
    render: (row) => <Toggle status={row.status} />,
  },
  {
    header: "Actions",
    key: "actions",
    render: (row) => (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu(openMenu === row.id ? null : row.id);
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreVertical size={18} className="text-gray-600" />
        </button>

        {openMenu === row.id && (
          <div className="fixed right-10  mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {actionMenuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  console.log(item.label, "clicked for", row.controlType);
                  setOpenMenu(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <img src={item?.image} alt={item?.label} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    ),
  },
];


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

export default ChildActivity;
