import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import PasswordInput from "../../components/Input/PasswordInput";
import Button from "../../components/Atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, countryCodeList, updateProfile, viewProfile } from "../../redux/slices/AuthSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import Input from "../../components/Input/Input";

const tabs = ["User Profile", "Change Password"];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("User Profile");
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: null, // should hold an object
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.auth);
  const countryCodeListData = selector?.countryCodeListData?.data?.data;

  useEffect(() => {
    dispatch(countryCodeList());
  }, [dispatch]);
  useEffect(() => {
    dispatch(viewProfile())
  }, [])
  const viewProfileData = selector?.viewProfileData?.data?.data
  console.log("slee", viewProfileData)
  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  useEffect(() => {
    if (viewProfileData) {
      setFormData((prev) => ({
        ...prev,
        firstName: viewProfileData.firstName || "",
        lastName: viewProfileData.lastName || "",
        email: viewProfileData.email || "",
        phoneNumber: viewProfileData.phoneNumber || "",
        countryCode: viewProfileData.countryCode || { name: "India", dialCode: "+91", shortName: "IN", emoji: "🇮🇳" },
        profilePictureUrl: viewProfileData.profilePictureUrl || null,
      }));
    }
  }, [viewProfileData]);

  const handleCountryChange = (e) => {
    const selectedDialCode = e.target.value;
    const selectedCountry = countryCodeListData?.find(
      (item) => item.dialCode === selectedDialCode
    );
    setFormData((prev) => ({
      ...prev,
      countryCode: selectedCountry || null,
    }));
  };

  const validatePasswordChange = (data) => {
    const errors = {};
    const { current_password, new_password, confirm_password } = data;

    if (!current_password) errors.current_password = "Current password is required.";

    if (!new_password) {
      errors.new_password = "New password is required.";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(new_password)) {
        errors.new_password =
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      }
    }

    if (!confirm_password) errors.confirm_password = "Confirm password is required.";
    else if (new_password !== confirm_password)
      errors.confirm_password = "Passwords do not match.";

    return errors;
  };

  const handleUpdatePassword = () => {
    const errors = validatePasswordChange(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const reqData = {
      currentPassword: formData.current_password,
      newPassword: formData.new_password,
      confirmPassword: formData.confirm_password,
    };

    setIsLoading(true);
    dispatch(changePassword(reqData))
      .unwrap()
      .then((res) => {
        if (res.error) {
          toast.error(res.error || "Error in Changing Password");
          return;
        }
        toast.success(res.message || "Password Changed Successfully");
        setFormData({
          ...formData,
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error || "Error in Changing Password");
      })
      .finally(() => setIsLoading(false));
  };
  const validateProfile = (data) => {
    const errors = {};
    const { firstName, lastName, email, phoneNumber } = data;
    // First name validation
    if (!firstName || firstName.trim() === "") {
      errors.firstName = "First name is required.";
    }

    // Last name validation
    if (!lastName || lastName.trim() === "") {
      errors.lastName = "Last name is required.";
    }

    // Email validation
    if (!email || email.trim() === "") {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Email is invalid.";
      }
    }

    // Phone number validation
    if (!phoneNumber || phoneNumber.trim() === "") {
      errors.phoneNumber = "Phone number is required.";
    } else {
      const phoneRegex = /^[0-9]{6,15}$/; // allow 6-15 digits
      if (!phoneRegex.test(phoneNumber)) {
        errors.phoneNumber = "Phone number is invalid.";
      }
    }

    // Country code validation
    // if (!countryCode) {
    //   errors.countryCode = "Country code is required.";
    // }

    return errors;
  };

  const handleUpdateProfile = () => {
    const errors = validateProfile(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    const payload = new FormData();
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("email", formData.email);
    payload.append("phoneNumber", formData.phoneNumber);
    payload.append(
      "countryCode",
      JSON.stringify(
        formData.countryCode || {
          name: "India",
          dialCode: "+91",
          shortName: "IN",
          emoji: "🇮🇳"
        }
      )
    );
    if (formData.profilePictureUrl) {
      payload.append("profilePictureUrl", formData.profilePictureUrl);
    }

    dispatch(updateProfile(payload))
      .unwrap()
      .then((res) => {
        if (res.error) {
          toast.error(res.error || "Error in Updating Profile");
          return;
        }
        toast.success(res.message || "Profile Updated Successfully");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error || "Error in Updating Profile");
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      <Loader loading={isLoading || selector?.loading} />
      <div className="bg-white shadow-sm rounded-xl p-6">
        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeTab === tab
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-indigo-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* User Profile Tab */}
        {activeTab === "User Profile" && (
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-10">
            {/* Avatar */}
            <div className="relative">
              <img
                src={formData?.profilePictureUrl || "https://i.pravatar.cc/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md hover:bg-indigo-700 cursor-pointer transition">
                <FaPen size={12} />
                <input
                  type="file"
                  accept="image/*"
                  file={formData?.profilePictureUrl}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prev) => ({
                      ...prev,
                      profilePictureUrl: file,
                      profilePicturePreviewUrl: URL.createObjectURL(file),
                    }));
                  }}

                />
              </label>
            </div>
            {/* Form */}
            <div className="w-full md:w-3/4 mt-6 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleValueChange}
                  error={formErrors.firstName}
                />

                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleValueChange}
                  error={formErrors.lastName}
                />

                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleValueChange}
                  error={formErrors.email}
                />


                <div>

                  <div className="flex items-center gap-2">
                    <select
                      name="countryCode"
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


                    <Input
                      name="phoneNumber"
                      label="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleValueChange}
                      error={formErrors.phoneNumber}
                    />
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="mt-6">
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "Change Password" && (
          <div className="w-full md:w-3/4 mt-6 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput
                label="Current Password"
                name="current_password"
                placeholder="Current Password"
                value={formData.current_password}
                onChange={handleValueChange}
                error={formErrors.current_password}
              />
              <PasswordInput
                label="New Password"
                name="new_password"
                placeholder="New Password"
                error={formErrors.new_password}
                value={formData.new_password}
                onChange={handleValueChange}
              />
              <PasswordInput
                label="Confirm Password"
                error={formErrors.confirm_password}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleValueChange}
                placeholder="Confirm Password"
              />
            </div>

            <div className="mt-6">
              <Button onClick={handleUpdatePassword}>Update</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
