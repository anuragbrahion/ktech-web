import { ChevronDown } from "lucide-react";
import Dropdown from "./Dropdown";

const TotalPricingDetails = ({
  expandedSection,
  toggleSection,
  formData,
  errors,
  handleChange,
  submitData,totalAmount
}) => {
  return (
    <div className="mb-6 p-6 rounded-xl bg-white shadow-sm border border-gray-100">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => toggleSection("paymentDetails")}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
          Total Pricing Details
        </h2>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 group-hover:text-gray-700 ${
            expandedSection === "paymentDetails" ? "rotate-180" : ""
          }`}
        />
      </div>

      {expandedSection === "paymentDetails" && (
        <div className="mt-6 space-y-4">
          {/* Payment Mode */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Payment Mode</span>
            <span className="text-sm font-semibold text-gray-800 capitalize">
              {formData.paymentMethod}
            </span>
          </div>

          {/* GST Input */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="taxPercent" className="text-sm font-medium text-gray-600">
                GST %
              </label>
              <div className="relative">
                <input
                  id="taxPercent"
                  name="taxPercent"
                  value={formData.taxPercent ?? "0"}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  onInput={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) {
                      e.target.value = 0;
                    } else if (value > 99) {
                      e.target.value = 99;
                    }
                  }}
                  className="bg-white border border-gray-300 px-8 py-2 text-gray-700 rounded-lg w-32 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  placeholder="0"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
            {errors.taxPercent && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.taxPercent}
              </span>
            )}
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
            <span className="text-base font-semibold text-gray-800">
              ₹{totalAmount || "0"}
            </span>
          </div>

          {/* Discount Code */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <label htmlFor="discountCode" className="block text-sm font-medium text-gray-600 mb-1">
              Discount Code
            </label>
            <input
              id="discountCode"
              name="discountCode"
              value={formData.discountCode || ""}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. WELCOME50"
            />
          </div>

          {/* Discount Type */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Discount Type
            </label>
            <Dropdown
              options={[
                { value: "Flat", label: "Flat" },
                { value: "Percentage", label: "Percentage" },
              ]}
              value={formData.discountPkg}
              mainClassName="w-full"
              onChange={(value) =>
                handleChange({ target: { name: "discountPkg", value } })
              }
              placeholder="Select discount type"
              name="discountPkg"
              error={errors.discountPkg}
            />
          </div>

          {formData.discountPkg && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-600 mb-1">
                Discount Value ({formData.discountPkg === "Flat" ? "₹" : "%"})
              </label>
              <input
                id="discountValue"
                name="discountValue"
                value={formData.discountValue || ""}
                onChange={handleChange}
                type="number"
                min="0"
                className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TotalPricingDetails;