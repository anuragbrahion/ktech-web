import React from "react";
import { ClipLoader } from "react-spinners";

const ButtonModalSubmit = ({
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
            className={`
                relative
                px-3 py-2
                sm:px-4
                text-sm 
                inline-flex items-center justify-start
                gap-1
                font-semibold
                rounded-[40px]
                border-none
                focus:outline-none
                transition-colors duration-200
                
                ${isDisable || loading 
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                    : "bg-black text-white"
                }
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
            <span className={`inline-block ${loading ? "opacity-0" : "opacity-100"} w-full text-left`}>
                {children}
            </span>
        </button>
    );
};

export default React.memo(ButtonModalSubmit);