import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import sidebarData from "./Sidebar.json";
import * as Icons from "react-icons/fa";
import * as Icons2 from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { IoClose, IoChevronDown, IoChevronForward } from "react-icons/io5";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const handleClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const getIcon = (item, isActive) => {
    if (!item) return null;
    const iconName =
      isActive && item.iconActive
        ? item.iconActive
        : item.iconInActive || item.icon;
    if (!iconName) return null;

    const isImage =
      iconName.startsWith("/") ||
      /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i.test(iconName);

    if (isImage) {
      return (
        <img
          src={iconName}
          alt="icon"
          className="w-5 h-5 object-contain"
          onError={(e) => (e.target.style.display = "none")}
        />
      );
    }

    const Icon = Icons[iconName] || Icons2[iconName] || Icons["FaRegCircle"];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <>
      <div
        className={`border bg-[#7038C4] fixed top-0 left-0 h-full w-full sm:w-80 md:w-72 lg:w-64 xl:w-72 flex flex-col justify-between transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 px-4"
          }`}
      >
        {/* Header */}
        <div>
          <div className="flex flex-col mb-6 sm:mb-8">
            <div className="flex items-center justify-between lg:justify-center pt-4 sm:pt-5 lg:pt-6">
              <img
                src={sidebarData.SidebarHeader.logo}
                alt="logo"
                className="w-36 h-16 sm:w-40 sm:h-18 md:w-44 md:h-19 lg:w-48 lg:h-20 object-contain"
              />
              <IoClose
                size={28}
                color="#ffffff"
                className="lg:hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsOpen(false)}
              />
            </div>

            <div className="mt-3 sm:mt-4 flex w-full justify-center">
              <div className="w-28 sm:w-32 md:w-36 lg:w-40 xl:w-48">
                <img src="/border.png" alt="border" className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto no-scrollbar hide-scrollbar">
          <nav className="flex flex-col w-full space-y-2 sm:space-y-3 pb-4">
            {sidebarData.MENU.map((item, index) => {
              const active = location.pathname.startsWith(item.location);
              const hasChildren = item.children && item.children.length > 0;
              const isOpenMenu = openMenus[item.label];

              return (
                <div key={index}>
                  <div
                    onClick={() =>
                      hasChildren ? toggleMenu(item.label) : handleClick(item.location)
                    }
                    className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-all ${active
                        ? "bg-white text-purple-700 font-semibold"
                        : "text-white/80 bg-[#E2DEF90A] hover:text-white hover:bg-[#E2DEF915]"
                      }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {getIcon(item, active)}
                      <span className="text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.label}
                      </span>
                    </div>

                    {hasChildren &&
                      (isOpenMenu ? (
                        <IoChevronDown size={16} />
                      ) : (
                        <IoChevronForward size={16} />
                      ))}
                  </div>

                  {hasChildren && isOpenMenu && (
                    <div className="ml-10 mt-1 flex flex-col space-y-1">
                      {item.children.map((child, i) => {
                        const childActive = location.pathname === child.location;
                        return (
                          <div
                            key={i}
                            onClick={() => handleClick(child.location)}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-all ${childActive
                                ? "bg-white text-purple-700 font-medium"
                                : "text-white/70 hover:text-white hover:bg-[#E2DEF915]"
                              }`}
                          >
                            {child.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pb-4 sm:pb-6">
          <div
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-all text-white/80 bg-[#E2DEF90A] hover:text-white hover:bg-[#E2DEF915]"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-sm sm:text-base">Logout</span>
          </div>
        </div>
      </div>


      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
