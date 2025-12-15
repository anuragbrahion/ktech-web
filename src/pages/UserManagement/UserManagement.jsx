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
import DefaultPreviewModal from "../../components/Modal/DefaultModal.jsx";
import Input from "../../components/Input/Input.jsx";
import Dropdown from "../../components/DropDown.jsx";
import Button from "../../components/Atoms/Button.jsx";
import SearchInput from "../../components/SearchInput/SearchInput.jsx";
import TableData from "../../components/Atoms/Table.jsx";

const UserManagement = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const tableData = [
    {
      id: 1,
      name: "Carlos Carlton",
      email: "olex@email.com",
      subscriptionPlan: "Premium",
      lastLogin: "2025-10-05",
      registrationDate: "2025-10-05",
      linkedProfiles: 2,
      status: "Active",
    },
    {
      id: 2,
      name: "Carlos Carlton",
      email: "olex@email.com",
      subscriptionPlan: "Basic",
      lastLogin: "2025-10-05",
      registrationDate: "2025-10-05",
      linkedProfiles: 2,
      status: "Active",
    },
    {
      id: 3,
      name: "Carlos Carlton",
      email: "olex@email.com",
      subscriptionPlan: "Free",
      lastLogin: "2025-10-05",
      registrationDate: "2025-10-05",
      linkedProfiles: 2,
      status: "Inactive",
    },
    {
      id: 4,
      name: "Carlos Carlton",
      email: "olex@email.com",
      subscriptionPlan: "Basic",
      lastLogin: "2025-10-05",
      registrationDate: "2025-10-05",
      linkedProfiles: 2,
      status: "Active",
    },
    {
      id: 5,
      name: "Carlos Carlton",
      email: "olex@email.com",
      subscriptionPlan: "Premium",
      lastLogin: "2025-10-05",
      registrationDate: "2025-10-05",
      linkedProfiles: 2,
      status: "Active",
    },
  ];

  const columns = [
    { header: "S. No.", key: "id", render: (row, index) => index + 1 },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Subscription Plan", key: "subscriptionPlan" },
    { header: "Last Login", key: "lastLogin" },
    { header: "Registration Date", key: "registrationDate" },
    { header: "Linked Profiles", key: "linkedProfiles" },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    // {
    //   header: "Actions",
    //   key: "actions",
    //   render: (row) => (
    //     <button className="p-1 hover:bg-gray-100 rounded transition-colors">
    //       <MoreVertical size={18} className="text-gray-600" />
    //     </button>
    //   ),
    // },
  ];


  //  const childTableData = [
  //   {
  //     id: 1,
  //     name: "Emma Carlton",
  //     age: "5 Years",
  //     gender: "Female",
  //     linkedParent: "Carlos Carlton",
  //     screenTime: "1h 20m/day",
  //     favorites: "Educational Videos",
  //     learningProgress: "75%",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Oliver Lewis",
  //     age: "4 Years",
  //     gender: "Male",
  //     linkedParent: "Linda Lewis",
  //     screenTime: "45m/day",
  //     favorites: "Games",
  //     learningProgress: "62%",
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  //     name: "Sophia Fox",
  //     age: "6 Years",
  //     gender: "Female",
  //     linkedParent: "Robert Fox",
  //     screenTime: "30m/day",
  //     favorites: "Storytelling",
  //     learningProgress: "48%",
  //     status: "Inactive",
  //   },
  // ];

  // const childColumns = [
  //   { header: "S. No.", key: "id", render: (_, index) => index + 1 },
  //   { header: "Name", key: "name" },
  //   { header: "Age", key: "age" },
  //   { header: "Gender", key: "gender" },
  //   { header: "Linked Parent", key: "linkedParent" },
  //   { header: "Screen Time", key: "screenTime" },
  //   { header: "Favorites", key: "favorites" },
  //   { header: "Learning Progress", key: "learningProgress" },
  //   {
  //     header: "Status",
  //     key: "status",
  //     render: (row) => <StatusBadge status={row.status} />,
  //   },
  //   {
  //     header: "Actions",
  //     key: "actions",
  //     render: () => (
  //       <button className="p-1 hover:bg-gray-100 rounded transition-colors">
  //         <MoreVertical size={18} className="text-gray-600" />
  //       </button>
  //     ),
  //   },
  // ];

  const onClose = () => {
    setIsOpenModal(false)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="border rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>

          <SearchInput/>
          </div>
          <div className="flex gap-3">
            <FilterButton onClick={() => console.log("Filter clicked")} />
            <AddButton onClick={() => setIsOpenModal(true)} text="Add New"/>
          </div>
        </div>
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

      <DefaultPreviewModal isOpen={isOpenModal} heading="Add User" closeModal={onClose}>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 ">
          
          <Input label="Full Name" placeholder="Carlos Carlton" required />

          <Dropdown
          label="User Type"
            options={[
              { value: "", label: "Parent / Child / Admin" },
              { value: "parent", label: "Parent" },
              { value: "child", label: "Child" },
              { value: "admin", label: "Admin" },
            ]}
          />

          <Input label="Phone Number" placeholder="+1 202 555 0148" />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@email.com"
          />

          <Dropdown
          label="Language Preference"
            options={[
              { value: "", label: "English / French / Spanish / Hausa" },
              { value: "english", label: "English" },
              { value: "french", label: "French" },
              { value: "spanish", label: "Spanish" },
              { value: "hausa", label: "Hausa" },
            ]}
          />

          <Dropdown
          label="Gender"
            options={[
              { value: "", label: "Male / Female / Prefer not to say" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "na", label: "Prefer not to say" },
            ]}
          />

          <Dropdown
          label="Subscription Plan"
            options={[
              { value: "", label: "Free / Basic / Premium" },
              { value: "free", label: "Free" },
              { value: "basic", label: "Basic" },
              { value: "premium", label: "Premium" },
            ]}
          />

          <Input label="Linked Profiles" placeholder="2" />

          <Input label="Password" type="password" placeholder="Password" />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end mt-6 gap-4">
            <Button className="!bg-white !text-black hover:!bg-gray-200" onClick={onClose}>Cancel</Button>
            <Button className="base-bg-color text-white font-extrabold">
              Submit
           </Button>
          </div>
      </DefaultPreviewModal>
    </div>
  );
};

export default UserManagement;
