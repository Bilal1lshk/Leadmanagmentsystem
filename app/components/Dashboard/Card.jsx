export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[#131826] border border-[#1F2635] rounded-2xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}