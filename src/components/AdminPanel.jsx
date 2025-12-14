import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch("https://observer-s328.onrender.com/api/inspections")
      .then(res => res.json())
      .then(result => {
        setInspections(result.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading inspection data…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Inspection Admin Panel
      </h1>

      {inspections.map(item => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          {/* HEADER */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              {item.centerName}
            </h2>
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              {item.centerCode}
            </span>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 text-sm">
            <p><b>Observer:</b> {item.observerEmail}</p>
            <p><b>Exam Time:</b> {item.examStartTime} – {item.examEndTime}</p>
            <p><b>Submitted:</b> {new Date(item.submittedAt).toLocaleString()}</p>
            <p><b>Total Systems:</b> {item.totalSystemCount}</p>
            <p><b>Working Systems:</b> {item.workingSystemsCount}</p>
            <p><b>CCTV Count:</b> {item.cctvCount}</p>
          </div>

          {/* FACILITY TABLE */}
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Facilities Status
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Facility</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(item).map(([key, value]) => {
                  if (value?.status) {
                    return (
                      <tr key={key} className="border-t">
                        <td className="p-3 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              value.status === "Yes"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {value.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {value.remark || "-"}
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>

          {/* FINAL REMARK */}
          <div className="mt-4 pt-3 border-t border-dashed text-sm">
            <b>Final Remarks:</b> {item.finalRemarks}
          </div>
        </div>
      ))}
    </div>
  );
}
