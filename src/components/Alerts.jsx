import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://observer-s328.onrender.com/api/inspections")
      .then(res => res.json())
      .then(result => {
        const inspections = result.data || [];
        const generatedAlerts = generateAlerts(inspections);
        setAlerts(generatedAlerts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-gray-300">
        Loading alerts…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-6">🚨 Alerts & Issues</h1>

      {alerts.length === 0 && (
        <p className="text-gray-400">No issues reported 🎉</p>
      )}

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            onClick={() => navigate(`/details/${alert.inspectionId}`)}
            className="
              bg-[#1e293b] border border-red-600
              rounded-xl p-4 cursor-pointer
              hover:bg-[#273449] transition
            "
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-red-400">
                ⚠ {alert.message}
              </p>
              
            </div>

            <p className="text-sm text-gray-400 mt-1">
              Center: {alert.centerName}
            </p>
            <p className="text-xs text-gray-400"> Center Code :
                {alert.centerCode}
              </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- HELPER FUNCTIONS ---------------- */

function generateAlerts(inspections) {
  const alerts = [];

  inspections.forEach(inspection => {
    const fields = [
      ["Drinking Water", inspection.drinkingWater],
      ["PWD Friendly", inspection.pwdFriendly],
      ["Wheel Chair", inspection.wheelChair],
      ["Ramp Facility", inspection.rampFacility],
      ["Working Fans", inspection.workingFans],
      ["Working Lights", inspection.workingLights],
      ["Labs on Ground Floor", inspection.labsOnGroundFloor],
      ["CCTV Working", inspection.cctvWorking],
      ["CCTV Recording", inspection.cctvRecordingWorking],
      ["Generator Available", inspection.generatorAvailable],
      ["UPS Available", inspection.upsAvailable],
      ["Random Seat Allocation", inspection.randomSeatAllocation],
      ["Seat Change Request", inspection.seatChangeRequest],
    ];

    fields.forEach(([label, value]) => {
      if (value?.status === "No") {
        alerts.push({
          inspectionId: inspection._id,
          centerName: inspection.centerName,
          centerCode: inspection.centerCode,
          message: `${label} issue reported`,
        });
      }
    });
  });

  return alerts;
}
