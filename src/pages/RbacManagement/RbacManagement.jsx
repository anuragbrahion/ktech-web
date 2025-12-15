import React, { useEffect, useState } from 'react'
import TableData from '../../components/Atoms/Table.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { editAdminRole, getAdminRoleList } from '../../redux/slices/AdminSlice.js'
import { formatDateForDisplay } from '../../utils/globalFunction.js'
import EditIcon from '../../components/Icons/EditIcon.jsx'
import DeleteIcon from '../../components/Icons/DeleteIcon.jsx'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Atoms/Button.jsx'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const RbacManagement = () => {
  const dispatch = useDispatch()
  const size = 10
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
    const reqData = {
      page: currentPage,
      size: size
    }
    dispatch(getAdminRoleList(reqData))
  }, [])
  const navigate = useNavigate()
  const selector = useSelector((state) => state.admin)
  const getAdminRoleListData = selector?.getAdminRoleListData?.data?.data?.list
  const handleOpenEdit = (item) => {
    dispatch(editAdminRole({ _id: item?._id }))
      .unwrap()
      .then((res) => {
        if (res.error) {
          toast.error(res.error || "Error in editing");
          return;
        } else {
          navigate("/app/rbac-create", { state: { editData: res.data } });
        }
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error || "Error in Fetching Edit Data");
      });
  };
  const handleOpenCreate = () => {
    navigate('/app/rbac-create')
  }
  const handlePageChange = (data) => {
        setCurrentPage(data)
    }
  return (
    <>
      <div className='min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8'>
        <div className='flex justify-end mb-4'>
          <Button onClick={handleOpenCreate}>Add</Button>
        </div>
        <TableData
          tableHeadings={[
            '#',
            'Role Name',
            'Date/Time',
            'Action'
          ]}
          data={getAdminRoleListData?.map((item, index) => [
            <span key={`sno-${index}`}>{((currentPage - 1) * size) + (index + 1)}</span>,
            <span key={`key-${item._id}`} className="capitalize">{item.name}</span>,
            <span key={`date-${item._id}`} className="capitalize">{formatDateForDisplay(item?.updatedAt)}</span>,
            <div key={`actions-${item._id}`} className="flex">
              <EditIcon onClickFunction={() => handleOpenEdit(item)} />
            </div>
          ])}
          total={selector?.feeManagementListData?.data?.data?.total}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          size={size}
        />
      </div>
    </>
  )
}

export default RbacManagement