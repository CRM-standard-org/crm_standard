import React, { useEffect, useState, useRef } from "react";
import Select, { ActionMeta, SingleValue, SelectInstance } from "react-select";

export type OptionType = {
  label: string;
  value: string | number | null;
  [key: string]: any;
};


type MasterSelectComponentProps = {
  onAction?: () => void;
  onChange: (
    option: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
  fetchDataFromGetAPI: () => Promise<any>;
  onInputChange?: (inputText: string) => void;
  valueKey: string;
  labelKey: string;
  placeholder?: string;
  isClearable?: boolean;
  label?: string;
  labelOrientation?: "horizontal" | "vertical";
  className?: string;
  classNameSelect?: string;
  classNameLabel?: string;
  require?: string;
  isError?: boolean;
  heightInput?: string;
  defaultValue?: SingleValue<OptionType> | null;
  isDisabled?: boolean;
  errorMessage?: string;
};

const MasterSelectComponent: React.FC<MasterSelectComponentProps> = ({
  onAction,
  onChange,
  id = "",
  nextFields = {},
  fetchDataFromGetAPI,
  onInputChange,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  isClearable = true,
  label = "",
  labelOrientation = "vertical",
  className = "",
  classNameSelect = "",
  classNameLabel = "",
  require = "",
  isError,
  heightInput = "32px",
  defaultValue,
  isDisabled,
  errorMessage,
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [value, setValue] = useState<SingleValue<OptionType> | null>(null);
  const selectRef = useRef<SelectInstance<OptionType> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      selectRef.current?.focus();
    }
  }, [isError]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetchDataFromGetAPI();
        const formattedOptions = res?.responseObject?.map((item: any) => ({
          label: item[labelKey],
          value: item[valueKey],
          ...item,
        }));
        setOptions(formattedOptions);
        if (!formattedOptions) {
          setValue(null);
        }
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };

    fetchOptions();
  }, [fetchDataFromGetAPI, valueKey, labelKey]);

  useEffect(() => {
    if (defaultValue) {
      const matchedValue = options?.find((o) => o.value === defaultValue.value);
      if (matchedValue) {
        setValue(matchedValue);
      }
    }
  }, [defaultValue, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;

    if (key === "Enter") {
      if (onAction) {
        onAction(); // Call onAction if provided
      } else {
        selectRef.current?.focus();
        selectRef.current?.onMenuOpen?.();
        e.preventDefault();
        return;
      }


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
      const nextEl = document.getElementById(nextFieldId);
      if (nextEl) {
        nextEl.focus();
        (nextEl as HTMLInputElement).select?.();
      }
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className} flex flex-col sm:flex-row items-start sm:items-center gap-2`}
    >

      {label && (
        <div
          style={{ marginBottom: labelOrientation === "vertical" ? "0.5rem" : "0" }}
          className={`${classNameLabel} whitespace-nowrap`}
        >
          <label>{label}{require && <span style={{ color: "red" }}>*</span>}</label>
        </div>
      )}
      <Select

        options={options}
        onChange={(option, actionMeta) => {
          setValue(option);
          onChange(option, actionMeta);
        }}
        onInputChange={(inputValue, { action }) => {
          if (action === "input-change" && onInputChange) {
            onInputChange(inputValue);
          }
        }}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        className={`${classNameSelect} ${isError ? "ring-2 ring-red-500 animate-shake rounded-sm" : ""}`}
        ref={selectRef}
        inputId={id}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        isDisabled={isDisabled}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "32px",
            height: heightInput,
            borderColor: "#d9d9e0",
            backgroundColor: state.isDisabled ? "#f9f9fb" : "#ffffff",
            opacity: 1,
            boxShadow: "none",
            width: "100%",
            
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            height: heightInput,
            padding: "0 8px",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: state.isDisabled ? "#0007149f" : "#000000",
            fontSize: "14px",
          }),
          input: (base, state) => ({
            ...base,
            margin: "0",
            color: state.isDisabled ? "#0007149f" : "#000000",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: heightInput,
          }),

        }}
      />
      {errorMessage && (
        <div className="text-red-600 pt-1 text-xs">{errorMessage}</div>
      )}
    </div>
  );
};

export default MasterSelectComponent;
