import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getEmpRefAmount,
  updateEmpRefAmount,
} from "../../redux/slices/branch";
import { toast } from "react-toastify";

const ReferralAmount = () => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

   useEffect(() => {
    setLoading(true);
    dispatch(getEmpRefAmount())
      .then((action) => {
        if (action.payload?.data) {
          setAmount(action.payload.data.amount);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load referral amount");
      })
      .finally(() => {
        setLoading(false);
      });
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
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update amount");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-12">
        <h2 className="text-2xl font-semibold text-start mb-6">
          Referral Amount
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        ) : (
          <>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter amount"
            />

            <div className="flex justify-center mt-6">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className={`px-6 py-2 rounded-md text-white transition ${
                  updating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralAmount;