import moment from "moment-timezone";

const guessedTimezone = moment.tz.guess();
const keyData = "buggy-billing-system";

// ─── Session Storage ──────────────────────────
export const sessionStorageSetItem = (item) => {
  sessionStorage.setItem(keyData, JSON.stringify(item));
};

export const sessionStorageGetItem = () => {
  const data = sessionStorage.getItem(keyData);
  return data ? JSON.parse(data) : null;
};

export const sessionStorageRemoveItem = () => {
  sessionStorage.removeItem(keyData);
};

// ─── Local Storage ────────────────────────────
export const localStorageSetItem = (item) => {
  localStorage.setItem(keyData, JSON.stringify(item));
};

export const localStorageGetItem = () => {
  const data = localStorage.getItem(keyData);
  return data ? JSON.parse(data) : null;
};

export const localStorageRemoveItem = () => {
  localStorage.removeItem(keyData);
};

// ─── Cookie ───────────────────────────────────
export const removeCookie = () => {
  document.cookie = `${keyData}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;Secure;SameSite=Strict`;
};

// ─── Auth Handling ────────────────────────────
export const setAuthWithExpiry = (token, role) => {
  const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

  const authData = {
    token,
    role,
    expiry: expiryTime,
  };

  localStorage.setItem("auth", JSON.stringify(authData));
};

export const getAuthFromStorage = () => {
  const data = JSON.parse(localStorage.getItem("auth"));
  if (!data) return null;

  const currentTime = new Date().getTime();

  if (currentTime > data.expiry) {
    localStorage.removeItem("auth");
    return null;
  }

return {
  token: data.token,
  role: data.role,
  expiry: data.expiry,
};
};

// ✅ SINGLE SOURCE OF TRUTH
export const getStoredAuth = () => {
  const auth = getAuthFromStorage();

  return {
    token: auth?.token || null,
    role: auth?.role || null,
    isAuthenticated: !!auth?.token,
    persistAuth: true, // since stored in localStorage
  };
};

// ─── Permissions ──────────────────────────────
export const hasPermission = (role, adminId, requestId) => {
  if (role === "superadmin") return true;
  if (!requestId) return false;

  return role === "admin" && adminId === requestId;
};

// ─── Date & Time ──────────────────────────────
export function formatTimestamp(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
  return moment.tz(timestamp, guessedTimezone).format(format);
}

export function formatTimestampDataDisplay(
  timestamp,
  format = "YYYY-MMM-DD hh:mm:ss A"
) {
  return moment(timestamp).format(format);
}

export function formatDateForTable(timestamp, format = "MMM DD YYYY hh:mm A") {
  return moment(timestamp).tz("Asia/Kolkata").format(format);
}

// ─── Utilities ────────────────────────────────
export const getRandomHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

export function maskEmail(email) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;

  const firstChar = name.charAt(0);
  const lastChar = name.length > 1 ? name.charAt(name.length - 1) : "";
  const maskedPart = "*".repeat(Math.max(name.length - 2, 1));

  return `${firstChar}${maskedPart}${lastChar}@${domain}`;
}

// ─── Chat Date ────────────────────────────────
export const formatChatDate = (sentAt) => {
  const messageDate = new Date(sentAt);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = messageDate.toDateString() === today.toDateString();
  const isYesterday =
    messageDate.toDateString() === yesterday.toDateString();

  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay());

  const isThisWeek = messageDate > weekStart;

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  if (isThisWeek) {
    return messageDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  return messageDate.toLocaleDateString("en-GB");
};

// ─── Status Colors ────────────────────────────
export const statusColors = {
  available: { text: "text-[#43A581]", bg: "bg-[#CDF3E5]" },
  occupied: { text: "text-[#FFA013]", bg: "bg-[#FFA01333]/20" },
  reserved: { text: "text-[#FF3B30]", bg: "bg-[#FF3B3033]/20" },
  out_of_service: { text: "text-[#FF3B30]", bg: "bg-[#FF3B3033]/20" },
  merged: { text: "text-[#FF3B30]", bg: "bg-[#FF3B3033]/20" },
  approved: { text: "text-[#43A581]", bg: "bg-[#CDF3E5]" },
  pending: { text: "text-[#FFA013]", bg: "bg-[#FFA01333]/20" },
  rejected: { text: "text-[#FF3B30]", bg: "bg-[#FF3B3033]/20" },
};

// ─── Date Format ──────────────────────────────
export const formatDateForDisplay = (dateInput) => {
  if (!dateInput) return "";

  const dateObj = new Date(dateInput);
  if (isNaN(dateObj)) return "";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

// ─── Month Helpers ────────────────────────────
export const getMonthName = (label) => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  return months[label - 1] || null;
};

export const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

// ─── Currency & Sales ─────────────────────────
export function formatSalesNumber(value) {
  const num = parseFloat(value);
  const absNum = Math.abs(num);

  if (absNum >= 1e9) return (num / 1e9).toFixed(2) + "B AED";
  if (absNum >= 1e6) return (num / 1e6).toFixed(2) + "M AED";
  if (absNum >= 1e3) return (num / 1e3).toFixed(2) + "K AED";

  return num.toFixed(2) + " AED";
}

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

// ─── Days Left ────────────────────────────────
export const getDaysLeft = (assignDate, value, unit = "days") => {
  const startDate = new Date(assignDate);
  const currentDate = new Date();
  const expiryDate = new Date(startDate);

  if (unit === "days") {
    expiryDate.setDate(expiryDate.getDate() + value);
  } else if (unit === "months") {
    expiryDate.setMonth(expiryDate.getMonth() + value);
  }

  const diffTime = expiryDate - currentDate;

  if (diffTime <= 0) {
    return unit === "months" ? { daysLeft: 0, label: "Expired" } : 0;
  }

  const totalDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (unit === "days") return totalDaysLeft;

  const monthsLeft = Math.floor(totalDaysLeft / 30);
  const remainingDays = totalDaysLeft % 30;

  let label = "";
  if (monthsLeft > 0)
    label += `${monthsLeft} month${monthsLeft > 1 ? "s" : ""}`;
  if (remainingDays > 0)
    label += `${monthsLeft ? " " : ""}${remainingDays} day${remainingDays > 1 ? "s" : ""}`;

  return {
    daysLeft: totalDaysLeft,
    label,
  };
};