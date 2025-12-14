import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* -------- IMAGE RESOLVER -------- */
function resolveImage(inspection, fieldKey) {
  // Case 1: direct imageUrl
  if (inspection[fieldKey]?.imageUrl) {
    return inspection[fieldKey].imageUrl;
  }

  // Case 2: image from images[] array
  const img = inspection.images?.find(
    i => i.fieldName === fieldKey
  );

  return img?.uri || null;
}

/* -------- IMAGE PREVIEW -------- */
function ImagePreview({ url }) {
  if (!url) return <span className="text-gray-500">-</span>;

  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img
        src={url}
        alt="proof"
        className="w-14 h-14 object-cover rounded-md
                   border border-[#334155]
                   hover:scale-105 transition cursor-pointer"
      />
    </a>
  );
}

export default function InspectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://observer-s328.onrender.com/api/inspections")
      .then(res => res.json())
      .then(result => {
        const found = result.data.find(item => item._id === id);
        setInspection(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-gray-300">
        Loading details…
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-gray-300">
        Inspection not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 bg-green-300 hover:bg-green-400 text-black px-4 py-2 rounded-full font-semibold"
      >
        ← Back to Dashboard
      </button>

      {/* HEADER */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <p className="text-lg font-bold">
          <span className="text-sky-400">Observer Email:</span><br />
          {inspection.observerEmail}
        </p>
        <p className="text-lg font-bold">
          <span className="text-sky-400">Center Name:</span><br />
          {inspection.centerName}
        </p>
        <p className="text-lg font-bold">
          <span className="text-sky-400">Center Code:</span><br />
          {inspection.centerCode}
        </p>
        <p className="text-lg font-bold">
          <span className="text-sky-400">Submitted At:</span><br />
          {new Date(inspection.submittedAt).toLocaleString("en-IN")}
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* DURING EXAM */}
          <section className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
            <h2 className="text-2xl font-semibold mb-4">During Exam</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
              <p><b>Exam Start Time:</b> {inspection.examStartTime}</p>
              <p><b>Exam End Time:</b> {inspection.examEndTime}</p>
              <p><b>Question Paper Download Time:</b> {inspection.questionPaperDownloadTime}</p>
            </div>

            <table className="w-full text-sm border border-[#334155]">
              <thead className="bg-[#0f172a]">
                <tr>
                  <th className="p-3 text-left">Facility</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Remark</th>
                  <th className="p-3 text-left">Image</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Random Seat Allocation", "randomSeatAllocation"],
                  ["Seat Change Request", "seatChangeRequest"],
                  ["CCTV Working", "cctvWorking"],
                ].map(([label, key]) => {
                  const value = inspection[key];
                  return (
                    <tr key={key} className="border-t border-[#334155]">
                      <td className="p-3">{label}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            value?.status === "Yes"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {value?.status || "N/A"}
                        </span>
                      </td>
                      <td className="p-3">{value?.remark || "-"}</td>
                      <td className="p-3">
                        <ImagePreview url={resolveImage(inspection, key)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* POWER & BACKUP */}
          <section className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-4">Power & Backup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><b>Generator Capacity:</b> {inspection.generatorCapacity}</p>
              <p><b>UPS Capacity:</b> {inspection.upsCapacity}</p>
              <p><b>Backup Duration (hrs):</b> {inspection.powerBackupDuration}</p>
            </div>
          </section>

        </div>

        {/* RIGHT SIDE */}
        <section className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Facilities Status</h2>

          <table className="w-full text-sm border border-[#334155]">
            <thead className="bg-[#0f172a]">
              <tr>
                <th className="p-3 text-left">Facility</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Remark</th>
                <th className="p-3 text-left">Image</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Drinking Water", "drinkingWater"],
                ["PWD Friendly", "pwdFriendly"],
                ["Wheel Chair", "wheelChair"],
                ["Ramp Facility", "rampFacility"],
                ["Working Fans", "workingFans"],
                ["Working Lights", "workingLights"],
                ["Labs on Ground Floor", "labsOnGroundFloor"],
                ["CCTV Recording Working", "cctvRecordingWorking"],
                ["Generator Available", "generatorAvailable"],
                ["UPS Available", "upsAvailable"],
              ].map(([label, key]) => {
                const value = inspection[key];
                return (
                  <tr key={key} className="border-t border-[#334155]">
                    <td className="p-3">{label}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          value?.status === "Yes"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {value?.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">{value?.remark || "-"}</td>
                    <td className="p-3">
                      <ImagePreview url={resolveImage(inspection, key)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

      </div>

      {/* FINAL REMARKS */}
      <section className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 mt-6">
        <h2 className="text-xl font-semibold mb-2">Final Remarks</h2>
        <p className="text-sm">{inspection.finalRemarks || "-"}</p>
      </section>

    </div>
  );
}
