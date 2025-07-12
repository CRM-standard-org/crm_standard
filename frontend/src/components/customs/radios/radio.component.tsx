import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

type Option = {
  label: string;
  value: string;
};

type RadioComponentProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  direction?: "horizontal" | "vertical";
};

const RadioComponent: React.FC<RadioComponentProps> = ({
  label,
  options,
  value,
  onChange,
  direction = "horizontal", // ค่า default 
}) => {
  return (
    <div className="space-y-1 mt-4 sm:mt-1">
      {label && <p className="font-medium">{label}</p>}
      <RadioGroup value={value} onValueChange={onChange} className={`flex ${direction === "horizontal" ? "flex-row space-x-5" : "flex-col space-y-2"}`}>
        {options.map((opt) => (
          <div className="flex items-center space-x-2" key={opt.value}>
            <RadioGroupItem id={opt.value} value={opt.value} />
            <Label htmlFor={opt.value}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioComponent;
