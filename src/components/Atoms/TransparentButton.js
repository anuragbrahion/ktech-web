import React from "react";
import { ClipLoader } from "react-spinners";
 
const TransparentButton = ({
    type = "button",
    onClick,
    children = "Button",
    className = "",
    style = {},
    isDisable = false,
    loading = false,
    ...rest
}) => {
 
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisable || loading}
            style={style}
            className={` px-4 py-2 !bg-[#F5F5F5] flex justify-center items-center text-[#202020] font-semibold cursor-pointer font-size:16px gap-1 rounded-md
        ${isDisable || loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
            {...rest}
        >
            {loading ? (
                <ClipLoader color="#ffffff" size={20} />
            ) : (
                children
            )}
        </button>
    );
};
 
export default React.memo(TransparentButton);