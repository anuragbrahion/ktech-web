import React, { useState } from "react";
import {
    Mail,
    Lock,
    GraduationCap,
    BookOpen,
    Building,
    Shield,
    ChevronRight,
    ArrowLeft,
    LogIn,
    Key
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../redux/slices/AuthSlice";
import Loader from "../../components/Loader/Loader";

const USER_TYPES = {
    student: {
        title: "Student Login",
        subtitle: "Access courses & progress",
        icon: GraduationCap,
        gradient: "from-green-500 to-emerald-500",
        soft: "bg-green-500/10",
        btn: "from-green-600 to-emerald-700",
        placeholder: "student@university.edu"
    },
    teacher: {
        title: "Teacher Login",
        subtitle: "Manage classes & students",
        icon: BookOpen,
        gradient: "from-indigo-500 to-purple-500",
        soft: "bg-indigo-500/10",
        btn: "from-indigo-600 to-purple-700",
        placeholder: "teacher@university.edu"
    },
    branch: {
        title: "Branch/Admin Login",
        subtitle: "Branch administration",
        icon: Building,
        gradient: "from-orange-500 to-amber-500",
        soft: "bg-orange-500/10",
        btn: "from-orange-600 to-amber-700",
        placeholder: "admin@branch.edu"
    },
    superAdmin: {
        title: "Super Admin Login",
        subtitle: "System control access",
        icon: Shield,
        gradient: "from-black to-gray-500",
        soft: "bg-rose-500/10",
        btn: "from-black to-gray-500",
        placeholder: "admin@system.edu"
    }
};

export default function Login() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotErrors, setForgotErrors] = useState({});

    const validateLogin = () => {
        const e = {};
        if (!email) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Minimum 6 characters required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateForgotEmail = () => {
        const e = {};
        if (!forgotEmail) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(forgotEmail)) e.email = "Invalid email address";
        setForgotErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitLogin = async () => {
        setFormError("");
        if (!validateLogin()) {
            toast.error("Please fix validation errors");
            return;
        }
        try {
            const loginPayload = {
                email,
                password
            };
            
            const res = await dispatch(login(loginPayload)).unwrap();
            
            if (res?.data?.token) {
                toast.success("Login successful!");
                setTimeout(() => {
                    router('/dashboard');
                }, 500);
            } else {
                toast.error(res?.message || "Login failed");
            }
        } catch (err) {
            const message = err?.message || err || "Invalid credentials";
            setFormError(message);
            toast.error(message);
        }
    };

    const handleForgotPassword = async () => {
        if (!validateForgotEmail()) {
            toast.error("Please enter a valid email");
            return;
        }
        
        // Instead of calling API directly from login page,
        // redirect to forgot password page with email pre-filled
        localStorage.setItem("forgotPasswordEmail", forgotEmail);
        router("/forgot-password");
    };

    if (loading) {
        return <Loader />;
    }

    if (!role && !showForgotPassword) {
        return (
            <div className="min-h-screen bg-sky-100 flex items-center justify-center p-6">
                <div className="max-w-5xl w-full">
                    <div className="flex gap-6 justify-center mb-8">
                        <LogIn className="bg-sky-100 p-2 rounded-md" size={42} />
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back</h1>
                            <p className="text-gray-500">Choose how you want to sign in</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(USER_TYPES).map(([key, c]) => {
                            const Icon = c.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setRole(key)}
                                    className="group rounded-lg bg-white border shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                                >
                                    <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />
                                    <div className="p-5 flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className={`p-3 rounded-xl ${c.soft}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold">{c.title}</h3>
                                                <p className="text-sm text-gray-500">{c.subtitle}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowForgotPassword(true)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <Key className="w-4 h-4 mr-2" />
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showForgotPassword) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-lg border overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
                        <button
                            onClick={() => setShowForgotPassword(false)}
                            className="flex items-center text-xs text-white/80"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Key className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold">Forgot Password</h2>
                                <p className="text-sm text-gray-500">
                                    Enter your email to receive reset instructions
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    className={`w-full pl-9 py-2.5 text-sm rounded-lg border focus:ring-1 ${
                                        forgotErrors.email ? "border-red-400 focus:ring-red-300" : ""
                                    }`}
                                />
                            </div>
                            {forgotErrors.email && (
                                <p className="mt-1 text-xs text-red-500">{forgotErrors.email}</p>
                            )}
                        </div>

                        <button
                            onClick={handleForgotPassword}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                        >
                            Send Reset Instructions
                        </button>

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            You will receive an email with password reset instructions.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const c = USER_TYPES[role];
    const Icon = c.icon;

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-lg border overflow-hidden">
                <div className={`p-4 bg-gradient-to-r ${c.gradient}`}>
                    <button
                        onClick={() => setRole(null)}
                        className="flex items-center text-xs text-white/80"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-3 mb-6">
                        <div className={`p-3 rounded-xl ${c.soft}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold">{c.title}</h2>
                            <p className="text-sm text-gray-500">{c.subtitle}</p>
                        </div>
                    </div>

                    {formError && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                            {formError}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="text-xs font-medium text-gray-600">Email</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={email}
                                placeholder={c.placeholder}
                                onChange={e => setEmail(e.target.value)}
                                className={`w-full pl-9 py-2.5 text-sm rounded-lg border focus:ring-1 ${
                                    errors.email ? "border-red-400 focus:ring-red-300" : ""
                                }`}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="text-xs font-medium text-gray-600">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={`w-full pl-9 py-2.5 text-sm rounded-lg border focus:ring-1 ${
                                    errors.password ? "border-red-400 focus:ring-red-300" : ""
                                }`}
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setShowForgotPassword(true)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        onClick={submitLogin}
                        disabled={loading}
                        className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r ${c.btn} ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
}