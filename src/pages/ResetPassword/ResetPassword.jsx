import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
 import Loader from "../../components/Loader/Loader";
import { resetpassword } from "../../redux/slices/AuthSlice";

export default function ResetPassword() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { loading } = useSelector((state) => state.auth);
    
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        // Get token and email from URL parameters
        const urlToken = searchParams.get("token");
        const urlEmail = searchParams.get("email");
        
        if (urlToken) {
            setToken(urlToken);
        }
        if (urlEmail) {
            setEmail(urlEmail);
        }
        
        // Validate token (you might want to call an API to verify token validity)
        if (!urlToken) {
            setIsTokenValid(false);
            toast.error("Invalid or expired reset link");
        }
    }, [searchParams]);

    const validate = () => {
        const e = {};
        if (!newPassword) e.newPassword = "New password is required";
        else if (newPassword.length < 6) e.newPassword = "Minimum 6 characters required";
        if (!confirmPassword) e.confirmPassword = "Confirm password is required";
        else if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validate()) {
            toast.error("Please fix validation errors");
            return;
        }
        
        if (!isTokenValid) {
            toast.error("Invalid reset token");
            return;
        }
        
        try {
            const resetData = {
                email,
                token,
                password: newPassword
            };
            
            const res = await dispatch(resetpassword(resetData)).unwrap();
            
            if (res?.success) {
                setIsSuccess(true);
                toast.success("Password reset successful!");
                setTimeout(() => {
                    router("/login");
                }, 3000);
            } else {
                toast.error(res?.message || "Failed to reset password");
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
                        <p className="text-gray-600 mb-6">
                            This password reset link is invalid or has expired.
                            Please request a new reset link from the login page.
                        </p>
                        <button
                            onClick={() => router("/login")}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loader />;
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been successfully reset. You will be redirected to the login page.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-800">
                                Redirecting to login in 3 seconds...
                            </p>
                        </div>
                        <button
                            onClick={() => router("/login")}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Go to Login Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
                        <p className="text-gray-600 mt-2">
                            Set a new password for your account
                        </p>
                        {email && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    Resetting password for: <strong>{email}</strong>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
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

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router("/login")}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}