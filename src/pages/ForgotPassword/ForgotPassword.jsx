import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
 import Loader from "../../components/Loader/Loader";
import { forgotPassword, resetpassword } from "../../redux/slices/AuthSlice";

export default function ForgotPassword() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const { loading, emailForReset } = useSelector((state) => state.auth);
    const [email, setEmail] = useState(emailForReset || "");
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // 1: Enter email, 2: Check email, 3: Reset password
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateEmail = () => {
        const e = {};
        if (!email) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validatePassword = () => {
        const e = {};
        if (!resetToken) e.token = "Reset token is required";
        if (!newPassword) e.newPassword = "New password is required";
        else if (newPassword.length < 6) e.newPassword = "Minimum 6 characters required";
        if (!confirmPassword) e.confirmPassword = "Confirm password is required";
        else if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSendResetLink = async () => {
        if (!validateEmail()) {
            toast.error("Please fix validation errors");
            return;
        }
        
        try {
            const res = await dispatch(forgotPassword({ email })).unwrap();
            if (res?.success) {
                toast.success("Reset link sent to your email!");
                // dispatch(setEmailForReset(email));
                setStep(2);
            } else {
                toast.error(res?.message || "Failed to send reset link");
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    const handleResetPassword = async () => {
        if (!validatePassword()) {
            toast.error("Please fix validation errors");
            return;
        }
        
        try {
            const resetData = {
                email: emailForReset || email,
                token: resetToken,
                password: newPassword
            };
        
            const res = await dispatch(resetpassword(resetData)).unwrap();
            
            if (res?.success) {
                toast.success("Password reset successful!");
                setStep(3);
                setTimeout(() => {
                    router("/login");
                }, 2000);
            } else {
                toast.error(res?.message || "Failed to reset password");
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                    {/* Back Button */}
                    {step !== 3 && (
                        <button
                            onClick={() => router("/login")}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </button>
                    )}

                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                        <div>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                                <p className="text-gray-600 mt-2">
                                    Enter your email address and we'll send you a reset link
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <button
                                onClick={handleSendResetLink}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Check Email */}
                    {step === 2 && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> The reset link will expire in 1 hour.
                                    If you don't see the email, check your spam folder.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    I've Received the Link
                                </button>
                                <button
                                    onClick={handleSendResetLink}
                                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Resend Reset Link
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <div>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                                <p className="text-gray-600 mt-2">
                                    Enter the reset token from your email and set new password
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reset Token
                                    </label>
                                    <input
                                        type="text"
                                        value={resetToken}
                                        onChange={(e) => setResetToken(e.target.value)}
                                        placeholder="Enter reset token from email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.token && (
                                        <p className="mt-1 text-sm text-red-600">{errors.token}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                    )}

                    {/* Success Screen */}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been successfully reset. You can now login with your new password.
                            </p>
                            <button
                                onClick={() => router("/login")}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}