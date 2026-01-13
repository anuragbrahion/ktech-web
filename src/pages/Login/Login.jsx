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
  LogIn
} from "lucide-react";

/* ---------------- CONFIG ---------------- */

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
    title: "Branch Login",
    subtitle: "Branch administration",
    icon: Building,
    gradient: "from-orange-500 to-amber-500",
    soft: "bg-orange-500/10",
    btn: "from-orange-600 to-amber-700",
    placeholder: "admin@branch.edu", 
  },
  superAdmin: {
    title: "Super Admin Login",
    subtitle: "System control access",
    icon: Shield,
    gradient: "from-black to-gray-500",
    soft: "bg-rose-500/10",
    btn: "from-black to-gray-500",
    placeholder: "admin@system.edu", 
  }
};

/* ---------------- MAIN ---------------- */

export default function Login({ onLogin }) {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [extra, setExtra] = useState("");

  const submit = () =>
    onLogin({ role, email, password, ...(extra && { extra }) });

  /* -------- ROLE CARDS -------- */

  if (!role) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="flex gap-6 justify-center">
            <div className="">
          <LogIn className="mt-1 bg-sky-100 p-2 rounded-md" size={42}/>
            </div>
          <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Choose how you want to sign in</p>
          </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(USER_TYPES).map(([key, c]) => {
              const Icon = c.icon;
              return (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className="
                    group relative overflow-hidden
                    rounded-lg bg-white
                    border border-gray-100
                    shadow-md hover:shadow-xl
                    transition-all hover:-translate-y-1
                  "
                >
                  {/* TOP GRADIENT STRIP */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${c.gradient}`} />

                  <div className="p-5 flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-xl ${c.soft}`}>
                        <Icon className="w-6 h-6 text-gray-800" />
                      </div>

                      <div className="text-left">
                        <h3 className="text-lg font-semibold">
                          {c.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {c.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* -------- LOGIN CARD -------- */

  const c = USER_TYPES[role];
  const Icon = c.icon;
  const ExtraIcon = c.extra?.icon;
  const disabled = !email || !password || (c.extra && !extra);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
        
        {/* CARD HEADER */}
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
          {/* LEFT-ALIGNED TITLE */}
          <div className="flex items-start gap-3 mb-6">
            <div className={`p-3 rounded-xl ${c.soft}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{c.title}</h2>
              <p className="text-sm text-gray-500">{c.subtitle}</p>
            </div>
          </div>

          {c.extra && (
            <Input
              label={c.extra.label}
              icon={ExtraIcon}
              type={c.extra.password ? "password" : "text"}
              value={extra}
              onChange={setExtra}
            />
          )}

          <Input
            label="Email"
            icon={Mail}
            value={email}
            placeholder={c.placeholder}
            onChange={setEmail}
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            value={password}
            onChange={setPassword}
          />

          <button
            onClick={submit}
            disabled={disabled}
            className={`
              w-full mt-4 py-2.5 rounded-lg text-sm font-semibold text-white
              bg-gradient-to-r ${c.btn}
              hover:shadow-lg transition
              disabled:opacity-40
            `}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function Input({ label, icon: Icon, value, onChange, type = "text", placeholder }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="
            w-full pl-9 py-2.5 text-sm
            rounded-lg border border-gray-200
            focus:outline-none focus:ring-1 focus:ring-black/10
          "
        />
      </div>
    </div>
  );
}
