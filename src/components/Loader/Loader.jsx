import React from 'react';
import { RingLoader } from 'react-spinners';

const LoadingSpinner = ({
    loading = true,
    size = 55,
    color = '#E2E8F0',
    speedMultiplier = 1,
    cssOverride = {},
    className = '',
}) => {
    return (
        <>
            {loading && (
                <div className="absolute inset-0 flex justify-center whitespace-nowrap bg-black opacity-80 items-center z-[100000]">
                    <RingLoader
                        loading={loading}
                        size={size}
                        color={color}
                        speedMultiplier={speedMultiplier}
                        cssOverride={cssOverride}
                        className={className}
                    />
                </div>
            )}
        </>
    );
};

export default React.memo(LoadingSpinner);
