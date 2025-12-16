import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBullhorn } from "@fortawesome/free-solid-svg-icons";

const ChatAlert = () => {
  const defaultEmail = "deependra@gmail.com";
  const defaultCenterCode = "NEC002";
  const API =
    import.meta.env.VITE_BACKEND_URL || "https://observe-2uo1.onrender.com";

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API}/api/chat/messages/${defaultEmail}/${defaultCenterCode}`
        );
        const data = await res.json();
        if (data.success === "true" || data.success === true) {
          setMessages(data.data);
        } else {
          setError("Failed to fetch messages");
        }
      } catch (err) {
        setError("Something went wrong while fetching messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [API]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-slate-950/95 py-4 sm:py-8 px-3 sm:px-6">
      {/* outer card */}
      <div className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl shadow-slate-900/60 overflow-hidden min-h-[90vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/70 backdrop-blur">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-slate-50 tracking-tight truncate">
              Center Chat
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              {defaultEmail} • {defaultCenterCode}
            </p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-emerald-400">
            Live issues
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>

        {/* Messages area */}
        <div className=" overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 ">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-red-400 py-4">{error}</p>
          )}

          {!loading && !error && messages.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-6">
              No messages yet. Everything looks calm.
            </p>
          )}

          {!loading &&
            !error &&
            messages.map(
              ({ _id, sender, text, timestamp, userEmail, centerCode }) => {
                const isUser = sender === "user";
                return (
                  <div
                    key={_id}
                    className={`flex gap-2 sm:gap-3 ${
                      isUser ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isUser && (
                      <div className="mt-1 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner shadow-emerald-500/30 text-xs sm:text-sm">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}

                    <div
                      className={`max-w-[86%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-lg ${
                        isUser
                          ? "bg-slate-800/80 text-slate-50 border border-slate-700"
                          : "bg-emerald-500/90 text-slate-950 border border-emerald-400/70"
                      }`}
                    >
                      {/* top row: sender + small meta badges */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide opacity-80">
                          {isUser ? "User" : "Admin"}
                        </span>
                        {!isUser && (
                          <FontAwesomeIcon
                            icon={faBullhorn}
                            className="text-[9px] sm:text-xs opacity-80"
                          />
                        )}

                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-black/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {centerCode}
                        </span>

                        <span className="inline-flex items-center rounded-full bg-black/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium truncate max-w-[120px] sm:max-w-[180px]">
                          {userEmail}
                        </span>
                      </div>

                      {/* message text */}
                      <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {text}
                      </p>

                      {/* footer time */}
                      <p
                        className={`mt-1.5 text-[9px] sm:text-[10px] ${
                          isUser
                            ? "text-slate-400/80"
                            : "text-emerald-950/80"
                        }`}
                      >
                        {formatDate(timestamp)}
                      </p>
                    </div>

                    {!isUser && (
                      <div className="mt-1 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-500/40 text-xs sm:text-sm">
                        <FontAwesomeIcon icon={faBullhorn} />
                      </div>
                    )}
                  </div>
                );
              }
            )}
        </div>

        {/* Footer */}
        {/* <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800 bg-slate-900/80 text-[10px] sm:text-[11px] text-slate-500 flex flex-col sm:flex-row  gap-1.5">
          <span>All messages are grouped by user email and center code.</span>
          <span className="italic text-slate-400 text-right sm:text-left">
            Chat alerts
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default ChatAlert;
