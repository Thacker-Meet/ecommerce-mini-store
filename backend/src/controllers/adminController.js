const { mysqlConnection } = require("../config/mysql");

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getRevenue = async (req, res) => {
  try {
    const orders = await query(
      "SELECT total_amount, created_at FROM orders WHERE status != 'Cancelled'"
    );

    let totalRevenue = 0;
    let totalOrders = orders.length;
    const revenueByDayMap = {};

    orders.forEach(order => {
      totalRevenue += parseFloat(order.total_amount);
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!revenueByDayMap[date]) {
        revenueByDayMap[date] = 0;
      }
      revenueByDayMap[date] += parseFloat(order.total_amount);
    });

    const revenueByDay = Object.keys(revenueByDayMap).map(date => ({
      date,
      revenue: revenueByDayMap[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        revenueByDay,
      },
    });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ success: false, message: "Failed to fetch revenue", error: error.message });
  }
};

module.exports = {
  getRevenue
};
