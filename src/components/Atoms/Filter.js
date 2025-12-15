import React, { useState } from 'react';
import { FiCalendar, FiX, FiChevronDown } from 'react-icons/fi';

const CustomDateRangePicker = ({ onApply, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleApply = () => {
        if (startDate && endDate) {
            onApply({ startDate, endDate });
        }
    };

    return (
        <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-xs">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800">Custom</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <FiX />
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">From</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">To</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

// Example usage in your main component
const DateFilterButton = () => {
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [dateRangeLabel, setDateRangeLabel] = useState('Today');

    const handleCustomDateApply = ({ startDate, endDate }) => {
        const formattedStart = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedEnd = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        setDateRangeLabel(`${formattedStart} - ${formattedEnd}`);
        setShowCustomPicker(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
            >
                <FiCalendar className="text-sm" />
                <span>{dateRangeLabel}</span>
                <FiChevronDown className="text-sm" />
            </button>

            {showCustomPicker && (
                <CustomDateRangePicker
                    onApply={handleCustomDateApply}
                    onClose={() => setShowCustomPicker(false)}
                />
            )}
        </div>
    );
};

export default DateFilterButton