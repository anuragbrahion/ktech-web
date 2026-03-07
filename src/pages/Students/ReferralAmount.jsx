/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { getProfileData } from "../../redux/slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/Loader/Loader";

const ReferralAmount = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const getProfileDataData = useSelector(
    (state) => state?.admin?.getProfileDataData,
  );
  const referralCode = getProfileDataData?.data?.data?.referralCode || "N/A";
  const amount = getProfileDataData?.data?.data?.amount || 0;

  const fetchMyProfile = () => {
    setLoading(true);

    dispatch(getProfileData()).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch tasks list");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  console.log("getProfileDataData", getProfileDataData);

  return (
    <>
      <LoadingSpinner loading={loading} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Referrals</h1>
        <p className="text-gray-600 mt-2">Manage your referrals</p>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
        {/* Referral Code */}
        <div>
          <p className="text-gray-500 text-sm">Referral Code</p>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-lg uppercase">{referralCode}</p>

            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-green-100 text-gray-600 hover:text-green-700 transition"
              title="Copy Code"
            >
              <FiCopy size={18} />
            </button>

            {copied && <span className="text-xs text-green-600">Copied</span>}
          </div>
        </div>

        {/* Referral Amount */}
        <div className="text-right">
          <p className="text-gray-500 text-sm">Referral Amount</p>
          <p className="font-semibold text-lg text-green-600">₹{amount}</p>
        </div>
      </div>
    </>
  );
};

export default ReferralAmount;
