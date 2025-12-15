import React, { useState } from "react";
import {
  AddButton,
  FilterButton,
} from "../../components/Atoms/buttons/AllButtons";
import { MoreVertical, Paperclip } from "lucide-react";
import StatusBadge from "../../components/Atoms/badge/StatusBadge";
import Table from "../../components/Atoms/Table";
import Pagination from "../../components/Pagination/Pagination";
import SearchInput from "../../components/SearchInput/SearchInput";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import Button from "../../components/Atoms/Button";
import Input from "../../components/Input/Input";
import Dropdown from "../../components/DropDown";
import Textarea from "../../components/Input/Textarea";
import ImageUpload from "../../components/Atoms/image/ImageUpload";
import TableData from "../../components/Atoms/Table";

const Notification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState();

  const tableData = [
    {
      id: 1,
      title: "Baby Shark",
      message: "Testing Custom Notification from admin",
      attachment: null,
      createdBy: "Alan Walker",
      status: "Approved",
    },
    {
      id: 2,
      title: "Tom & Jerry Compilation",
      message: "Testing Custom Notification from admin",
      attachment: null,
      createdBy: "Alan Walker",
      status: "Approved",
    },
    {
      id: 3,
      title: "Alan Walker - Faded",
      message: "Testing Custom Notification from admin",
      attachment: true,
      createdBy: "Alan Walker",
      status: "Pending",
    },
    {
      id: 4,
      title: "Jennifer Lopez - Brave",
      message: "Testing Custom Notification from admin",
      attachment: null,
      createdBy: "Alan Walker",
      status: "Approved",
    },
    {
      id: 5,
      title: "Baby Shark (Remix)",
      message: "Testing Custom Notification from admin",
      attachment: null,
      createdBy: "Alan Walker",
      status: "Approved",
    },
  ];

  const filteredData = tableData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "S. No.", key: "id", render: (row, index) => index + 1 },
    { header: "Title", key: "title" },
    { header: "Message", key: "message" },
    {
      header: "Attachment",
      key: "attachment",
      render: (row) =>
        row.attachment ? (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
            <Paperclip size={16} className="text-gray-600" />
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
    { header: "Created By", key: "createdBy" },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical size={18} className="text-gray-600" />
        </button>
      ),
    },
  ];

  const onClose = () => {
    setIsOpenModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="border rounded-xl p-5">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Action Buttons */}
          <div className="flex sm:flex-row flex-col md:items-center w-full justify-between gap-3">
            <div>
              <SearchInput />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FilterButton onClick={() => console.log("Filter clicked")} />
              <AddButton onClick={() => setIsOpenModal(true)} />
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

        <DefaultPreviewModal
          isOpen={isOpenModal}
          heading="Add Notification"
          closeModal={onClose}
        >
          <div className="grid  sm:grid-cols-2 grid-cols-1 gap-4 ">
            <Input label="Title" placeholder="Carlos Carlton" required />

            <Dropdown
              label="Users"
              options={[
                { value: "", label: "Select a user" },
                { value: "parent", label: "Parent" },
                { value: "child", label: "Child" },
                { value: "admin", label: "Admin" },
              ]}
              showSelectAll={true}
            />
          </div>
          <div className="mt-2">
            <Textarea label="Message" placeholder="Enter Message..." />
          </div>

          <div className="mt-2">
            <Dropdown
              label="Attachment Type"
              options={[
                { value: "", label: "Select a user" },
                { value: "image", label: "Image" },
              ]}
            />
          </div>

          <div className="w-full mb-3">
            <ImageUpload
              // file={invoiceDetails.invoice_file}
              // onChange={(e) => handleFileUpload(e, 'invoice_file')}
              // onRemove={() => handleRemove('invoice_file')}
              // maxFileSize={maxFileSize}
              // previewClassName="!h-20"
              // allowedTypes={allowedTypes}
              // errorMessage={errors.invoice_file}
              label=""
              name="invoice_file"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-6 gap-4">
            <Button className="!bg-white !text-black hover:!bg-gray-200" onClick={onClose}>Cancel</Button>
            <Button className="base-bg-color text-white font-extrabold">Submit</Button>
          </div>
        </DefaultPreviewModal>
      </div>
    </div>
  );
};

export default Notification;
