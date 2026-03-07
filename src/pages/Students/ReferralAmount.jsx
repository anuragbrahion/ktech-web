import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

const ReferralAmount = () => {
  const referralCode = "4990fjicj3";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6">
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
        
        {/* Referral Code */}
        <div>
          <p className="text-gray-500 text-sm">Referral Code</p>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-lg">{referralCode}</p>

            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-green-100 text-gray-600 hover:text-green-700 transition"
              title="Copy Code"
            >
              <FiCopy size={18} />
            </button>

            {copied && (
              <span className="text-xs text-green-600">Copied</span>
            )}
          </div>
        </div>

        {/* Referral Amount */}
        <div className="text-right">
          <p className="text-gray-500 text-sm">Referral Amount</p>
          <p className="font-semibold text-lg text-green-600">₹100</p>
        </div>

      </div>
    </div>
  );
};

export default ReferralAmount;