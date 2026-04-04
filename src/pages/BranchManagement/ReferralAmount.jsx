import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getEmpRefAmount, updateEmpRefAmount } from "../../redux/slices/branch";
import { toast } from "react-toastify";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const ReferralAmount = ({ roleData }) => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    dispatch(getEmpRefAmount())
      .then((action) => {
        if (action.payload?.data) {
          setAmount(action.payload.data.amount);
          setHistory(action.payload.data?.history || []);
        }
      })
      .catch(() => toast.error("Failed to load referral amount"))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleUpdate = async () => {
    if (!amount) {
      toast.warning("Please enter an amount");
      return;
    }

    setUpdating(true);
    try {
      const action = await dispatch(updateEmpRefAmount({ amount }));
      if (action.payload?.data) {
        toast.success(action.payload.data.message);

        const res = await dispatch(getEmpRefAmount());
        setAmount(res.payload?.data?.amount);
        setHistory(res.payload?.data?.history || []);
      }
    } catch {
      toast.error("Failed to update amount");
    } finally {
      setUpdating(false);
    }
  };

  // 📊 Calculate percentage change
  const getPercentage = (oldVal, newVal) => {
    if (!oldVal) return 0;
    return (((newVal - oldVal) / oldVal) * 100).toFixed(1);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Referral Amount
            </h2>
            <p className="text-sm text-gray-500">
              Manage referral reward value
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Input Row */}
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={roleData !== "superadmin"}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter amount"
                />
              </div>

              {roleData === "superadmin" && (
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className={`px-5 py-3.5 text-sm rounded-lg text-white ${
                    updating
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Change History
                </h3>

                <div className="divide-y">
                  {[...history].reverse().map((item, i) => {
                    const percent = getPercentage(
                      item.oldAmount,
                      item.newAmount
                    );
                    const isIncrease = item.newAmount > item.oldAmount;

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-md ${
                              isIncrease
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {isIncrease ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownRight size={14} />
                            )}
                          </div>

                          <div>
                            <p className="text-gray-800">
                              ₹{item.oldAmount} → ₹{item.newAmount}
                            </p>
                            <p
                              className={`text-xs ${
                                isIncrease
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {isIncrease ? "+" : ""}
                              {percent}%
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralAmount;