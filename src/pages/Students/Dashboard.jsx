/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import {
  getMyDashboard,
  getStudentOverview,
} from "../../redux/slices/studentSlice";

function AdmissionCard({ item }) {
  const isNew = item?.type === "New-Admission";
  const formattedDate = item?.admissionDate
    ? formatDateForTable(item.admissionDate)
    : "-";

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 overflow-hidden">
      <div className="h-1 w-full bg-green-500" />

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isNew
                ? "bg-green-100 text-green-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {item?.type ?? "-"}
          </span>
          <span className="text-xs font-mono text-gray-400">
            {item?.rollNo ?? "-"}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Course</p>
            <p className="text-sm font-semibold text-gray-800 capitalize leading-snug">
              {item?.course?.courseName ?? "N/A"}
            </p>
          </div>
        </div>

        <div className="border-t border-green-50 mb-4" />

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <span>
            Admitted on{" "}
            <span className="font-medium text-gray-700">
              {formattedDate}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getStudentOverviewData = useSelector(
    (state) => state.student?.getStudentOverviewData,
  );

  const getMyDashboardData = useSelector(
    (state) => state.student?.getMyDashboardData,
  );

  const overviewData = getStudentOverviewData?.data?.data || [];
  const dashboardData = getMyDashboardData?.data?.data || {};

  // ✅ Safe Dashboard Object
  const safeDashboard = {
    attendance: {
      percentage: dashboardData?.attendance?.percentage ?? 0,
      Present: dashboardData?.attendance?.Present ?? 0,
      Absent: dashboardData?.attendance?.Absent ?? 0,
    },
    leave: {
      Pending: dashboardData?.leave?.Pending ?? 0,
      Approved: dashboardData?.leave?.Approved ?? 0,
    },
    totalAdmissions: dashboardData?.totalAdmissions ?? 0,
    isBirthday: dashboardData?.isBirthday ?? false,
    birthdayMessage: dashboardData?.birthdayMessage ?? "No Events",
  };

  const fetchOverview = async () => {
    setLoading(true);

    const [overviewRes, dashboardRes] = await Promise.all([
      dispatch(getStudentOverview()),
      dispatch(getMyDashboard()),
    ]);

    if (overviewRes.error) {
      toast.error(overviewRes.payload || "Failed to fetch overview");
    }

    if (dashboardRes.error) {
      toast.error(dashboardRes.payload || "Failed to fetch dashboard");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <>
      <LoadingSpinner loading={loading} />

      {/* Dashboard UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Attendance</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {safeDashboard.attendance.percentage}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            P: {safeDashboard.attendance.Present} | A:{" "}
            {safeDashboard.attendance.Absent}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Leaves</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {safeDashboard.leave.Pending}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Approved: {safeDashboard.leave.Approved}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Admissions</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {safeDashboard.totalAdmissions}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-sm font-semibold text-pink-500 mt-2">
            {safeDashboard.isBirthday
              ? safeDashboard.birthdayMessage
              : "No Events"}
          </p>
        </div>
      </div>

      {/* Existing UI */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600 mt-2">View your all admissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {overviewData.map((item) => (
          <AdmissionCard key={item?._id || Math.random()} item={item} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;