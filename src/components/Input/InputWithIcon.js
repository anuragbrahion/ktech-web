import { CheckCircle, XCircle } from 'lucide-react'
import React from 'react'

export const InputWithIcon = ({ icon,onClick, error, success, ...props }) => {
    return (
        <div>
            <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${error ? "text-red-500" : success ? "text-green-500" : "text-gray-400"
                    }`}>
                    {React.cloneElement(icon, { className: "h-5 w-5" })}
                </div>
                <input
                    {...props}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${error
                        ? "border-red-300 focus:ring-red-500"
                        : success
                            ? "border-green-300 focus:ring-green-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all`}
                />
                {success && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                )}
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <XCircle className="h-5 w-5 text-red-500" onClick={onClick}/>
                    </div>
                )}
            </div>
        </div>
    )
}
