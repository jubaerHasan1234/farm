export default function Message({ type, message }) {
  if (!message) return null;

  const baseClasses = "p-3 rounded-md text-center";
  const typeClasses =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
}
