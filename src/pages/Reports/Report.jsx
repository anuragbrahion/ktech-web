import React, { useEffect, useRef } from "react";
import StatCard from "../../components/StatCard/StatCard";
import Dropdown from "../../components/DropDown";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Report = () => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);
  const donutChartInstance = useRef(null);

  useEffect(() => {
    // Line Chart
    if (lineChartRef.current && !lineChartInstance.current) {
      const ctx = lineChartRef.current.getContext("2d");
      lineChartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["0", "12", "10", "20", "28", "2", "24", "28"],
          datasets: [
            {
              data: [22, 28, 25, 35, 30, 34, 28, 25],
              borderColor: "#8b5cf6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              max: 40,
              ticks: { stepSize: 20 },
              grid: { color: "#f3f4f6" },
            },
            x: {
              grid: { display: false },
            },
          },
        },
      });
    }

    // Pie Chart
    if (pieChartRef.current && !pieChartInstance.current) {
      const ctx = pieChartRef.current.getContext("2d");
      pieChartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["English", "Hindi", "Nigerian"],
          datasets: [
            {
              data: [45, 30, 25],
              backgroundColor: ["#3b82f6", "#1e40af", "#60a5fa"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // Donut Chart
    if (donutChartRef.current && !donutChartInstance.current) {
      const ctx = donutChartRef.current.getContext("2d");
      donutChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["English", "Hindi", "Urdu", "Nigerian"],
          datasets: [
            {
              data: [35, 20, 25, 20],
              backgroundColor: ["#06b6d4", "#f59e0b", "#a855f7", "#f97316"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
        donutChartInstance.current = null;
      }
    };
  }, []);

  const stats = [
    { title: "Total Active Children", value: "25.1k", percentage: "+15%" },
    { title: "Total Screen Time", value: "25.1k", percentage: "+15%" },
    { title: "Total Playbacks", value: "25.1k", percentage: "+15%" },
    { title: "Top Category", value: "25.1k", percentage: "+15%" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="border rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <Dropdown
            label="Date Range"
            options={[
              { value: "7_days", label: "Last 7 Days" },
              { value: "14_days", label: "Last 14 Days" },
              { value: "30_days", label: "Last 30 Days" },
            ]}
            className=""
          />

          <Dropdown
            label="Age Group"
            options={[
              { value: "all", label: "All Ages" },
              { value: "under_13", label: "Under 13" },
              { value: "13_18", label: "13–18" },
              { value: "19_25", label: "19–25" },
            ]}
            className=""
          />

          <Dropdown
            label="Language"
            options={[
              { value: "all", label: "All Languages" },
              { value: "en", label: "English" },
              { value: "hi", label: "Hindi" },
            ]}
            className=""
          />

          <Dropdown
            label="Content Type"
            options={[
              { value: "all", label: "All Types" },
              { value: "video", label: "Video" },
              { value: "article", label: "Article" },
            ]}
            className=""
          />

          <Dropdown
            label="Subscription Plan"
            options={[
              { value: "all", label: "All Plans" },
              { value: "free", label: "Free" },
              { value: "basic", label: "Basic" },
              { value: "premium", label: "Premium" },
            ]}
            className=""
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              percentage={stat.percentage}
              onViewReport={() => console.log(`View report for ${stat.title}`)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6  shadow-sm border border-gray-100">
            <div className="mb-4">
              <h3 className="text-gray-900 font-medium mb-4">
                Daily/ Weekly usage trend
              </h3>
              <div className="flex gap-4 text-sm">
                <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                  Date
                </button>
                <button className="text-gray-400">Age</button>
                <button className="text-gray-400">Language</button>
              </div>
            </div>
            <div className="h-48">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h3 className="text-gray-900 font-medium mb-4">
                Category Engagement
              </h3>
              <div className="flex gap-4 text-sm">
                <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                  Date
                </button>
                <button className="text-gray-400">Age</button>
                <button className="text-gray-400">Language</button>
              </div>
            </div>
            <div className="flex justify-around items-end h-48">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 bg-blue-500 rounded-t"
                  style={{ height: "140px" }}
                ></div>
                <span className="text-xs text-gray-600">Video</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 bg-yellow-400 rounded-t"
                  style={{ height: "100px" }}
                ></div>
                <span className="text-xs text-gray-600">Audio</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 bg-orange-500 rounded-t"
                  style={{ height: "90px" }}
                ></div>
                <span className="text-xs text-gray-600">eBook</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 bg-blue-400 rounded-t"
                  style={{ height: "70px" }}
                ></div>
                <span className="text-xs text-gray-600">Playlist</span>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h3 className="text-gray-900 font-medium mb-4">Top Language</h3>
              <div className="flex gap-4 text-sm">
                <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                  Date
                </button>
                <button className="text-gray-400">Age</button>
                <button className="text-gray-400">Language</button>
              </div>
            </div>
            <div className="h-32 flex justify-center items-center">
              <canvas ref={pieChartRef}></canvas>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">English</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                <span className="text-gray-600">Hindi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-gray-600">Nigerian</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6  shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-medium mb-4">
              Language Distribution
            </h3>
            <div className="h-48 flex justify-center items-center mb-4">
              <canvas ref={donutChartRef}></canvas>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-gray-600">English</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">Hindi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">Urdu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600">Nigerian</span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-xl p-6  shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-medium mb-4">
              Category Engagement
            </h3>
            <div className="space-y-1">
              {["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"].map(
                (day, dayIdx) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-8">{day}</span>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, idx) => {
                        const intensity = Math.random();
                        const color =
                          intensity > 0.7
                            ? "bg-purple-700"
                            : intensity > 0.5
                            ? "bg-purple-500"
                            : intensity > 0.3
                            ? "bg-purple-300"
                            : "bg-purple-100";
                        return (
                          <div
                            key={idx}
                            className={`w-4 h-4 ${color} rounded-sm`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-600 w-8"></span>
                <div className="flex gap-4 text-xs text-gray-400">
                  {[
                    "1o",
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                  ].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

         
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6   shadow-sm border border-gray-100">
              <h3 className="text-gray-900 font-medium mb-4">Top Users</h3>
              <div className="space-y-3">
                {[
                  { num: "01.", name: "Aanya M.", hours: "36hrs" },
                  { num: "02.", name: "Rahul S.", hours: "36hrs" },
                  { num: "03.", name: "Mauh I..", hours: "36hrs" },
                  { num: "04.", name: "Amhu.", hours: "36hrs" },
                  { num: "05.", name: "Yateran", hours: "36hrs" },
                ].map((user) => (
                  <div
                    key={user.num}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-900">
                      {user.num} {user.name}
                    </span>
                    <span className="text-gray-600">{user.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
