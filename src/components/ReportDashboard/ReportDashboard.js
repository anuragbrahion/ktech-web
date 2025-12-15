import React, { useEffect } from 'react';
import DonutChart from 'react-donut-chart';
import { useDispatch, useSelector } from 'react-redux';
import { salesSource } from '../../redux/slices/AdminSlice';
import { formatSalesNumber } from '../../utils/globalFunction';

const ReportDashboard = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state.admin);
    const salesSourceData = selector?.salesSourceData?.data?.data;

    useEffect(() => {
        dispatch(salesSource());
    }, [dispatch]);

    const transformData = (apiData) => {
        if (!apiData) return [];
        return apiData.map(item => ({
            label: item.service,
            value: formatSalesNumber(item.totalSale),
        }));
    };

    const chartData = salesSourceData ? transformData(salesSourceData) : [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    const totalSales = salesSourceData?.reduce((sum, item) => sum + item.totalSale, 0);
    const formattedTotal = formatSalesNumber(totalSales);

    if (!salesSourceData) {
        return (
            <div className="w-full h-60 flex items-center justify-center">
                <p className="text-gray-500 text-lg font-medium">Loading sales data...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 space-y-10 capitalize">
            <h2 className="text-3xl font-bold text-gray-800">Sales Source</h2>

            <div className="flex flex-col items-center">
                <div className="relative w-56 h-48">
                    <DonutChart
                        data={chartData.map((item, index) => ({
                            ...item,
                            color: colors[index % colors.length],
                        }))}
                        width={220}
                        height={220}
                        legend={false}
                        interactive={false}
                        innerRadius={0.7}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-lg font-semibold text-gray-800">{formattedTotal}</div>
                        <div className="text-sm text-gray-600">Total Sales</div>
                    </div>
                </div>
            </div>

            <div className=" w-full ">
                {chartData.map((item, index) => (
                    <div
                        key={`${item.label}-${index}`}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md  transition"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: colors[index % colors.length] }}
                            ></span>
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportDashboard;
