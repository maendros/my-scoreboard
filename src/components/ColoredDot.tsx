import React from "react";

interface ColoredDotProps {
  color: string; // The color of the dot
  size?: number; // Optional size prop (default to 8px)
}

const ColoredDot: React.FC<ColoredDotProps> = ({ color, size = 8 }) => {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%", // Makes it round
      }}
    />
  );
};

export default ColoredDot;
