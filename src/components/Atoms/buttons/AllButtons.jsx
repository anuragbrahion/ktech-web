import React from 'react'
import { FiPlus } from 'react-icons/fi';
import { TbFileExport } from "react-icons/tb";
import { GrPowerCycle } from "react-icons/gr";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { ChevronDown, Filter, Plus } from 'lucide-react';
import { BiExport } from 'react-icons/bi';
import { FaFileExport } from 'react-icons/fa';



const baseButtonClasses = "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold  sm:px-4"

const ResetButton = ({label = 'Reset', onClick}) => {
  return (
    <button className={`${baseButtonClasses} bg-[#F9F7ED] text-black`} onClick={onClick}>
      <GrPowerCycle size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const ExportButton = ({label = 'Export', onClick}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-3xl bg-[#7038C4] text-white   transition-colors"
    >
      <FaFileExport size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

const AddButton = ({ onClick, text = "Add" }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-1 rounded-3xl bg-[#7038C4] text-white transition-colors"
    >
      <Plus size={18} />
      <span className="font-medium ">{text}</span>
    </button>
  );
};

const BackButton = ({label = 'Back', onClick}) => {
  return (
    <button
  className="flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold bg-[#A7AEFF] text-white"
  onClick={onClick}
>
  <MdOutlineKeyboardArrowLeft size={18} className="shrink-0" />
  <span className="hidden sm:inline">{label}</span>
</button>

  );

};
const FilterButton = ({ onClick }) => {
return (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 border border-[#7038C4] rounded-3xl bg-white hover:bg-gray-50 transition-colors"
  >
    <Filter size={18} />
    <span className="font-medium">Filter</span>
    <ChevronDown size={16} />
  </button>
);
}

export {ResetButton, ExportButton, AddButton, BackButton, FilterButton}