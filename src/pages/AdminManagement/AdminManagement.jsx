import React, { useEffect, useState } from "react";
import TableData from "../../components/Atoms/Table";
import { useDispatch, useSelector } from "react-redux";
import {
    adminManagementList,
    createAdminManagement,
    enableDisableAdmin,
    getAssignedRolesList,
    updateAdminManagement,
    updatePassword
} from "../../redux/slices/AdminSlice";
import { formatDateForDisplay, maskEmail } from "../../utils/globalFunction";
import Toggle from "../../components/Atoms/Toggle";
import { toast } from "react-toastify";
import EditIcon from "../../components/Icons/EditIcon";
import Button from "../../components/Atoms/Button";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import Input from "../../components/Input/Input";
import Dropdown from "../../components/DropDown";
import { countryCodeList } from "../../redux/slices/AuthSlice";
import { MdPassword } from "react-icons/md";
import PasswordInput from "../../components/Input/PasswordInput";

const AdminManagement = () => {
    const [page, setPage] = useState(1);
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [isOpenPassword, setIsOpenPassword] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        countryCode: { dialCode: "+91", name: "India", shortName: "IN", emoji: "🇮🇳" },
        phoneNumber: "",
        assignedRole: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const size = 10;
    const dispatch = useDispatch();

    // Fetch admin list
    useEffect(() => {
        const reqData = {
            page: page,
            size: size
        };
        dispatch(adminManagementList(reqData));
    }, [isRefresh, page]);

    // Fetch country codes and roles
    useEffect(() => {
        dispatch(countryCodeList());
        dispatch(getAssignedRolesList());
    }, []);

    const selector = useSelector((state) => state.admin);
    const authSelector = useSelector((state) => state.auth);

    const adminManagementListData = selector?.adminManagementListData?.data?.data?.list;
    const countryCodeListData = authSelector?.countryCodeListData?.data?.data;
    const getAssignedRolesListData = selector?.getAssignedRolesListData?.data?.data?.list;

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username?.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.firstName?.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.phoneNumber?.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
            newErrors.phoneNumber = "Phone number must be 10 digits";
        }

        if (!formData.assignedRole) {
            newErrors.assignedRole = "Assigned role is required";
        }

        // Password validation for create mode
        if (modalType === "create") {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
                newErrors.password = "Password must contain uppercase, lowercase, number and special character";
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm password";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        // Password validation for edit mode (optional update)
        if (modalType === "edit" && (formData.password || formData.confirmPassword)) {
            if (formData.password && formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            } else if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
                newErrors.password = "Password must contain uppercase, lowercase, number and special character";
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle toggle status
    const handleToggle = (data) => {
        const reqData = {
            _id: data._id,
            isDisable: data.isDisable ? false : true
        };
        setIsLoading(true);
        dispatch(enableDisableAdmin(reqData))
            .unwrap()
            .then((res) => {
                toast.success(res.message || "Status updated successfully");
                setIsRefresh(!isRefresh);
            })
            .catch((error) => {
                toast.error(error || "Error updating status");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Handle edit admin
    const handleOpenEdit = (admin) => {
        setEditingAdmin(admin);
        setModalType("edit");
        setFormData({
            username: admin.username || "",
            email: admin.email || "",
            firstName: admin.firstName || "",
            lastName: admin.lastName || "",
            countryCode: admin.countryCode || { dialCode: "+91", name: "India", shortName: "IN", emoji: "🇮🇳" },
            phoneNumber: admin.phoneNumber || "",
            assignedRole: admin.assignedRole?._id || "",
            password: "",
            confirmPassword: ""
        });
        setErrors({});
        setIsOpenModal(true);
    };

    // Handle create admin
    const handleOpenCreate = () => {
        setEditingAdmin(null);
        setModalType("create");
        setFormData({
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            countryCode: { dialCode: "+91", name: "India", shortName: "IN", emoji: "🇮🇳" },
            phoneNumber: "",
            assignedRole: "",
            password: "",
            confirmPassword: ""
        });
        setErrors({});
        setIsOpenModal(true);
    };

    const handlePageChange = (data) => {
        setPage(data);
    };

    const onClose = () => {
        setIsOpenModal(false);
        setEditingAdmin(null);
        setIsOpenPassword(false)
        setErrors({});
    };

    // Handle country code change
    const handleCountryChange = (e) => {
        const selectedDialCode = e.target.value;
        const selectedCountry = countryCodeListData?.find(
            (item) => item.dialCode === selectedDialCode
        );
        setFormData((prev) => ({
            ...prev,
            countryCode: selectedCountry || { dialCode: "+91", name: "India", shortName: "IN", emoji: "🇮🇳" },
        }));
    };

    // Handle input changes
   const handleInputChange = (field, value) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
        setErrors(prev => ({
            ...prev,
            [field]: ""
        }));
    }
};

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const baseData = {
            email: formData.email.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber.trim(),
            assignedRole: formData.assignedRole.value
        };

        let requestData;
        let apiCall;

        if (modalType === "create") {
            requestData = {
                ...baseData,
                username: formData.username.trim(),
                password: formData.password,
                confirmPassword: formData.confirmPassword
            };
            apiCall = createAdminManagement;
        } else {
            requestData = {
                ...baseData,
                _id: editingAdmin._id
            };

            // Include password only if provided in edit mode
            if (formData.password) {
                requestData.password = formData.password;
                requestData.confirmPassword = formData.confirmPassword;
            }

            apiCall = updateAdminManagement;
        }

        dispatch(apiCall(requestData))
            .unwrap()
            .then((res) => {
                toast.success(res.message || `${modalType === "create" ? "Admin created" : "Admin updated"} successfully`);
                setIsRefresh(!isRefresh);
                onClose();
            })
            .catch((error) => {
                toast.error(error || `Error ${modalType === "create" ? "creating" : "updating"} admin`);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    const handleOpenPassword = (item) => {
        setIsOpenPassword(true)
        setFormData({ pass_id: item._id })
    }
    const validatePassword = () => {
    const newErrors = {};

    if (!formData.password || formData.password.trim() === "") {
        newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        newErrors.password = "Password must contain uppercase, lowercase, number and special character";
    }

    if (!formData.confirmPassword || formData.confirmPassword.trim() === "") {
        newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


    const handlePasswordSubmit = () => {
    if (!validatePassword()) return;

    const reqData = {
        _id: formData.pass_id,
        password: formData.password,
        confirmPassword: formData.confirmPassword
    };

    setIsSubmitting(true);

    dispatch(updatePassword(reqData))
        .unwrap()
        .then((res) => {
            if (res.error) {
                toast.error(res.error || "Error updating password");
                return;
            }
            toast.success(res.message || "Password updated successfully");
            setIsOpenPassword(false);
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "", pass_id: "" }));
        })
        .catch((error) => {
            toast.error(error || "Error updating password");
        })
        .finally(() => {
            setIsSubmitting(false);
        });
};


    const modalHeading = modalType === "create" ? "Add Admin" : "Edit Admin";

    return (
        <>
            <div className='min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8'>
                <div className='flex justify-end mb-4'>
                    <Button onClick={handleOpenCreate}>Add Admin</Button>
                </div>
                <TableData
                    tableHeadings={[
                        '#',
                        'Username',
                        'Name',
                        'Phone No.',
                        'Assigned Role',
                        'Last Action',
                        'Last Modified At',
                        'Status',
                        'Action'
                    ]}
                    data={adminManagementListData?.map((item, index) => [
                        <span key={`sno-${index}`}>{((page - 1) * size) + (index + 1)}</span>,
                        <span key={`username-${item._id}`} className="capitalize">{item.username}</span>,
                        <span key={`name-${item._id}`} className="capitalize">{`${item?.firstName} ${item?.lastName}`}</span>,
                        <span key={`phone-${item._id}`} className="capitalize">{`${item?.countryCode?.emoji} ${item?.countryCode?.dialCode} ${item?.phoneNumber}`}</span>,
                        <span key={`role-${item._id}`} className="capitalize">{item?.assignedRole?.name}</span>,
                        <div className="grid grid-cols-1" key={`action-${item._id}`}>
                            <span className="capitalize">{item?.actionBy?.username}</span>
                            <span className="text-gray-400">{maskEmail(item?.actionBy?.email)}</span>
                        </div>,
                        <span key={`date-${item._id}`} className="capitalize">{formatDateForDisplay(item?.updatedAt)}</span>,
                        <div key={`status-${item._id}`}>
                            <Toggle
                                id={`toggle-${item._id}`}
                                label=""
                                isChecked={!item.isDisable}
                                onToggle={() => handleToggle(item)}
                                isDisabled={isLoading}
                            />
                        </div>,
                        <div key={`actions-${item._id}`} className="flex gap-1">
                            <EditIcon onClickFunction={() => handleOpenEdit(item)} />
                            <MdPassword onClick={() => handleOpenPassword(item)} size={20} className="mt-1 cursor-pointer" />
                        </div>
                    ])}
                    total={selector?.adminManagementListData?.data?.data?.totalCount}
                    currentPage={page}
                    handlePageChange={handlePageChange}
                    size={size}
                />
            </div>

            <DefaultPreviewModal
                isOpen={isOpenModal}
                heading={modalHeading}
                closeModal={onClose}
            >
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <Input
                        label="Username"
                        name="username"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        error={errors.username}
                        disabled={modalType === "edit"}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        error={errors.email}
                        required
                    />

                    <Input
                        label="First Name"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        error={errors.firstName}
                        required
                    />

                    <Input
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        error={errors.lastName}
                        required
                    />

                    <div className="flex gap-2">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country Code <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="countryCode"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.countryCode?.dialCode || "+91"}
                                onChange={handleCountryChange}
                            >
                                <option value="">Select</option>
                                {countryCodeListData?.map((item) => (
                                    <option key={item._id} value={item.dialCode}>
                                        {item.emoji} {item.dialCode}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-2/3">
                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, ""))}
                                error={errors.phoneNumber}
                                required
                            />
                        </div>
                    </div>

                    <Dropdown
                        label="Assigned Roles"
                        name="assignedRole"
                        value={formData.assignedRole}
                        onChange={(selectedOption) => handleInputChange("assignedRole", selectedOption)}
                        options={
                            getAssignedRolesListData?.map((role) => ({
                                value: role._id,
                                label: role.assignedRole?.name || role.name,
                            })) || []
                        }
                        error={errors.assignedRole}
                        required
                    />

                    <PasswordInput
                        label="Password"
                        name="password"
                        placeholder={modalType === "create" ? "Enter password" : "Enter new password (optional)"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        error={errors.password}
                        required={modalType === "create"}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder={modalType === "create" ? "Confirm password" : "Confirm new password (optional)"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        error={errors.confirmPassword}
                        required={modalType === "create"}
                    />
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end mt-6 gap-4">
                    <Button
                        className="!bg-white !text-black hover:!bg-gray-200"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="base-bg-color text-white font-extrabold"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : (modalType === "create" ? "Create" : "Update")}
                    </Button>
                </div>
            </DefaultPreviewModal>
            <DefaultPreviewModal
                isOpen={isOpenPassword}
                heading={"Update Password"}
                closeModal={onClose}
            >
                <PasswordInput
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    error={errors.password}
                />
                <PasswordInput
                    name="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                />

                <div className="col-span-1 md:col-span-2 flex justify-end mt-6 gap-4">
                    <Button
                        className="!bg-white !text-black hover:!bg-gray-200"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="base-bg-color text-white font-extrabold"
                        onClick={handlePasswordSubmit}
                        disabled={isSubmitting}
                    >
                        Update Password
                    </Button>
                </div>
            </DefaultPreviewModal>
        </>
    );
};

export default AdminManagement;