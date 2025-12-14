import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

/* 🎨 Fixed color palette */
const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#4b5563",
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userApiStats, setUserApiStats] = useState([]);
  const [globalApiStats, setGlobalApiStats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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

        setUserApiStats(res.data.apiStats || []);
      })
      .catch(() => setError("Failed to load dashboard"));

    axios
      .get(
        "http://localhost:8080/DeveloperToolsApiProject/api/dashboard/usage-summary",
        { withCredentials: true }
      )
      .then((res) => {
        const mapped = (res.data.stats || []).map((item) => ({
          name: item.api,
          value: Number(item.cnt),
        }));
        setGlobalApiStats(mapped);
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  const totalGlobal = globalApiStats.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div
      style={{
        background: "#f4f6f8",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* ================= USER CARD ================= */}
        {user && (
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 14,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              marginBottom: 40,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                fontSize: 28,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 style={{ margin: 0 }}>{user.name}'s Dashboard</h2>
              <p style={{ margin: "6px 0 0", color: "#555" }}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* ================= USER TABLE ================= */}
        <h3 style={{ marginBottom: 12 }}>Your API Usage</h3>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginBottom: 50,
          }}
        >
          <table width="100%" cellPadding="14">
            <thead style={{ background: "#f1f5f9" }}>
              <tr>
                <th align="left">API Name</th>
                <th align="center">Count</th>
              </tr>
            </thead>
            <tbody>
              {userApiStats.map((item, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: "1px solid #eee",
                  }}
                >
                  <td>{item.api}</td>
                  <td
                    align="center"
                    style={{ fontWeight: "bold", color: "#2563eb" }}
                  >
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= GLOBAL PIE ================= */}
        <h3 style={{ marginBottom: 6 }}>
          Global API Usage (All Users)
        </h3>
        <p style={{ color: "#666", marginBottom: 20 }}>
          Total requests across all users:{" "}
          <b>{totalGlobal}</b>
        </p>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
            padding: 30,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PieChart width={420} height={360}>
            <Pie
              data={globalApiStats}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              label
            >
              {globalApiStats.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Profile;
