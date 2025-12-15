/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import Select from 'react-select'
import Button from '../Atoms/Button'
import ImageUpload from '../Image/ImageUpload'

function CreateForm({ onClose, confirmButtonAction, heading, desc, fields = [], initialForm = {}, showButton, handleAdd, buttonClassName = "", buttonName, formClassName = "", errors, setErrors, formData, setFormData, handleFileUpload = null, handleRemove = null, maxFileSize, allowedTypes }) {
    useEffect(() => {
        const initialForm = {}
        fields.forEach((field) => {
            if (field.show) {
                initialForm[field.name] = field.isMulti ? [] : ''
            }
        })
        setFormData(initialForm)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        const regex = /^(?:[1-9][0-9]{0,3}|0)?$/;
        const isValidNumber = regex.test(value);

        if (name === "name") {
            const nameRegex = /^[A-Za-z0-9\- ]{0,50}$/;
            if (nameRegex.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
                setErrors((prev) => ({ ...prev, [name]: '' }));
            }
        } else if (name === "seat" || name === "pricePerHour") {
            if (isValidNumber) {
                const numValue = value === "" ? "" : parseInt(value, 10);
                if (numValue === "" || (numValue >= 0 && numValue <= 9999)) {
                    setFormData((prev) => ({ ...prev, [name]: value }));
                    setErrors((prev) => ({ ...prev, [name]: '' }));
                }
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }


    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {};

        fields.forEach((field) => {
            if (!field.show || !field.required) return;

            const value = formData[field.name];
            const trimmedValue = typeof value === 'string' ? value.trim() : value
            if (field.isMulti && (!value || value.length === 0)) {
                newErrors[field.name] = `Valid ${field.label} is required`;
                return;
            }

            if ((field.type === 'select' || field.type === 'multiselect') && !value) {
                newErrors[field.name] = `${field.label} is required`;
                return;
            }

            if (!value || (typeof value === 'string' && trimmedValue === '')) {
                newErrors[field.name] = `${field.label} is required`;
                return;
            }

            if (field.name === 'name') {
                const nameRegex = /^[a-zA-Z][a-zA-Z0-9]*(?:[-/][a-zA-Z0-9]+)*$/;

                if (trimmedValue.length > 50) {
                    newErrors.name = 'Name cannot exceed 50 characters';
                } else if (/^[0-9]/.test(trimmedValue)) {
                    newErrors.name = 'Enter a valid Name';
                } else if (/^[^a-zA-Z]/.test(trimmedValue)) {
                    newErrors.name = 'Name must start with a letter';
                } else if (!nameRegex.test(trimmedValue)) {
                    newErrors.name = 'Only hyphens (-) and are allowed at between';
                } else if (/[-/]$/.test(trimmedValue)) {
                    newErrors.name = 'Name cannot end with -';
                } else if (/[^a-zA-Z0-9-/]/.test(trimmedValue)) {
                    newErrors.name = 'Special characters are not allowed (except - and /)';
                }
            }
            // Existing URL validation
            if (field.type === 'url') {
                const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
                if (!urlPattern.test(trimmedValue)) {
                    newErrors[field.name] = 'Please enter a valid URL';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (!validate()) return

        const processedForm = { ...formData }
        fields.forEach((field) => {
            if (field.isMulti) {
                processedForm[field.name] = (formData[field.name] || []).map((opt) => opt.value)
            } else if (field.type === 'select') {
                processedForm[field.name] = formData[field.name]?.value || ''
            }
        })

        confirmButtonAction(processedForm)
    }

    //   if (!isOpen) return null

    return (
        <div className=''>
            <div className=''>
                {desc && <p className='text-gray-600 mb-4'>{desc}</p>}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4'>
                    {heading && <h2 className='text-xl font-semibold text-black my-2'>{heading}</h2>}
                    {showButton && <Button onClick={handleAdd} className='w-30'>{buttonName}</Button>}

                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 ${formClassName}`}>
                    {fields.map((field) => {
                        if (!field.show) return null;
                        return (
                            <div key={field.name}>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>

                                {field.type === 'select' || field.type === 'multiselect' ? (
                                    <Select
                                        isMulti={field.isMulti}
                                        options={field.options}
                                        value={formData[field.name]}
                                        className={`${field.className}`}
                                        onChange={(selected) => handleSelectChange(field.name, selected)}
                                        placeholder={field.placeholder || 'Select...'}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        placeholder={field.placeholder || ''}
                                        className={`w-full border border-gray-300 rounded px-3 py-2 ${field.className}`}
                                    />
                                )}

                                {errors[field.name] && (
                                    <p className='text-red-500 text-sm mt-1'>{errors[field.name]}</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <ImageUpload
                        file={formData?.image}
                        onChange={handleFileUpload}
                        onRemove={handleRemove}
                        errorMessage={errors?.image}
                        maxFileSize={maxFileSize}
                        previewClassName={"!h-40"}
                        allowedTypes={allowedTypes}
                        label="Buggy Image"
                    />
                </div>


                <div className='text-black flex items-center gap-4 mt-6'>
                    <div className={`w-full ${buttonClassName}`}>
                        <Button onClick={handleConfirm}>Submit</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateForm