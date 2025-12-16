import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [inspections, setInspections] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://observer-s328.onrender.com/api/inspections")
      .then(res => res.json())
      .then(result => {
        const data = result.data || [];
        setInspections(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setFiltered(inspections);
      return;
    }

    const result = inspections.filter(item =>
      item.centerCode?.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFiltered(result);
  };

  const problemCount = inspections.filter(i =>
    Object.values(i).some(v => v?.status === "No")
  ).length;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b1120] text-gray-300">
        Loading inspections…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] to-[#020617] text-gray-200">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* TOP HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Exam Center Inspection Overview
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search Center Code"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="
                px-4 py-2 w-64 rounded-lg
                bg-[#111827] border border-[#1f2937]
                text-gray-200 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-sky-500
              "
            />

            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-lg font-semibold
                         bg-sky-500 text-black hover:bg-sky-400"
            >
              Search
            </button>

            <button
              onClick={() => navigate("/alerts")}
              className="px-5 py-2 rounded-lg font-semibold
                         bg-white text-red-600  cursor-pointer"
            >
              🚨 Alerts ({problemCount})
            </button>
            <button
              onClick={() => navigate("/main-alerts")}
              className="px-5 py-2 rounded-lg font-semibold
                         bg-white/20 hover:bg-green-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTriangleExclamation} color="red" />
  
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Centers" value={inspections.length} />
          <StatCard title="Inspections" value={filtered.length} />
          <StatCard title="Unhealthy Centers" value={problemCount} danger />
          <StatCard title="Healthy Centers" value={inspections.length - problemCount} success />
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="text-center mt-24 text-gray-400">
            No exam center found
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <Card
              key={item._id}
              item={item}
              onClick={() => navigate(`/details/${item._id}`)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({ title, value, danger, success }) {
  return (
    <div className="
      bg-[#0f172a] border border-[#1f2937]
      rounded-xl p-5 shadow-lg
    ">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${
        danger ? "text-red-500" : success ? "text-green-400" : "text-sky-400"
      }`}>
        {value}
      </p>
    </div>

  );
}
