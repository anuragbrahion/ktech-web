import moment from "moment-timezone";

const guessedTimezone = moment.tz.guess();
const keyData = "buggy-billing-system";

export const sessionStorageSetItem = (item) => {
  return sessionStorage.setItem(keyData, JSON.stringify(item));
};

export const sessionStorageGetItem = () => {
  const data = window.sessionStorage.getItem(keyData);
  return data ? JSON.parse(data) : null;
};

export const removeCookie = () => {
  document.cookie = `${keyData}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;Secure;SameSite=Strict`;
};

export const sessionStorageRemoveItem = () => {
  sessionStorage.removeItem(keyData);
};

export const localStorageSetItem = (item) => {
  localStorage.setItem(keyData, JSON.stringify(item));
};

export function formatTimestamp(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
  return moment.tz(timestamp, guessedTimezone).format(format);
}

export function formatTimestampDataDisplay(
  timestamp,
  format = "YYYY-MMM-DD hh:mm:ss A",
) {
  return moment(timestamp).format(format);
}

export const localStorageGetItem = () => {
  const data = localStorage.getItem(keyData);
  return data ? JSON.parse(data) : null;
};

export const localStorageRemoveItem = () => {
  localStorage.removeItem(keyData);
};

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
  return data;
};

  export  const getStoredAuth = () => {
   const token = getAuthFromStorage()
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  const persistAuth = localStorage.getItem("persistAuth") === "true";
  
  return {
    token,
    role,
    isAuthenticated: !!token,
    persistAuth
  };
};

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

export const formatChatDate = (sentAt) => {
  const messageDate = new Date(sentAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = messageDate.toDateString() === today.toDateString();
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  const isThisWeek =
    messageDate > new Date(today.setDate(today.getDate() - today.getDay()));

  if (isToday) return `Today`;
  if (isYesterday) return `Yesterday`;
  if (isThisWeek) {
    return `${messageDate.toLocaleDateString("en-US", { weekday: "long" })}`;
  }

  return messageDate.toLocaleDateString("en-GB");
};

export const statusColors = {
  available: {
    text: "text-[#43A581]",
    bg: "bg-[#CDF3E5]",
  },
  occupied: {
    text: "text-[#FFA013]",
    bg: "bg-[#FFA01333]/20",
  },
  reserved: {
    text: "text-[#FF3B30]",
    bg: "bg-[#FF3B3033]/20",
  },
  out_of_service: {
    text: "text-[#FF3B30]",
    bg: "bg-[#FF3B3033]/20",
  },
  merged: {
    text: "text-[#FF3B30]",
    bg: "bg-[#FF3B3033]/20",
  },
  approved: {
    text: "text-[#43A581]",
    bg: "bg-[#CDF3E5]",
  },
  pending: {
    text: "text-[#FFA013]",
    bg: "bg-[#FFA01333]/20",
  },
  rejected: {
    text: "text-[#FF3B30]",
    bg: "bg-[#FF3B3033]/20",
  },
};

export const formatDateForDisplay = (dateInput) => {
  if (!dateInput) return "";

  let dateObj;

  if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else {
    dateObj = new Date(dateInput);
    if (isNaN(dateObj)) {
      return "";
    }
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getMonthName = (label) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[label - 1] || null;
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatSalesNumber(value) {
  const num = parseFloat(value);
  const absNum = Math.abs(num);

  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B AED";
  } else if (absNum >= 1000000) {
    return (num / 1000000).toFixed(2) + "M AED";
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(2) + "K AED";
  }
  return num.toFixed(2) + " AED";
}

export function formatDateForTable(timestamp, format = "MMM DD YYYY hh:mm A") {
  return moment(timestamp).tz("Asia/Kolkata").format(format);
}

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const getDaysLeft = (assignDate, value, unit = "days") => {
  const startDate = new Date(assignDate);
  const currentDate = new Date();
  const expiryDate = new Date(startDate);

  // Add duration
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

  // If only days → return single value
  if (unit === "days") {
    return totalDaysLeft;
  }

  // If months → return formatted label
  const monthsLeft = Math.floor(totalDaysLeft / 30);
  const remainingDays = totalDaysLeft % 30;

  let label = "";
  if (monthsLeft > 0)
    label += `${monthsLeft} month${monthsLeft > 1 ? "s" : ""}`;
  if (remainingDays > 0)
    label += `${monthsLeft > 0 ? " " : ""}${remainingDays} day${remainingDays > 1 ? "s" : ""}`;

  return {
    daysLeft: totalDaysLeft,
    label,
  };
};