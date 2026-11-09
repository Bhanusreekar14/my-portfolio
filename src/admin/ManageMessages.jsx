import { useEffect, useState } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/config";
import { FaEnvelope, FaTrash, FaCheck, FaTimes, FaInbox } from "react-icons/fa";

function ManageMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  useEffect(() => {
    const messagesRef = ref(database, "messages");

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));
        // Sort newest first
        formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(formatted);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      const msgRef = ref(database, `messages/${id}`);
      await update(msgRef, { read: !currentStatus });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const msgRef = ref(database, `messages/${id}`);
        await remove(msgRef);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3eedf",
        color: "#171512",
        padding: "50px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <p
            style={{
              color: "#ed432f",
              fontWeight: "800",
              letterSpacing: "3px",
              margin: "0 0 5px 0",
            }}
          >
            PORTFOLIO / MESSAGES
          </p>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontFamily: "'DM Serif Display', serif",
              margin: 0,
            }}
          >
            Contact Messages ({messages.length})
          </h1>
          <p style={{ color: "rgba(23,21,18,0.7)", marginTop: "5px" }}>
            View and manage contact form enquiries submitted by visitors.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "12px 20px",
            border: "2px solid #171512",
            background: "transparent",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          ← DASHBOARD
        </button>
      </header>

      {/* Filter tabs & Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "8px 16px",
              border: "1.5px solid #171512",
              background: filter === "all" ? "#171512" : "transparent",
              color: filter === "all" ? "#ffffff" : "#171512",
              fontWeight: "700",
              cursor: "pointer",
              borderRadius: "20px",
            }}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            style={{
              padding: "8px 16px",
              border: "1.5px solid #ed432f",
              background: filter === "unread" ? "#ed432f" : "transparent",
              color: filter === "unread" ? "#ffffff" : "#ed432f",
              fontWeight: "700",
              cursor: "pointer",
              borderRadius: "20px",
            }}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            style={{
              padding: "8px 16px",
              border: "1.5px solid #171512",
              background: filter === "read" ? "#171512" : "transparent",
              color: filter === "read" ? "#ffffff" : "#171512",
              fontWeight: "700",
              cursor: "pointer",
              borderRadius: "20px",
            }}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", opacity: 0.6 }}>
          Loading messages...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #171512",
            padding: "60px 20px",
            textAlign: "center",
            borderRadius: "8px",
          }}
        >
          <FaInbox size={48} style={{ color: "rgba(23,21,18,0.3)", marginBottom: "16px" }} />
          <h3 style={{ margin: 0, fontFamily: "'DM Serif Display', serif" }}>
            No Messages Found
          </h3>
          <p style={{ color: "rgba(23,21,18,0.6)" }}>
            {filter === "all"
              ? "Your inbox is currently empty."
              : `No ${filter} messages available.`}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {filteredMessages.map((msg) => (
            <article
              key={msg.id}
              style={{
                background: msg.read ? "#ffffff" : "#fffef5",
                border: msg.read ? "1.5px solid #171512" : "2.5px solid #ed432f",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: msg.read ? "none" : "4px 4px 0 #ed432f",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        fontFamily: "'DM Serif Display', serif",
                      }}
                    >
                      {msg.name}
                    </h3>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "800",
                        letterSpacing: "1px",
                        background: msg.read ? "rgba(23,21,18,0.1)" : "#ed432f",
                        color: msg.read ? "#171512" : "#ffffff",
                      }}
                    >
                      {msg.read ? "READ" : "NEW UNREAD"}
                    </span>
                  </div>

                  <p style={{ margin: "4px 0 0 0", color: "#ed432f", fontWeight: "700" }}>
                    <FaEnvelope style={{ marginRight: "6px", verticalAlign: "middle" }} />
                    <a href={`mailto:${msg.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {msg.email}
                    </a>
                  </p>
                </div>

                <div style={{ fontSize: "13px", color: "rgba(23,21,18,0.6)", textAlign: "right" }}>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "No date"}
                </div>
              </div>

              <div
                style={{
                  background: "#f9f6ec",
                  padding: "16px",
                  borderRadius: "6px",
                  border: "1px solid rgba(23,21,18,0.15)",
                  marginBottom: "16px",
                }}
              >
                <strong style={{ display: "block", marginBottom: "8px", fontSize: "15px" }}>
                  Subject: {msg.subject}
                </strong>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {msg.message}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  onClick={() => handleToggleRead(msg.id, msg.read)}
                  style={{
                    padding: "8px 14px",
                    border: "1.5px solid #171512",
                    background: "transparent",
                    color: "#171512",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {msg.read ? <FaTimes /> : <FaCheck />}
                  {msg.read ? "Mark as Unread" : "Mark as Read"}
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  style={{
                    padding: "8px 14px",
                    border: "1.5px solid #ed432f",
                    background: "#ed432f",
                    color: "#ffffff",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default ManageMessages;
