import { useState } from 'react';
import { AiOutlineMinus } from "react-icons/ai";
const FinanceCalculator = () => {
  const [values, setValues] = useState({
    revenue: '',
    commission: '',
    capex: '',
    opex: '',
    taxes: ''
  });

  const [totalProfit, setTotalProfit] = useState(0);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const calculateProfit = () => {
    const revenue = parseFloat(values.revenue) || 0;
    const commission = parseFloat(values.commission) || 0;
    const capex = parseFloat(values.capex) || 0;
    const opex = parseFloat(values.opex) || 0;
    const taxes = parseFloat(values.taxes) || 0;

    const profit = revenue - commission - capex - opex - taxes;
    setTotalProfit(profit);
  };

  return (
    <div className='space-y-4 max-w-full mx-auto'>
      <div>
        <h2 className='text-[#1D1F2C] text-xl font-semibold'>Profits</h2>
        <p className='text-[#777980] text-sm font-normal'>Revenue and Sales</p>
      </div>

      {/* Revenue */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#1D1F2C] text-xl font-semibold'>Revenue</h2>
          <p className='text-[#777980] text-sm font-normal'>Revenue and Sales</p>
        </div>
        <div>
          <input
            className='bg-[#EEEEEE] px-3 py-1 text-[#1D1F2C] rounded w-24 outline-none'
            id='revenue'
            value={values.revenue}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            placeholder='2000'

          />
        </div>
      </div>

      {/* Commission */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#1D1F2C] text-xl font-semibold'>Commissions</h2>
          <p className='text-[#777980] text-sm font-normal'>Revenue and Sales</p>
        </div>
        <div className='flex items-center gap-1'>
          <AiOutlineMinus className='text-red-500' />
          <input
            className='bg-[#EEEEEE] px-3 py-1 text-[#1D1F2C] rounded w-24 outline-none'
            id='commission'
            value={values.commission}
             onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            onChange={handleInputChange}
            placeholder='2000'
          />
        </div>
      </div>

      {/* CAPEX */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#1D1F2C] text-xl font-semibold'>CAPEX</h2>
          <p className='text-[#777980] text-sm font-normal'>Capital Expenditure</p>
        </div>
        <div className='flex items-center gap-1'>
          <AiOutlineMinus className='text-red-500' />
          <input
            className='bg-[#EEEEEE] px-3 py-1 text-[#1D1F2C] rounded w-24 outline-none'
            id='capex'
            value={values.capex}
             onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            onChange={handleInputChange}
            placeholder='2000'
          />
        </div>
      </div>

      {/* OPEX */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#1D1F2C] text-xl font-semibold'>OPEX</h2>
          <p className='text-[#777980] text-sm font-normal'>Operating Expenditure</p>
        </div>
        <div className='flex items-center gap-1'>
          <AiOutlineMinus className='text-red-500' />
          <input
            className='bg-[#EEEEEE] px-3 py-1 text-[#1D1F2C] rounded w-24 outline-none'
            id='opex'
            value={values.opex}
             onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            onChange={handleInputChange}
            placeholder='2000'

          />
        </div>
      </div>

      {/* Taxes */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#1D1F2C] text-xl font-semibold'>Taxes</h2>
          <p className='text-[#777980] text-sm font-normal'>Tax Deductions</p>
        </div>
        <div className='flex items-center gap-1'>
          <AiOutlineMinus className='text-red-500' />
          <input
            className='bg-[#EEEEEE] px-3 py-1 text-[#1D1F2C] rounded w-24 outline-none'
            id='taxes'
            value={values.taxes}
             onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            onChange={handleInputChange}
            placeholder='2000'
          />
        </div>
      </div>

      {/* Total Profit */}
      <div className='flex justify-between items-center bg-[#F2F2F2] rounded-lg p-3'>
        <div>
          <h2 className='text-[#1D1F2C] text-xl font-semibold'>Total Profit</h2>
          <p className='text-[#777980] text-sm font-normal'>After Taxes</p>
        </div>
        <div>
          <h2 className='text-[#1D1F2C]'>{totalProfit.toFixed(2)}</h2>
        </div>
      </div>

      {/* Calculate Button */}
      <div>
        <button
          className='bg-[#FF9F43] px-3 py-2 w-full text-[#fff] font-bold rounded-md'
          onClick={calculateProfit}
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default FinanceCalculator;