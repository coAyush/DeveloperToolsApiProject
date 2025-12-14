import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE =
  "http://localhost:8080/DeveloperToolsApiProject/api/dashboard";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [apiStats, setApiStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/me`, { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) {
          toast.error("Please login first!");
          navigate("/login");
          return;
        }

        setUser({
          name: res.data.name,
          email: res.data.email,
        });
        setHistory(res.data.history || []);
        setApiStats(res.data.apiStats || []);
      })
      .catch(() => {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-24">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.name}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* API Usage Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            API Usage Summary
          </h3>

          {apiStats.length === 0 ? (
            <p className="text-gray-500">No usage data available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {apiStats.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <p className="text-sm text-gray-500">
                    {item.apiName}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage History */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Usage History
          </h3>

          {history.length === 0 ? (
            <p className="text-gray-500">No history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="text-left p-3">API Name</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3">{item.apiName}</td>
                      <td className="p-3">{item.usedAt}</td>
                      <td className="p-3 text-green-600">
                        Success
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
