import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* 🎨 Professional color palette */
const COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#ea580c", // orange
  "#0891b2", // cyan
  "#ca8a04", // yellow
  "#4b5563", // gray
];

/* 🔤 Pie label (percentage) */
const CustomPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value, // Passed value for debugging/context
}) => {
  // Ensure label is only shown for meaningful slices
  if (percent * 100 < 5) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {/* Display the percentage, centered */}
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [apiStats, setApiStats] = useState([]);
  const [globalStats, setGlobalStats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    /* ================= USER DASHBOARD ================= */
    axios
      .get(
        "http://localhost:8080/DeveloperToolsApiProject/api/dashboard/me",
        { withCredentials: true }
      )
      .then((res) => {
        if (!res.data.authenticated) {
          setError("Not logged in");
          return;
        }

        setUser({
          name: res.data.name,
          email: res.data.email,
        });

        setApiStats(res.data.apiStats || []);
      })
      .catch(() => setError("Failed to load dashboard"));

    /* ================= GLOBAL API USAGE ================= */
    axios
      .get(
        "http://localhost:8080/DeveloperToolsApiProject/api/dashboard/usage-summary",
        { withCredentials: true }
      )
      .then((res) => {
        const mapped = (res.data.stats || []).map((item) => ({
          // Using common checks for API name key
          name: item.api || item.api_name || item.apiName || "Unknown API", 
          value: Number(item.count) || 0,
        }));
        setGlobalStats(mapped);
      })
      .catch(() => {});
  }, []);

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        <h3>{error}</h3>
        <p>Please login to view your dashboard.</p>
      </div>
    );
  }

  const totalGlobalUsage = globalStats.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* ================= USER CARD ================= */}
      {user && (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            marginBottom: "40px",
            borderLeft: "6px solid #2563eb",
          }}
        >
          <h2 style={{ margin: 0 }}>{user.name}'s Dashboard</h2>
          <p style={{ margin: "6px 0 0", color: "#555" }}>
            <b>Email:</b> {user.email}
          </p>
        </div>
      )}

      {/* ================= USER API TABLE ================= */}
      <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
        Your API Usage
      </h3>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
          overflow: "hidden",
          marginBottom: "40px", // Added spacing
        }}
      >
        <table width="100%" cellPadding="14">
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th align="left">API Name</th>
              <th align="center" width="150">
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {apiStats.length === 0 ? (
              <tr>
                <td colSpan="2" align="center" style={{ color: "#777" }}>
                  No API usage recorded.
                </td>
              </tr>
            ) : (
              apiStats.map((item, index) => (
                <tr key={index} style={{ borderTop: "1px solid #eee" }}>
                  <td>{item.apiName}</td>
                  <td align="center" style={{ fontWeight: "bold", color: "#2563eb" }}>
                    {item.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= GLOBAL PIE CHART ================= */}
      <h3
        style={{
          marginTop: "50px",
          marginBottom: "10px",
          color: "#2563eb",
        }}
      >
        Global API Usage (All Users)
      </h3>
        
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        {globalStats.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>
            No global usage data available.
          </p>
        ) : (
          <>
            <p
              style={{
                textAlign: "center",
                marginBottom: "15px",
                color: "#555",
              }}
            >
              Total Requests: <b>{totalGlobalUsage}</b>
            </p>

            <div style={{ height: "360px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={globalStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" // Explicitly center the pie chart
                    cy="50%" // Explicitly center the pie chart
                    innerRadius={60}
                    outerRadius={140}
                    labelLine={false}
                    label={CustomPieLabel}
                    paddingAngle={2} // Add small gap for clarity
                  >
                    {globalStats.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} uses`, name]} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;