import React, { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useRef } from "react";
// import { useEffect, useState } from "react";
import { TextField, Select } from "@radix-ui/themes";

interface InputActionProps {
  onAction?: () => void; // Callback to handle input value (Enter key)
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; // Callback to  changes
  placeholder?: string; // Optional placeholder text
  label?: string; // Optional label for the input
  value: string;
  labelOrientation?: "horizontal" | "vertical"; // Label position
  size?: "1" | "2" | "3"; // Radix input size
  defaultValue?: string; // Optional default value
  id?: string; // Input ID (used for navigation)
  nextFields?: { left?: string; right?: string; up?: string; down?: string }; // Navigation config
  className?: string;
  classNameInput?: string;
  classNameLabel?: string;
  require?: string;
  isError?: boolean;
  disabled?: boolean;
  type?:
  | "number"
  | "search"
  | "text"
  | "time"
  | "hidden"
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "password"
  | "tel"
  | "url"
  | "week"
  | "tel"
  | undefined;
  iconLeft?: ReactNode;
  maxLength?: number;
  errorMessage?: string;
  maxValue?: string | number | undefined;
}

const InputAction: React.FC<InputActionProps> = ({
  onAction,
  onChange,
  placeholder = "Enter value...",
  label = "",
  labelOrientation = "vertical",
  size = "2",
  value = "",
  defaultValue = "",
  id = "",
  nextFields = {},
  className = "",
  classNameInput = "",
  classNameLabel = "",
  require = "",
  isError,
  disabled = false,
  type = "text",
  iconLeft,
  maxLength,
  errorMessage,
  maxValue,
}) => {
  // const [inputValue, setInputValue] = useState<string>(defaultValue);

  // useEffect(() => {
  //   setInputValue(defaultValue);
  // }, [defaultValue]);
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isError && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current.focus();
    }
  }, [isError]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keycode = e.key;
    const nextFieldId =
      keycode === "ArrowUp"
        ? nextFields.up
        : keycode === "ArrowDown"
          ? nextFields.down
          : keycode === "ArrowLeft"
            ? nextFields.left
            : keycode === "ArrowRight"
              ? nextFields.right
              : null;

    // ป้องกันการพิมพ์ตัวอักษรพิเศษ (อนุญาตเฉพาะตัวเลข, Backspace, และปุ่มควบคุมอื่น ๆ)
    if (
      (type === "number" || type === "tel") &&
      !/^[0-9.]$/.test(keycode) &&
      keycode !== "Decimal" &&
      keycode !== "Backspace" &&
      keycode !== "Tab" &&
      keycode !== "ArrowUp" &&
      keycode !== "ArrowDown" &&
      keycode !== "ArrowLeft" &&
      keycode !== "ArrowRight" &&
      keycode !== "Enter"
    ) {
      e.preventDefault();
      return;
    }


    if (keycode === "Enter") {
      if (onAction) {
        onAction(); // Call onAction if provided
      } else if (nextFields.right) {
        // Fallback: move to next field (right) if onAction is not provided
        const nextField = document.getElementById(nextFields.right);
        if (nextField) {
          (nextField as HTMLInputElement).focus();
          (nextField as HTMLInputElement).select();
        }
      }
    } else if (nextFieldId) {
      // Navigate to the specified field based on arrow key
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        (nextField as HTMLInputElement).focus();
        (nextField as HTMLInputElement).select();
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    if (type === "tel") {
      // รับเฉพาะตัวเลขและ format เป็นเบอร์โทร
      rawValue = rawValue.replace(/\D/g, ""); // ลบ non-digit
      const formatted = formatPhoneNumber(rawValue);
      e.target.value = formatted;

      // ส่งค่ากลับในรูปแบบ format
      if (onChange) onChange({ ...e, target: { ...e.target, value: formatted } });
      return;
    }

    if (type === "number" && /^\d*$/.test(rawValue)) {
      rawValue = rawValue.replace(/^0+/, "") || "0"; // ลบ 0 นำหน้า
      e.target.value = rawValue;
    }

    if (onChange) onChange(e);
  };


  return (
    <div
      className={`${className || ""} flex flex-col sm:flex-row items-start sm:items-center gap-2`}
    >
      {/* Label ยังคงเหมือนเดิม */}
      {label && (
        <label
          htmlFor={id}
          className={classNameLabel || ""}
        >
          {label}
          {require && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <div className="flex flex-col w-full"> 
        <TextField.Root
          ref={inputRef}
          className={`h-input_main ${classNameInput} ${isError ? 'ring-2 ring-red-500 animate-shake' : ''
            }`}
          size={size}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          max={maxValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          id={id}
          disabled={disabled}
          type={type}
          maxLength={maxLength}
          autoComplete="off"
        >
          {iconLeft && <TextField.Slot>{iconLeft}</TextField.Slot>}
        </TextField.Root>

        {/* Error Message จะอยู่ในกลุ่มเดียวกับ Input แล้ว */}
        {errorMessage && (
          <div className="text-red-600 pt-1 text-sm"> {errorMessage}</div>
        )}
      </div>
    

    </div>
  );
};

export default InputAction;

