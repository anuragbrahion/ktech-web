import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Lock, Eye, EyeOff, Camera, Upload } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "Irfan Gulammuslufa Palel",
    email: "irfan@example.com",
    phone: "+91 9879867620",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    role: "Teacher",
    specialization: "Mathematics & Physics",
    experience: "5 Years",
    dob: "15/01/1990",
    doj: "01/01/2023",
    bio: "Dedicated mathematics teacher with 5+ years of experience in secondary education. Passionate about making complex concepts simple and accessible for all students.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
  };

  const handleSavePassword = () => {
    if (profile.newPassword !== profile.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    console.log('Changing password');
    setIsPasswordEditing(false);
    setProfile(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedAvatar(reader.result);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
      </div>
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {selectedAvatar ? (
                    <img 
                      src={selectedAvatar} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    "IG"
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Camera size={20} className="text-gray-700" />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{profile.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                      {profile.role}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                      {profile.specialization}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600">{profile.bio}</p>
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
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
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
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
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
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} />
                      Role
                    </div>
                  </label>
                  <select
                    name="role"
                    value={profile.role}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Date of Birth
                    </div>
                  </label>
                  <input
                    type="text"
                    name="dob"
                    value={profile.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="DD/MM/YYYY"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
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
                    name="doj"
                    value={profile.doj}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="DD/MM/YYYY"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      Address
                    </div>
                  </label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="2"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / About Me
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              <button
                onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
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
                      value={profile.currentPassword}
                      onChange={handleInputChange}
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
                      value={profile.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
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
                      value={profile.confirmPassword}
                      onChange={handleInputChange}
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
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Your password was last changed 30 days ago</p>
                <p className="text-sm text-gray-500 mt-2">Click "Change Password" to update your password</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Profile;