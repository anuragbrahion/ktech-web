import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatSalesNumber } from '../../utils/globalFunction';

const CommissionCharts = ({
  title = "Commissions",
  subtitle = "Revenue and Commission",
  data = [],
  lines = [
    {
      dataKey: "revenue",
      name: "Revenue",
      color: "#8B5CF6",
      strokeWidth: 3,
      showInLegend: true
    },
    {
      dataKey: "commission",
      name: "Commission",
      color: "#F97316",
      strokeWidth: 3,
      showInLegend: true
    }
  ],
  xAxisKey = "month",
  yAxisFormatter = (value) => `${value}`,
  yAxisDomain = [0, 'dataMax + 100'],
  yAxisTicks,
  containerHeight = 300,
  className = "",
  tooltipFormatter = (value, name) => {
    return [formatSalesNumber(value), name];
  },
  onItemClick,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  showMarkerLine = true,
  animationDuration = 1000
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle cursor movement
  const handleMouseMove = (e) => {
    if (e && e.activeCoordinate) {
      setTooltipPos({
        x: e.activeCoordinate.x,
        y: e.activeCoordinate.y
      });

      if (e.activePayload && e.activePayload.length) {
        const item = data.find(d => d[xAxisKey] === e.activeLabel);
        setActiveItem(item);
      }
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  // Handle click on XAxis
  const handleXAxisClick = (e) => {
    if (e && e.activeLabel) {
      const clickedItem = data.find(item => item[xAxisKey] === e.activeLabel);
      setActiveItem(clickedItem);
      if (onItemClick) onItemClick(clickedItem);
    }
  };

  // Custom XAxis tick component
  const CustomizedAxisTick = ({ x, y, payload }) => {
    const isActive = activeItem && activeItem[xAxisKey] === payload.value;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={isActive ? "#883DCF" : "#667085"}
          fontSize={15}
          fontWeight={isActive ? "bold" : "normal"}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 w-full ${className}`} ref={chartRef}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1D1F2C]">{title}</h2>
        <div className='flex justify-between place-items-center '>
          {subtitle && <p className="text-sm font-normal pt-1 text-[#777980]">{subtitle}</p>}
          {showLegend && (
            <div className="flex items-center justify-end gap-8 ">
              {lines.filter(line => line.showInLegend !== false).map((line, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }}></div>
                  <span className="text-xs font-medium text-[#667085]">{line.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>



      <div
        className={`relative`}
        style={{ height: containerHeight }}
        ref={containerRef}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleXAxisClick}
          >
            <defs>
              {lines.map((line, index) => (
                <linearGradient
                  key={index}
                  id={`color${line.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#C2C6CE"
              />
            )}
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={<CustomizedAxisTick />}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#667085', fontSize: 15 }}
              tickFormatter={yAxisFormatter}
              domain={yAxisDomain}
              ticks={yAxisTicks}
            />
            {showTooltip && (
              <Tooltip
                content={<></>} // Empty content since we're using custom tooltip
                cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
            )}
            {lines.map((line, index) => (
              <Line
                key={index}
                type="basis"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                dot={line.dot || false}
                activeDot={{
                  r: 6,
                  fill: line.color,
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                isAnimationActive={line.animation !== false}
                animationDuration={animationDuration}
                animationEasing="ease-in-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Custom tooltip overlay */}
        {showTooltip && activeItem && (
          <div
            className="absolute bg-gray-900 text-white p-3 rounded-md shadow-lg pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x - 70, containerSize.width - 150),
              top: 20,
              zIndex: 10,
              opacity: 0.95,
              transform: 'translateX(-50%)',
              minWidth: '140px'
            }}
          >
            {lines.map((line, index) => (
              activeItem[line.dataKey] !== undefined && (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }}></div>
                  <span className="text-sm font-medium">{line.name}: </span>
                  <span className="text-sm font-semibold">
                    {tooltipFormatter(activeItem[line.dataKey], line.dataKey)[0]}
                  </span>
                </div>
              )
            ))}
            <div className="text-xs mt-1 text-gray-300">
              {activeItem[xAxisKey]}
            </div>
          </div>
        )}

        {/* Vertical marker line */}
        {showMarkerLine && activeItem && (
          <div
            className="absolute top-0 h-full border-l border-gray-400 border-dashed pointer-events-none"
            style={{
              left: tooltipPos.x,
              borderLeftWidth: '1px',
              zIndex: 5
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default CommissionCharts;