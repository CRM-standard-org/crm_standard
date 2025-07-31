import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerComponentProps = {
  onAction?: () => void;
  id?: string;
  label?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  labelOrientation?: "horizontal" | "vertical";
  classNameLabel?: string;
  classNameInput?: string;
  required?: boolean;
  isError?: boolean;
  useTodayAsDefault?: boolean;
  isClearable?: boolean; 
  isDisabled?: boolean;
};

export default function DatePickerComponent({
  onAction,
  id,
  label,
  nextFields = {},
  selectedDate,
  onChange,
  placeholder = "dd/mm/yyyy",
  labelOrientation = "vertical",
  classNameLabel = "",
  classNameInput = "",
  required = false,
  isError,
  useTodayAsDefault = false,
  isClearable = false, 
  isDisabled,
}: DatePickerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isError]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const key = e.key;

    if (key === "Enter" && onAction) {
      onAction();
      e.preventDefault();
      return;
    }

    const nextFieldId =
      key === "ArrowUp"
        ? nextFields?.up
        : key === "ArrowDown"
          ? nextFields?.down
          : key === "ArrowLeft"
            ? nextFields?.left
            : key === "ArrowRight"
              ? nextFields?.right
              : null;

    if (nextFieldId) {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
        (nextField as HTMLInputElement).select?.();
      }
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {label && (
        <label htmlFor={id} className={`${classNameLabel} whitespace-nowrap`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`w-full ${isError ? "ring-2 ring-red-500 rounded-md" : ""}`} ref={containerRef}>        
      <DatePicker
        id={id}
        selected={useTodayAsDefault && !selectedDate ? new Date() : selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        className={`border border-gray-300 rounded-md px-4 py-2 text-sm text-center ${classNameInput}`}
        onKeyDown={handleKeyDown}
        wrapperClassName="w-full"
        isClearable={isClearable}
        disabled={isDisabled}
      />
      </div>
    </div>
  );
}
