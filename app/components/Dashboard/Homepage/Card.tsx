export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-brand-navy border border-brand-navy-border rounded-2xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}