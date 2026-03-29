/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rulesAllDocuments } from "../../redux/slices/employee";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const EmployeeRulesAndRegulations = ({ roleData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const rulesAllDocumentsData = useSelector(
    (state) => state.employee?.rulesAllDocumentsData,
  );

  const fetchRulesAndRegulations = () => {
    setLoading(true);
    const params = {
      query: JSON.stringify({
        role: roleData === "teacher" ? "Teacher" : "Student",
        status: true,
      }),
      select: "rule",
    };

    dispatch(rulesAllDocuments(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch rules");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRulesAndRegulations();
  }, []);

  return (
    <>
      <Loader loading={loading} />

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rule And Regulation
          </h1>
          <p className="text-gray-600 mt-2">View all rules and regulations</p>
        </div>
      </div>

      {rulesAllDocumentsData?.data?.data?.list?.length ? (
        <ul className="space-y-2">
          {rulesAllDocumentsData?.data?.data?.list.map((item) => (
            <li
              key={item._id}
              className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700">{item.rule}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No rules found</p>
      )}
    </>
  );
};

export default EmployeeRulesAndRegulations;
