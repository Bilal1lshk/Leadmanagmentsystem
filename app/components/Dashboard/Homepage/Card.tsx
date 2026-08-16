export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-[#E5CB90]/60 rounded-2xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}