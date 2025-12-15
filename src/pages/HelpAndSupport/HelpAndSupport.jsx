import React, { useState } from 'react'
import { AddButton, FilterButton } from '../../components/Atoms/buttons/AllButtons';
import { MoreVertical, Paperclip } from 'lucide-react';
import StatusBadge from '../../components/Atoms/badge/StatusBadge';
import Table from '../../components/Atoms/Table';
import Pagination from '../../components/Pagination/Pagination';
import SearchInput from '../../components/SearchInput/SearchInput';
import TableData from '../../components/Atoms/Table';

const HelpAndSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tableData = [
    {
      id: 1,
      title: 'Baby Shark',
      message: 'Testing Custom Notification from admin',
      attachment: null,
      createdBy: 'Alan Walker',
      status: 'Approved'
    },
    {
      id: 2,
      title: 'Tom & Jerry Compilation',
      message: 'Testing Custom Notification from admin',
      attachment: null,
      createdBy: 'Alan Walker',
      status: 'Approved'
    },
    {
      id: 3,
      title: 'Alan Walker - Faded',
      message: 'Testing Custom Notification from admin',
      attachment: true,
      createdBy: 'Alan Walker',
      status: 'Pending'
    },
    {
      id: 4,
      title: 'Jennifer Lopez - Brave',
      message: 'Testing Custom Notification from admin',
      attachment: null,
      createdBy: 'Alan Walker',
      status: 'Approved'
    },
    {
      id: 5,
      title: 'Baby Shark (Remix)',
      message: 'Testing Custom Notification from admin',
      attachment: null,
      createdBy: 'Alan Walker',
      status: 'Approved'
    }
  ];

  const filteredData = tableData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'S. No.', key: 'id', render: (row, index) => index + 1 },
    { header: 'Title', key: 'title' },
    { header: 'Message', key: 'message' },
    {
      header: 'Attachment',
      key: 'attachment',
      render: (row) => row.attachment ? (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
          <Paperclip size={16} className="text-gray-600" />
        </div>
      ) : (
        <span className="text-gray-400">N/A</span>
      )
    },
    { header: 'Created By', key: 'createdBy' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical size={18} className="text-gray-600" />
        </button>
      )
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8">

      <div className="border rounded-xl p-5">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          {/* Action Buttons */}
          <div className="flex md:items-center sm:flex-row flex-col w-full sm:justify-between justify-start gap-3">
            <div>
              <SearchInput />
            </div>
            <div className='flex justify-start gap-2'>
              <FilterButton onClick={() => console.log('Filter clicked')} />
            </div>
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
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default HelpAndSupport