import React, { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Atoms/Button";
import Checkbox from "../../components/Atoms/Checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createAdminRole, permissionsRole, updateAdminRole } from "../../redux/slices/AdminSlice";
import { toast } from "react-toastify";
import NotFound from "../../components/Atoms/NotFound";

const CreateRbac = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const editData = location.state?.editData || null;

    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState({});
    const [errors, setErrors] = useState({});
    const { permissionsRoleData } = useSelector((state) => state.admin) || {};
    const permissionList = permissionsRoleData?.data?.data || {};
    useEffect(() => {
        dispatch(permissionsRole());
    }, [dispatch]);
    useEffect(() => {
        if (permissionList && Object.keys(permissionList).length > 0) {
            const initialPermissions = {};
            Object.entries(permissionList).forEach(([key]) => {
                initialPermissions[key] = editData?.permissions?.[key] ?? false;
            });
            setPermissions(initialPermissions);
        }
    }, [permissionList, editData]);

    // Prefill role name if editing
    useEffect(() => {
        if (editData?.name) setRoleName(editData.name);
    }, [editData]);

    const handlePermissionChange = (key, value) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleBack = () => navigate("/app/rbac");
    const addValidation = () => {
        const newErrors = {};

        if (!roleName.trim()) {
            newErrors.roleName = "Role name is required";
        } else if (roleName.trim().length < 5) {
            newErrors.roleName = "Role name must be at least 5 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAddOrUpdate = () => {
        if (!addValidation()) {
            return
        }
        const reqData = {
            _id: editData?._id,
            name: roleName,
            permissions,
        };

        if (editData) {
            dispatch(updateAdminRole(reqData))
                .unwrap()
                .then((res) => {
                    if (res.error) {
                        toast.error(res.error || "Error in updating admin role");
                    } else {
                        toast.success(res.message || "Admin role updated successfully");
                        navigate("/app/rbac");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error(error || "Error in updating admin role");
                });
        } else {
            dispatch(createAdminRole(reqData))
                .unwrap()
                .then((res) => {
                    if (res.error) {
                        toast.error(res.error || "Error in creating admin role");
                    } else {
                        toast.success(res.message || "Admin role created successfully");
                        navigate("/app/rbac");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error(error || "Error in creating admin role");
                });
        }
    };

const handleChange=(e)=>{
    setRoleName(e.target.value)
    setErrors({roleName:""})

}
    const hasPermissions =
        permissionList && Object.keys(permissionList).length > 0;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm">
            <div className="flex justify-end mb-4">
                <Button onClick={handleBack}>Back</Button>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {editData ? "Edit Admin Role" : "Create Admin Role"}
            </h2>

            {!hasPermissions ? (
                <NotFound />
            ) : (
                <>
                    {/* Role Name Input */}
                    <div className="flex gap-4">
                        <div className="mb-3">

                        <Input
                            placeholder="Enter admin role name"
                            value={roleName}
                            onChange={handleChange}
                            className="w-full max-w-[500px] !py-1"
                            maxLength={25}
                            error={errors.roleName}
                        />
                        </div>
                        <div className="mt-3">

                        <Button
                        
                        onClick={handleAddOrUpdate}
                    >
                        {editData ? "Update" : "Add"}
                    </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(permissionList).map(([label, key]) => (
                            <Checkbox
                                key={key}
                                label={label}
                                checked={permissions[key] || false}
                                onChange={(value) => handlePermissionChange(key, value)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateRbac;
