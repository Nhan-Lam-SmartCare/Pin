import React, { useState, useEffect } from "react";
import { usePinContext } from "../contexts/PinContext";
import { createAnalyticsService } from "../lib/services/AnalyticsService";
import type { TimeSeriesData } from "../lib/services/AnalyticsService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardGrid, StatsCard } from "./ui/Card";
import { Icon } from "./common/Icon";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const AdvancedAnalyticsDashboard: React.FC = () => {
  const ctx = usePinContext();
  const analyticsService = createAnalyticsService(ctx);

  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "6months">("30days");
  const [loading, setLoading] = useState(false);

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "6months":
        startDate = subMonths(now, 6);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate: now };
  };

  // Load analytics data
  const { startDate, endDate } = getDateRange();
  const timeSeriesData = analyticsService.getRevenueTimeSeries(
    startDate,
    endDate,
    timeRange === "6months" ? "month" : "day"
  );
  const topProducts = analyticsService.getTopProducts(10);
  const topCustomers = analyticsService.getTopCustomers(10);
  const categoryBreakdown = analyticsService.getCategoryBreakdown();
  const financialMetrics = analyticsService.getFinancialMetrics();
  const trendDirection = analyticsService.getTrendDirection();
  const predictedRevenue = analyticsService.predictNextMonthRevenue();

  // Year over year comparison
  const currentYear = new Date().getFullYear();
  const yoyComparison = analyticsService.compareYearOverYear(currentYear);

  // Month over month comparison
  const currentMonth = new Date().getMonth() + 1;
  const momComparison = analyticsService.compareMonthOverMonth(currentMonth, currentYear);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-3 p-3 lg:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="text-base">📊</span> Phân tích Nâng cao
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Tổng quan kinh doanh và xu hướng
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1">
          {[
            { value: "7days", label: "7 ngày" },
            { value: "30days", label: "30 ngày" },
            { value: "6months", label: "6 tháng" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === option.value
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatsCard
          title="Tổng doanh thu"
          value={`${formatCurrency(financialMetrics.totalRevenue)} đ`}
          iconName="money"
          variant="primary"
          compact
          trend={{
            value: yoyComparison.growth.revenue,
            label: "so với năm trước",
          }}
        />
        <StatsCard
          title="Lợi nhuận gộp"
          value={`${formatCurrency(financialMetrics.grossProfit)} đ`}
          iconName="success"
          variant="success"
          compact
          trend={{
            value: financialMetrics.profitMargin,
            label: "biên lợi nhuận",
          }}
        />
        <StatsCard
          title="Đơn hàng"
          value={financialMetrics.totalOrders}
          iconName="orders"
          variant="warning"
          compact
          trend={{
            value: momComparison.growth.orders,
            label: "so với tháng trước",
          }}
        />
        <StatsCard
          title="Giá trị TB/đơn"
          value={`${formatCurrency(financialMetrics.averageOrderValue)} đ`}
          iconName="capital"
          variant="info"
          compact
        />
      </div>

      {/* Predictive Analytics */}
      <Card padding="sm">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
          <Icon name="highlight" size="sm" tone="primary" />
          Dự báo & Xu hướng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-lg">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
              Dự báo doanh thu tháng sau
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-200">
              {formatCurrency(predictedRevenue)} đ
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-lg">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
              Xu hướng hiện tại
            </div>
            <div
              className={`text-base font-bold flex items-center gap-1 ${
                trendDirection === "up"
                  ? "text-green-600 dark:text-green-400"
                  : trendDirection === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {trendDirection === "up"
                ? "📈 Tăng trưởng"
                : trendDirection === "down"
                  ? "📉 Giảm"
                  : "➡️ Ổn định"}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-lg">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
              Tăng trưởng YoY
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-200">
              {formatPercent(yoyComparison.growth.revenue)}
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Trend Chart */}
      <Card padding="sm">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
          Xu hướng Doanh thu & Lợi nhuận
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
            <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => formatCurrency(value) + " đ"}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Doanh thu"
              dot={{ fill: "#3b82f6" }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              name="Lợi nhuận"
              dot={{ fill: "#10b981" }}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Chi phí"
              dot={{ fill: "#f59e0b" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Products */}
        <Card padding="sm">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Top 10 Sản phẩm Bán chạy
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#64748b"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number) => formatCurrency(value) + " đ"}
              />
              <Bar dataKey="totalRevenue" fill="#3b82f6" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card padding="sm">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Phân bố theo Danh mục
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.category}: ${entry.percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value) + " đ"} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Customers */}
      <Card padding="sm">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Top 10 Khách hàng Tiềm năng
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                  #
                </th>
                <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                  Khách hàng
                </th>
                <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                  SĐT
                </th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                  Tổng chi tiêu
                </th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                  Số đơn
                </th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-400">
                  TB/đơn
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400">{index + 1}</td>
                  <td className="py-1.5 px-2 font-medium text-slate-800 dark:text-slate-200">
                    {customer.name}
                  </td>
                  <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400">
                    {customer.phone}
                  </td>
                  <td className="py-1.5 px-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(customer.totalRevenue)} đ
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-500 dark:text-slate-400">
                    {customer.orderCount}
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-500 dark:text-slate-400">
                    {formatCurrency(customer.averageOrderValue)} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
