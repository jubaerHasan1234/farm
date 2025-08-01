"use client";
import React, { useEffect } from "react";

const slideDownKeyframes = `@keyframes slideDownToastCustom {
  0% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(0.95); }
  60% { opacity: 1; transform: translateX(-50%) translateY(8px) scale(1.03); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}`;

// Inject the keyframes only once
if (
  typeof document !== "undefined" &&
  !document.getElementById("custom-toast-slideDown")
) {
  const style = document.createElement("style");
  style.id = "custom-toast-slideDown";
  style.innerHTML = slideDownKeyframes;
  document.head.appendChild(style);
}

const Toast = ({ message, type = "success", onClose, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Only animate on mount
  const [animated, setAnimated] = React.useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(false), 500); // match animation duration
    return () => clearTimeout(timeout);
  }, []);

  const backgroundColor = type === "success" ? "#22c55e" : "#2563eb";

  return (
    <div
      style={{
        position: "fixed",
        top: 30,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: backgroundColor,
        color: "#fff",
        padding: "12px 24px 12px 24px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontWeight: 600,
        fontSize: 16,
        minWidth: 180,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        gap: 12,
        animation: animated
          ? "slideDownToastCustom 0.45s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
          cursor: "pointer",
          marginLeft: 8,
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
