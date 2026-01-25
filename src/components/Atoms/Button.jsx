import React from "react";
import { ClipLoader } from "react-spinners";

const Button = ({
    type = "button",
    onClick,
    children = "Button",
    className = "",
    style = {},
    isDisable = false,
    loading = false,
    childrenClassName,
    ...rest
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisable || loading}
            className={`
                px-5 py-2 rounded-md border border-gray-300 text-white text-sm font-extrabold scale-y-125 bg-[#7038C4] 
                hover:bg-[#c0a5e8] hover:text-black
                ${isDisable || loading ? "opacity-70 cursor-not-allowed" : ""}
                ${className}
            `}
            style={style}
            {...rest}
        >
            {loading && (
                <span className="absolute left-1/2 transform -translate-x-1/2">
                    <ClipLoader color="#ffffff" size={20} />
                </span>
            )}
            <span className={`inline-block ${loading ? "opacity-0" : "opacity-100"} w-full text-text-center ${childrenClassName}`}>
                {children}
            </span>
        </button>
    );
};

export default React.memo(Button);