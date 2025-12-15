import React from 'react'

const ViewIcon = ({ tooltip = "", onClickFunction }) => {
    return (
        <div className="group relative">
            <div
                className="relative flex items-center justify-center w-8 h-8 rounded cursor-pointer"
                onClick={onClickFunction}
            >
                <div className="w-8 h-8 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"  // reduced from 30
                        height="22" // reduced from 30
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-eye"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                    </svg>
                </div>
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200">
                {tooltip}
            </div>
        </div>
    )
}

export default ViewIcon
