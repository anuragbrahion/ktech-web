

import React from "react"

const AuthLayout = ({ children }) => {
    return (
        <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 sm:bg-gray-100 bg-white">
            <div className="lg:block hidden h-screen w-full">
                <img
                    src="/AuthImg/Login/image.png"
                    alt="auth"
                    className="h-full w-full object-cover"
                />
            </div>
            {children}
        </div>
    )
}

export default React.memo(AuthLayout);
