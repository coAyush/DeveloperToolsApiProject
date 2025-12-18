import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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
      <div style={{ padding: 60, textAlign: "center", color: "red" }}>
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
        padding: "50px 24px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ================= USER CARD ================= */}
        {user && (
          <div
            style={{
              background: "white",
              padding: "28px 32px",
              borderRadius: 16,
              boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
              marginTop: 30,
              marginBottom: 50,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                fontSize: 30,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>
                {user.name}'s Dashboard
              </h2>
              <p style={{ marginTop: 6, color: "#666" }}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* ================= USER TABLE ================= */}
        <h3 style={{ marginBottom: 18 }}>Your API Usage</h3>

        <div
          style={{
            background: "white",
            borderRadius: 18,
            boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginBottom: 60,
          }}
        >
          <table width="100%" cellPadding="0" style={{ borderCollapse: "collapse" }}>
            <thead
              style={{
                background: "linear-gradient(to right, #2563eb, #1e40af)",
                color: "white",
              }}
            >
              <tr>
                <th style={{ padding: "16px 20px", textAlign: "left" }}>
                  API Name
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center" }}>
                  Usage
                </th>
              </tr>
            </thead>

            <tbody>
              {userApiStats.map((item, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #eef2f7",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <td style={{ padding: "14px 20px", fontWeight: 500 }}>
                    {item.api}
                  </td>

                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    <span
                      style={{
                        background: "#e0e7ff",
                        color: "#1e40af",
                        padding: "6px 14px",
                        borderRadius: 999,
                        fontWeight: "bold",
                        fontSize: 14,
                        display: "inline-block",
                        minWidth: 60,
                      }}
                    >
                      {item.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= GLOBAL PIE ================= */}
        <h3 style={{ marginBottom: 8 }}>Global API Usage</h3>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Total requests across all users: <b>{totalGlobal}</b>
        </p>

        <div
          style={{
            background: "white",
            borderRadius: 18,
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            padding: "36px 20px",
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