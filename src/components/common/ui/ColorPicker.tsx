import React from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  size?: number;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  size = 30,
  disabled,
}) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.75 : 1,
      }}
      className="border border-gray-300 rounded"
    />
  );
};

export default ColorPicker;
