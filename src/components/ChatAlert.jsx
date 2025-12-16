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

  const [selectedCenter, setSelectedCenter] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // fetch all messages
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

  // send reply as admin
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedCenter) return;

    const payload = {
      centerCode: selectedCenter,
      userEmail: "admin@gmail.com",
      message: replyText.trim(),
      sender: "admin",
    };

    try {
      setSending(true);

      const res = await fetch(`${API}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json(); // POST with JSON body and fetch [web:61][web:63]

      if (data.success) {
        const newMsg = data.data || {
          _id: Date.now().toString(),
          userEmail: payload.userEmail,
          centerCode: payload.centerCode,
          text: payload.message,
          sender: payload.sender,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setReplyText("");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      alert("Something went wrong while sending message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-950/95 px-3 sm:px-6">
      {/* card fixed to 90vh */}
      <div className="w-full max-w-5xl h-[90vh] rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl shadow-slate-900/60 overflow-hidden flex flex-col">
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

        {/* Messages area – only this scrolls */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
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
                const isSelected = selectedCenter === centerCode;

                return (
                  <button
                    type="button"
                    key={_id}
                    onClick={() => setSelectedCenter(centerCode)}
                    className={`w-full text-left focus:outline-none ${
                      isSelected ? "scale-[1.01]" : ""
                    } transition-transform`}
                  >
                    <div
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
                        className={`max-w-[86%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-lg border ${
                          isUser
                            ? `bg-slate-800/80 text-slate-50 border-slate-700 ${
                                isSelected ? "ring-2 ring-emerald-400/70" : ""
                              }`
                            : `bg-emerald-500/90 text-slate-950 border-emerald-400/70 ${
                                isSelected ? "ring-2 ring-emerald-200/70" : ""
                              }`
                        }`}
                      >
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

                        <p className="leading-relaxed whitespace-pre-wrap break-words">
                          {text}
                        </p>

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
                  </button>
                );
              }
            )}
        </div>

        {/* Reply input fixed inside 90vh card */}
        <form
          onSubmit={handleSendReply}
          className="border-t border-slate-800 bg-slate-900/90 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
            <span>
              Reply as <span className="font-semibold">admin@gmail.com</span>
            </span>
            <span>
              Selected center:{" "}
              <span className="font-semibold text-emerald-400">
                {selectedCenter || "Tap a message to select center"}
              </span>
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-full bg-slate-800/90 border border-slate-700 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Type your reply as admin..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!replyText.trim() || !selectedCenter || sending}
              className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatAlert;
