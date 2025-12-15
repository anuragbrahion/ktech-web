import DonutChart from '../DashboardDonutChart/DashboardChart';

export default function SalesDashboard({
  yearToDateSales = 26000,
  salesTrend = 10, // percentage
  totalSales = 75500,
  todaySales = "",
  monthlyRevenue = 10000,
  monthlyExpenses = 10000,
  topSellingItem = "",
  peakHours = "7:00 PM - 9:00 PM",
  visitsToday = 120,
}) {
  const todaySalesPercentage = ((todaySales / monthlyRevenue) * 100).toFixed(2);
  const remainingPercentage = (100 - todaySalesPercentage).toFixed(2);

  const donutData = [
    {
      label: `Today Sales (${todaySalesPercentage}%)`,
      value: parseFloat(todaySalesPercentage),
      color: '#883DCF',
    },
    {
      label: `Remaining Revenue (${remainingPercentage}%)`,
      value: parseFloat(remainingPercentage),
      color: '#2BB2FE',
    },
  ];
  
  
  return (
    <div className="bg-white/90 p-4 rounded-lg w-full ">
      <DonutChart
        data={donutData}
      />
      <div className="flex flex-col md:flex-row gap-8">
        {/* Stats */}
        <div className="flex-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#883DCF] mr-2"></span>
                <span className="text-sm">Total Sales (Today)</span>
              </div>
              <span className="font-medium">{todaySales} AED</span>
            </div>

            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#2BB2FE] mr-2"></span>
                <span className="text-sm">Total Revenue (This Month)</span>
              </div>
              <span className="font-medium">{monthlyRevenue.toLocaleString()} AED</span>
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
                <span className="text-sm">Total Expenses (This Month)</span>
              </div>
              <span className="font-medium">${monthlyExpenses.toLocaleString()}</span>
            </div> */}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                <span className="text-sm">Top-Selling Item</span>
              </div>
              <span className="font-medium">{topSellingItem}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-600 mr-2"></span>
                <span className="text-sm">Peak Hour (Today)</span>
              </div>
              <span className="font-medium">{peakHours}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-700 mr-2"></span>
                <span className="text-sm">Customer Visits (Today)</span>
              </div>
              <span className="font-medium">{visitsToday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}