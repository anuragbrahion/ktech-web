import React from "react";

const ViewContractorListModal = ({ isOpen, onClose, data = {}, fields = {} }) => {
    if (!isOpen) return null;
    console.log("dttaa",data)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Modal Content */}
                <div className="p-4 md:p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Contractor Details</h2>
                    
                    {/* Data */}
                    <div className="space-y-3 text-sm text-gray-800">
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dotted border-gray-300 py-2">
                            <span className="text-gray-700 font-bold">Firm Bank Name:</span>
                            <span className="text-gray-900 sm:text-right font-bold">{data.firmBankName || "-"}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dotted border-gray-300 py-2">
                            <span className="text-gray-700 font-bold">Firm Name:</span>
                            <span className="text-gray-900 sm:text-right font-bold">{data.firmName || "-"}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between border-b border-dotted border-gray-300 py-2">
                            <span className="text-gray-700 font-bold">GST Number:</span>
                            <span className="text-gray-900 sm:text-right font-bold">{data.firmGSTIN || "-"}</span>
                        </div>
                         <div className="flex flex-col sm:flex-row justify-between border-b border-dotted border-gray-300 py-2">
                            <span className="text-gray-700 font-bold">Mobile Number:</span>
                            <span className="text-gray-900 sm:text-right font-bold">{data.firmMobile || "-"}</span>
                        </div>
                        
                        {/* Add more fields as needed */}
                        {Object.entries(fields).map(([key, label]) => (
                            <div key={key} className="flex flex-col sm:flex-row justify-between border-b border-dotted border-gray-300 py-2">
                                <span className="text-gray-700 font-semibold">{label}:</span>
                                <span className="text-gray-900 sm:text-right">{data[key] || "-"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewContractorListModal;