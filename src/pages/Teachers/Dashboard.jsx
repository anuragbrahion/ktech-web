/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import LoadingSpinner from "../../components/Loader/Loader";
import { getMyDashboard } from "../../redux/slices/studentSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getMyDashboardData = useSelector(
    (state) => state.student?.getMyDashboardData,
  );

  const dashboardData = getMyDashboardData?.data?.data || {};

  // ✅ Safe Data Handling
  const safeDashboard = {
    attendance: {
      percentage: dashboardData?.attendance?.percentage ?? 0,
      Present: dashboardData?.attendance?.Present ?? 0,
      Absent: dashboardData?.attendance?.Absent ?? 0,
      Leave: dashboardData?.attendance?.Leave ?? 0,
    },
    leave: {
      Pending: dashboardData?.leave?.Pending ?? 0,
      Approved: dashboardData?.leave?.Approved ?? 0,
      Rejected: dashboardData?.leave?.Rejected ?? 0,
    },
    tasks: {
      Pending: dashboardData?.tasks?.Pending ?? 0,
      InProgress: dashboardData?.tasks?.["In-Progress"] ?? 0,
      Completed: dashboardData?.tasks?.Completed ?? 0,
    },
    isBirthday: dashboardData?.isBirthday ?? false,
    birthdayMessage: dashboardData?.birthdayMessage ?? "No Events",
    lastRefreshedAt: dashboardData?.lastRefreshedAt ?? null,
  };

  const fetchDashboard = async () => {
    setLoading(true);

    const res = await dispatch(getMyDashboard());

    if (res.error) {
      toast.error(res.payload || "Failed to fetch dashboard");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <>
      <LoadingSpinner loading={loading} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of your performance and tasks
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Attendance</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {safeDashboard.attendance.percentage}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            P: {safeDashboard.attendance.Present} | A:{" "}
            {safeDashboard.attendance.Absent} | L:{" "}
            {safeDashboard.attendance.Leave}
          </p>
        </div>

        {/* Leaves */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Leaves</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {safeDashboard.leave.Pending}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Approved: {safeDashboard.leave.Approved} | Rejected:{" "}
            {safeDashboard.leave.Rejected}
          </p>
        </div>

        {/* Tasks */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Tasks</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {safeDashboard.tasks.Pending}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            In-Progress: {safeDashboard.tasks.InProgress} | Done:{" "}
            {safeDashboard.tasks.Completed}
          </p>
        </div>

        {/* Today / Birthday */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-sm font-semibold text-pink-500 mt-2">
            {safeDashboard.isBirthday
              ? safeDashboard.birthdayMessage
              : "No Events"}
          </p>
        </div>
      </div>

      {/* Optional Footer Info */}
      {safeDashboard.lastRefreshedAt && (
        <div className="text-xs text-gray-400 text-right">
          Last updated:{" "}
          {new Date(safeDashboard.lastRefreshedAt).toLocaleString()}
        </div>
      )}
    </>
  );
};

export default Dashboard;