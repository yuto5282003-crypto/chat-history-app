"use client";

/**
 * Bubble — Speech bubble shown above avatars in the plaza.
 * Compact, rounded, with a small tail pointing down.
 * Cycles visibility with a gentle fade to avoid visual clutter.
 */
export default function Bubble({
  text,
  visible = true,
}: {
  text: string;
  visible?: boolean;
}) {
  if (!text) return null;
  return (
    <div
      className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="relative whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium leading-tight"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          color: "#333",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          maxWidth: 130,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
        {/* Tail */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -bottom-1"
          style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "5px solid rgba(255,255,255,0.92)",
          }}
        />
      </div>
    </div>
  );
}
