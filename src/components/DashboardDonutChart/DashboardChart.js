import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChart = ({ data }) => {
    const COLORS = ['#2BB2FE', '#883DCF', "#F86624"];

    // Currency Formatter for AED (modified to place currency after value)
    const currencyFormatter = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AED',
            maximumFractionDigits: 0,
            currencyDisplay: 'code'
        }).format(value).replace('AED', '').trim() + ' AED';

    // Format the data and add names for tooltips
    const formattedData = data.map((item, index) => ({
        ...item,
        name: item.label || `Segment ${index + 1}`,
    }));

    return (
        <div className="flex items-center justify-center relative">
            <ResponsiveContainer width={250} height={250}>
                <PieChart width={500} height={500}>
                    <Tooltip
                        content={({ active, payload }) =>
                            active && payload && payload.length ? (
                                <div className="bg-gray-800 text-white p-2 rounded-md shadow-md">
                                    <p className="font-medium">
                                        {payload[0].name}: {payload[0].value.toFixed(2)}%
                                    </p>
                                </div>
                            ) : null
                        }
                    />
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={90}
                        fill="#883DCF"
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={1}
                        cornerRadius={10}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isEmpty ? '#F86624' : COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-gray-700">
                {/* <div className="text-2xl font-semibold flex items-center">
                    {currencyFormatter(data[0].value).split(' ')[0]}
                    <span className="text-2xl ml-1">AED</span>
                </div> */}
                <div className="text-2xl font-semibold flex items-center">
                    {currencyFormatter(isNaN(data[0].value) ? 0 : data[0].value).split(' ')[0]}
                    <span className="text-2xl ml-1">AED</span>
                </div>

                {/* <div className="text-sm bg-[#E9FAF7] px-3 py-1 font-medium text-[#1A9882] mt-2 rounded-md">
                    ({data[0].value.toFixed(2)}%)
                </div> */}
                <div className="text-sm bg-[#E9FAF7] px-3 py-1 font-medium text-[#1A9882] mt-2 rounded-md">
                    ({isNaN(data[0].value) ? '0' : data[0].value.toFixed(2)}%)
                </div>
            </div>
        </div>
    );
};

export default DonutChart;