/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  User,
  BookOpen,
  MessageCircle,
  Store,
  Book,
  RefreshCw,
  Cake,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboard } from "../../redux/slices/AdminSlice";
import Loader from "../../components/Loader/Loader";
import { formatDateForTable } from "../../utils/globalFunction";

const Dashboard = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.admin);

  const loading = selector?.loading; // make sure redux has this

  const dashboardData = selector?.getAdminDashboardData?.data?.data || {};

  const {
    studentCount = 0,
    teacherCount = 0,
    admissionsCount = 0,
    inquiriesCount = 0,
    todayBirthdays = [],
    upcomingBirthdays = [],
    lastRefreshedAt = new Date(),
  } = dashboardData;

  const stats = [
    {
      label: "TOTAL ADMISSIONS",
      value: admissionsCount,
      icon: User,
      color: "from-blue-600 to-blue-400",
    },
    {
      label: "TOTAL ENQUIRIES",
      value: inquiriesCount,
      icon: MessageCircle,
      color: "from-cyan-600 to-cyan-400",
    },
    {
      label: "TOTAL STUDENTS",
      value: studentCount,
      icon: Store,
      color: "from-indigo-600 to-indigo-400",
    },
    {
      label: "TOTAL TEACHERS",
      value: teacherCount,
      icon: Book,
      color: "from-sky-600 to-sky-400",
    },
  ];

  useEffect(() => {
    dispatch(getAdminDashboard());
  }, [dispatch]);

  /* 🔄 HANDLE REFRESH */
  const handleRefresh = () => {
    dispatch(getAdminDashboard());
  };

  /* 🕒 FORMAT TIME */

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {/* LOADER */}
      <Loader loading={loading} />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#303d63] via-[#82aec2] to-[#0ea5e9] rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-sm md:text-lg text-blue-100">
          Here's what's happening with your institution today
        </p>

        {/* LAST UPDATED */}
        <div className="mt-6 flex items-center justify-end gap-4">
          <div className="text-right">
            <p className="text-xs text-blue-200">Last Updated</p>
            <p className="text-lg font-semibold">
              {formatDateForTable(lastRefreshedAt)}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="bg-white/20 p-3 rounded-xl hover:bg-white/30 transition"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-6 h-6 text-[#0f172a]" />
        <h2 className="font-bold text-gray-800">Overview Statistics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {value || 0}
                </p>
              </div>

              <div className={`bg-gradient-to-br ${color} p-3 rounded-xl`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TODAY BIRTHDAYS */}
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
          <Cake className="w-5 h-5 text-pink-500" />
          Today's Birthdays
        </h2>

        {todayBirthdays?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {todayBirthdays.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <img
                  src={
                    item?.profilephoto?.url || "https://via.placeholder.com/50"
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{item?.name || "N/A"}</p>
                  <p className="text-sm text-gray-500">
                    {item?.email || "No Email"}
                  </p>
                  <p className="text-xs text-gray-400">{item?.role || ""}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No birthdays today 🎉</p>
        )}
      </div>

      {/* UPCOMING BIRTHDAYS */}
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
          <Cake className="w-5 h-5 text-blue-500" />
          Upcoming Birthdays
        </h2>

        {upcomingBirthdays?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingBirthdays.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <img
                  src={
                    item?.profilephoto?.url || "https://via.placeholder.com/50"
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{item?.name || "N/A"}</p>
                  <p className="text-sm text-gray-500">
                    {item?.email || "No Email"}
                  </p>
                  <p className="text-xs text-gray-400">{item?.role || ""}</p>
                  <p className="text-xs text-blue-500">
                    {item?.nextBirthday
                      ? new Date(item.nextBirthday).toDateString()
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No upcoming birthdays 📅</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
