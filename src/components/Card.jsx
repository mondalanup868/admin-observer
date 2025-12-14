export default function Card({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer bg-[#1e293b]
        border border-[#334155]
        rounded-xl p-6 shadow-md
        hover:border-sky-400 hover:shadow-sky-500/20
        transition-all
      "
    >
      <h2 className="text-lg font-semibold text-gray-100">
        {item.centerName}
      </h2>

      <p className="text-sm text-sky-400 mb-4">
        {item.centerCode}
      </p>

      <p className="text-sm text-gray-300">
        <span className="text-gray-400">Observer:</span>{" "}
        {item.observerEmail}
      </p>

      <p className="text-sm text-gray-300">
        <span className="text-gray-400">Exam Time:</span>{" "}
        {item.examStartTime} – {item.examEndTime}
      </p>

      <p className="text-sm text-gray-400 mt-3">
        Submitted: {new Date(item.submittedAt).toLocaleString()}
      </p>

      <div className="
        mt-6 text-center text-sm font-semibold
        rounded-md py-2
        bg-emerald-500 text-[#052e16]
        hover:bg-emerald-400 transition
      ">
        View Details
      </div>
    </div>
  );
}
