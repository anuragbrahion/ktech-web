import { useState } from "react";

const ReferralAmount = () => {
  const [amount, setAmount] = useState("200");

  const handleUpdate = () => {
    console.log("Updated Amount:", amount);
    // API call logic here
  };

  return (
    <div className="items-center justify-center">
      <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Referral Amount List</h1>
              <p className="text-black mt-2">Manage all Referral records</p>
            </div>
          </div>
        </div>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Referral Amount
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter amount"
        />

        <div className="flex justify-center mt-6">
          <button
            onClick={handleUpdate}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralAmount;
