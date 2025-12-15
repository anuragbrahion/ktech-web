import React from 'react'

const DeleteIcon = ({ tooltip = "", onClickFunction }) => {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (onClickFunction) {
            onClickFunction(e);
        }
    };

    return (
        <div className="group relative">
            <div 
                className="relative flex items-center justify-center w-8 h-8 rounded cursor-pointer text-[#F56262]" 
                onClick={handleClick}
            >
                <div className="w-5 h-5 flex items-center justify-center">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                </div>
            </div>
            {tooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200">
                    {tooltip}
                </div>
            )}
        </div>
    )
}

export default DeleteIcon