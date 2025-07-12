import React from "react";

type TagColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const presetColors = [
  { color: "แดง", value: "#CC0033" },
  { color: "ส้ม", value: "#FF6633" },
  { color: "เหลือง", value: "#FFCC33" },
  { color: "เขียว", value: "#33CC66" },
  { color: "ฟ้า", value: "#33CCFF" },
  { color: "น้ำเงิน", value: "#0033FF" },
  { color: "ม่วง", value: "#6633FF" },
  { color: "ชมพู", value: "#FF99FF" },
  { color: "เทา", value: "#778899" },
];

const ColorPicker: React.FC<TagColorPickerProps> = ({ value, onChange, label = "สีแท็ก" }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-md me-2">{label}</span>
      <div className="flex gap-2">
        {presetColors.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-6 h-6 border-2 transition-all duration-200 ${
              value === option.value ? "ring-2 ring-offset-1 ring-main" : "border-gray-300"
            }`}
            style={{ backgroundColor: option.value }}
            aria-label={option.color}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
