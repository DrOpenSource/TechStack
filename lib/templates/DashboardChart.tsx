function Component({ mockData = {} }) {
  const {
    title = "Revenue Analytics",
    period = "Last 7 Days",
    totalRevenue = 45231,
    growth = 12.5,
    chartData = [
      { day: "Mon", revenue: 4200, users: 124 },
      { day: "Tue", revenue: 5100, users: 148 },
      { day: "Wed", revenue: 6800, users: 192 },
      { day: "Thu", revenue: 5500, users: 156 },
      { day: "Fri", revenue: 7200, users: 203 },
      { day: "Sat", revenue: 8900, users: 247 },
      { day: "Sun", revenue: 7530, users: 218 },
    ],
    metrics = [
      { label: "Total Users", value: "1,288", change: "+8.2%", trend: "up" },
      { label: "Conversion Rate", value: "3.24%", change: "+0.5%", trend: "up" },
      { label: "Avg Order Value", value: "$35.12", change: "-2.1%", trend: "down" },
    ],
  } = mockData;

  const [selectedMetric, setSelectedMetric] = React.useState("revenue");
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{period}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Main Revenue Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <div className="flex items-baseline mt-2">
                  <h3 className="text-4xl font-bold">
                    ${totalRevenue.toLocaleString()}
                  </h3>
                  <span className="ml-3 text-xl font-medium text-blue-100">USD</span>
                </div>
                <div className="flex items-center mt-3">
                  <svg
                    className="w-5 h-5 text-green-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-green-300 font-medium">
                    +{growth}% from last week
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {metric.value}
              </h3>
              <div className="flex items-center mt-3">
                {metric.trend === "up" ? (
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span
                  className={`ml-2 text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              <p className="text-gray-600 text-sm mt-1">Daily breakdown</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={() => setSelectedMetric("revenue")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === "revenue"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric("users")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === "users"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Users
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-sm text-gray-600">
              {[maxRevenue, maxRevenue * 0.75, maxRevenue * 0.5, maxRevenue * 0.25, 0].map(
                (value, index) => (
                  <div key={index} className="text-right pr-2">
                    ${(value / 1000).toFixed(1)}k
                  </div>
                )
              )}
            </div>

            {/* Chart area */}
            <div className="absolute left-16 right-0 top-0 bottom-8 flex items-end justify-between px-4">
              {chartData.map((data, index) => {
                const value = selectedMetric === "revenue" ? data.revenue : data.users;
                const maxValue =
                  selectedMetric === "revenue"
                    ? maxRevenue
                    : Math.max(...chartData.map((d) => d.users));
                const height = (value / maxValue) * 100;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center mx-1">
                    {/* Bar */}
                    <div className="relative w-full group">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                        style={{ height: `${height}%`, minHeight: "4px" }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <div className="font-medium">{data.day}</div>
                            <div className="text-gray-300">
                              {selectedMetric === "revenue"
                                ? `$${value.toLocaleString()}`
                                : `${value} users`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-16 right-0 bottom-0 flex items-center justify-between px-4 h-8">
              {chartData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 text-center text-sm text-gray-600 mx-1"
                >
                  {data.day}
                </div>
              ))}
            </div>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute left-16 right-0 border-t border-gray-200"
                style={{ top: `${100 - percent}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <span className="text-gray-600">
                {selectedMetric === "revenue" ? "Revenue" : "Users"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
