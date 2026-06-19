import { useState, useEffect } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/admin.css";

function AdminDashboardPage() {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await API.get("/admin/revenue");
        const payload = response.data;
        // Backend returns { success: true, data: { totalRevenue, totalOrders, revenueByDay } }
        const data = payload?.data || payload;
        setRevenueData(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch revenue");
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
        </div>
        <div>Loading revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
        </div>
        <div className="admin-toast toast-error" style={{position: 'relative', top: 0, right: 0, width: 'fit-content'}}>{error}</div>
      </div>
    );
  }

  const safeRevenueByDay = Array.isArray(revenueData?.revenueByDay) ? revenueData.revenueByDay : [];

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="admin-dashboard-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Revenue</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(revenueData?.totalRevenue || 0)}
          </div>
        </div>
        <div className="admin-dashboard-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Orders</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            {revenueData?.totalOrders || 0}
          </div>
        </div>
      </div>

      <div className="admin-dashboard-chart" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px', color: '#0f172a' }}>Revenue By Day</h3>
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={safeRevenueByDay}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={(value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value)} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value) => [new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value), 'Revenue']}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
