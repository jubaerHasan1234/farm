"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function ActionButton({ order }) {
  const [downloading, setDownloading] = useState(false);

  const downloadReceipt = () => {
    if (!order || !order.pdf) {
      alert("PDF not available for download.");
      return;
    }

    setDownloading(true);
    try {
      // Decode Base64 and create a Blob for download
      const blob = new Blob(
        [Uint8Array.from(atob(order.pdf), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `order_${order._id}_receipt.pdf`; // Dynamic filename
      document.body.appendChild(link); // Append to body to make it clickable
      link.click(); // Programmatically click the link
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url); // Release the object URL

      // Optionally, show a success message
      // alert("Receipt downloaded successfully!"); // Replace with custom modal/toast in production
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again."); // Replace with custom modal/toast in production
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        onClick={downloadReceipt}
        className={`flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition
          ${downloading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={downloading || !order?.pdf} // Disable if downloading or PDF not available
      >
        {downloading ? (
          <ClipLoader size={20} color="#fff" />
        ) : (
          <>
            <i className="fas fa-download mr-2"></i>
            Download Receipt (PDF)
          </>
        )}
      </button>
      <Link
        href="/orders"
        className="flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition"
      >
        <i className="fas fa-list mr-2"></i>
        View All Orders
      </Link>
      <Link
        href="/"
        className="flex items-center justify-center px-8 py-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition"
      >
        <i className="fas fa-home mr-2"></i>
        Back to Home
      </Link>
    </div>
  );
}
