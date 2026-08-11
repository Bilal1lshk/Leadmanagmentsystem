const palette = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-sky-500",
];

function colorFor(name: string) {
  const index = name?.charCodeAt(0) % palette.length;
  return palette[index];
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

export default function Avatar({ name, size = "sm" }: AvatarProps) {
  const initials = name?.split(" ")
    ?.map((part) => part[0])
    ?.slice(0, 2)
    ?.join("")
    ?.toUpperCase();

  const dimension = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorFor(
        name
      )} ${dimension}`}
    >
      {initials}
    </div>
  );
}