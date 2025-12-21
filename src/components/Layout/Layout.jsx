import React, { Suspense,useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Header from "../Header/Header.jsx";
import AlertModal from "../Modal/AlertModal.jsx";
// import { useDispatch } from "react-redux";
// import { logout } from "../../redux/slices/AuthSlice";
import Dashboard from "../../pages/Dashboard/Dashboard.jsx";
import UserManagement from "../../pages/UserManagement/UserManagement.jsx";
import ContentManagement from "../../pages/ContentManagement/ContentManagement.jsx";
import Notification from "../../pages/Notification/Notification.jsx";
import HelpAndSupport from "../../pages/HelpAndSupport/HelpAndSupport.jsx";
import RbacManagement from "../../pages/RbacManagement/RbacManagement.jsx";
import Loader from "../Loader/Loader.jsx";
import LearningContent from "../../pages/LearningContent/LearningContent.jsx";
import Subscription from "../../pages/Subscription/Subscription.jsx";
import Report from "../../pages/Reports/Report.jsx";
import Language from "../../pages/Language/Language.jsx";
import ChildActivity from "../../pages/ChildActivity/ChildActivity.jsx";
import Setting from "../../pages/Setting/Setting.jsx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logoutFromCurrentDevice } from "../../redux/slices/AuthSlice.js";
import { removeCookie } from "../../utils/globalFunction.js";
import CreateRbac from "../../pages/RbacManagement/createRbac.jsx";
import AdminManagement from "../../pages/AdminManagement/AdminManagement.jsx";
import ChildMonitoring from "../../pages/UserManagement/ChildMonitoring/ChildMonitoring.jsx";
import ContentCategories from "../../pages/ContentManagement/ContentCategories.jsx";

function Layout() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const currentPath = location.pathname.split("/").pop();

  // const openLogout = () => {
  //   setIsOpen(true);
  // };

  // const onConfirmLogout = () => {
  //   dispatch(logout());
  // };
const onConfirmLogout = () => {
  setIsLoading(true)
    dispatch(logoutFromCurrentDevice())
      .then((res) => {
        if (!res.error) {
          removeCookie()
          window.location.href = "/login"
        } else {
          console.error("Logout from current device failed:", res.error)
        }
      }).catch((error) => {
        console.log("error", error)
        toast.error(error || "Error in Logging-Out")
      })

    // dispatch(logout())
  }
  return (
    <>
    <Loader loading={isLoading}/>
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full md:ml-10 lg:ml-72 xl:ml-72 2xl:ml:96 overflow-hidden h-screen">
        <main className="flex-1 overflow-auto lg:rounded-l-3xl lg:z-[50] w-full h-full
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track]:bg-gray-900 
          [&::-webkit-scrollbar-thumb]:bg-[#7038C4] 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-track]:rounded-full 
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
          dark:[&::-webkit-scrollbar-thumb]:bg-[#7038C4]">
          
          <Header setIsOpen={setIsOpen} open={isOpen} />
          
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/users' element={<UserManagement />} />
              <Route path='/cms' element={<ContentManagement />} />
              <Route path='/rbac' element={<RbacManagement />} />
              <Route path='/learning' element={<LearningContent />} />
              <Route path='/subscription' element={<Subscription />} />
              <Route path='/reports' element={<Report />} />
              <Route path='/child-activity' element={<ChildActivity />} />
              <Route path='/language' element={<Language />} />
              <Route path='/notifications' element={<Notification />} />
              <Route path='/support' element={<HelpAndSupport />} />
              <Route path='/setting' element={<Setting />} />
              <Route path='/rbac-create' element={<CreateRbac/>} />
              <Route path='/admin' element={<AdminManagement/>} />
              <Route path='/child-monitoring' element={<ChildMonitoring/>} />
              <Route path='/categories' element={<ContentCategories/>} />
            </Routes>
          </Suspense>
          
          <Outlet />
        </main>
      </div>
      {/* Uncomment when needed */}
      <AlertModal
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={onConfirmLogout}
        title="Logout Confirmation"
        description="Are you sure you want to log out of your account?"
        cancelLabel="Stay Logged In"
        confirmLabel="Yes, Logout"
        imageUrl="/icons/logout.png"
        imageClassName="w-10"
        isVisibleConfirmButton={true}
        isVisibleCancelButton={true}
        confirmClassNameButton="!bg-[#7038C4]"
        cancelClassNameButton="!bg-white hover:!bg-gray-200 !text-black"
      />
    </div>
    </>
  );
}

export default Layout;