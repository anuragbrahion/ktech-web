import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getProfileData, updateProfilePhoto, changePassword } from '../../redux/slices/AdminSlice';
import { apiUrl } from '../../utils/axiosProvider';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(getProfileData());
  }, [dispatch]);

  const selector = useSelector((state) => state.admin);
  const response = selector?.getProfileDataData?.data?.data;

  useEffect(() => {
    if (response) {
      setProfile(response);
    }
  }, [response]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSavePassword = () => {

  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    toast.error("All password fields are required");
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("New passwords don't match!");
    return;
  }

  if (passwordData.currentPassword === passwordData.newPassword) {
    toast.error("New password must be different from current password");
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(passwordData.newPassword)) {
    toast.error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number and special character"
    );
    return;
  }

  dispatch(changePassword({
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
    confirmPassword: passwordData.confirmPassword
  })).then(() => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordEditing(false);
  });
};
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        const uploadedFile = response.data.data[0];
        dispatch(updateProfilePhoto({
          profilephoto: uploadedFile
        })).then(() => {
          dispatch(getProfileData());
        });
        toast.success('Profile photo uploaded successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getProfileImageUrl = () => {
     if (profile?.profilephoto[0].url) {
      return profile.profilephoto[0].url;
    }
    return null;
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {getProfileImageUrl() ? (
                  <img 
                    src={getProfileImageUrl()} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(profile.name)
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Camera size={20} className="text-gray-700" />
              </label>
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{profile.name || 'Not provided'}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {profile.role || 'User'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {profile.referralCode && (
                <p className="text-gray-600 text-sm">
                  Referral Code: <span className="font-mono font-medium">{profile.referralCode}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </div>
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  value={profile.phoneNo || ''}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    Role
                  </div>
                </label>
                <input
                  type="text"
                  value={profile.role || ''}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Date of Joining
                  </div>
                </label>
                <input
                  type="text"
                  value={formatDate(profile.dateOfJoining)}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Member ID
                  </div>
                </label>
                <input
                  type="text"
                value={profile?._id?.slice(0, 8) ? "********************" + profile._id.slice(0, 4) : ""}
                  disabled={true}
                  className="w-full uppercase px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
            <button
              onClick={() => setIsPasswordEditing(!isPasswordEditing)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium transition-colors"
            >
              {isPasswordEditing ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isPasswordEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Current Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    New Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Confirm New Password
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSavePassword}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Password security is important</p>
              <p className="text-sm text-gray-500 mt-2">Click "Change Password" to update your password</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;