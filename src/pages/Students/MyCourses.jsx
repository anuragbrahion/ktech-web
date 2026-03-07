/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { Eye } from "lucide-react";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import { getStudentCoursesList } from "../../redux/slices/studentSlice";

const MyCourses = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [viewModalData, setViewModalData] = useState({
    isOpen: false,
    data: null,
  });

  const getStudentCoursesListData = useSelector(
    (state) => state.student?.getStudentCoursesListData,
  );
  const resultList = getStudentCoursesListData?.data?.data?.list || [];
  const totalCount = getStudentCoursesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = ["Name", "Fees", "Action"];

  const fetchMyCourses = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getStudentCoursesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch tasks list");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMyCourses();
  }, [currentPage, itemsPerPage]);

  const tableData = useMemo(() => {
    return resultList.map((item) => [
      <span className="capitalize">{item.course.courseName}</span>,
      item.course.sellingPrice,
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewModalData({ isOpen: true, data: item })}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>,
    ]);
  }, [resultList]);

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Manage your enrolled courses</p>
      </div>

      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalCount}
        totalPages={totalPages}
        renderRow={(row, index) => (
          <tr
            key={index}
            className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-4 px-4">
                {cell}
              </td>
            ))}
          </tr>
        )}
      />

      <DefaultPreviewModal
        isOpen={viewModalData.isOpen}
        closeModal={() => setViewModalData({ isOpen: false, data: null })}
        heading="View Course"
        showCancelButton={false}
        showSubmitButton={false}
      >
        <div className="space-y-6">
          {viewModalData.data && (
            <>
              {/* Course Highlight */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-blue-700 capitalize">
                    {viewModalData.data.course.courseName}
                  </p>
                  <p className="text-green-600 font-semibold">
                    ₹{viewModalData.data.course.sellingPrice}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">
                      {viewModalData.data.course.duration} Months
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Lectures</p>
                    <p className="font-medium">
                      {viewModalData.data.course.totalLectures}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Actual Price</p>
                    <p className="font-medium line-through text-gray-400">
                      ₹{viewModalData.data.course.actualPrice}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Description</p>
                    <p className="font-medium">
                      {viewModalData.data.course.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admission Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Roll No</p>
                  <p className="font-medium">{viewModalData.data.rollNo}</p>
                </div>

                <div>
                  <p className="text-gray-500">Admission Type</p>
                  <p className="font-medium">{viewModalData.data.type}</p>
                </div>

                <div>
                  <p className="text-gray-500">Admission Date</p>
                  <p className="font-medium">
                    {formatDateForTable(viewModalData.data.admissionDate)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DefaultPreviewModal>
    </>
  );
};

export default MyCourses;
