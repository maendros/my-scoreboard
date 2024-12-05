import React from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  size?: number; // Optional size prop for customization
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  size = 20,
}) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none cursor-pointer border-none p-0 mr-2 "
      style={{
        width: `${size}px`,
        height: `${size}px`,
        // Ensures it's round
        padding: 0,
        backgroundColor: "transparent",
      }}
    />
  );
};

export default ColorPicker;
