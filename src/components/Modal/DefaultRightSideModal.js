import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import Button from "../Atoms/Button";
import TransparentButtonCopy from "../Atoms/TransparentButton copy";
import { BackButton } from "../Atoms/buttons/AllButtons";
import ButtonModalSubmit from "../Atoms/buttons/ButtonModalSubmit";

const DefaultModal = ({
    isOpen = false,
    onClose,
    onSubmit,
    children,
    isButtonView = true,
    submitButtonText = "Submit",
    closeButtonText = "Reset",
    title,
    titleClassName = '',
    width = "400px" // Add default width prop
}) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Don't render anything if modal is not open
    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div
                className={`
                    fixed inset-0 z-50 bg-white shadow-xl text-sm
                    md:inset-auto md:right-0 md:top-0 md:h-full
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
                style={{
                    width: window.innerWidth >= 768 ? width : '100%',
                    maxWidth: '100vw'
                }}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-4 sm:px-6 py-1 sm:py-4 border-b border-gray-200">
                    <h2 className={`text-lg sm:text-xl font-semibold text-gray-800 ${titleClassName}`}>
                        {title}
                    </h2>
                    <div className="pt-2">
                        <BackButton
                            onClick={onClose}
                            label={closeButtonText}
                            className="flex-1 sm:flex-none"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-120px)] overflow-y-auto p-4 sm:p-6">
                    {children}
                </div>

                {isButtonView && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white p-3 sm:p-4 flex justify-end items-center border-t border-gray-200 gap-2">
                        <ButtonModalSubmit
                            onClick={onSubmit}
                            className="flex-1 sm:flex-none"
                        >
                            {submitButtonText}
                        </ButtonModalSubmit>
                    </div>
                )}
            </div>
        </>
    );
};

export default DefaultModal;