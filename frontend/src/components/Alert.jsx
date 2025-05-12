export function Alert({ message }) {
  return (
    <div
      className="bg-red-600/90 border border-red-400 text-white px-4 py-3 rounded-xl mb-2 text-center shadow-lg drop-shadow-lg animate-pulse"
      role="alert"
    >
      <span className="sm:inline block font-semibold">{message}</span>
    </div>
  );
}
