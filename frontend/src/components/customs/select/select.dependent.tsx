import React, { useEffect, useState, useRef } from "react";
import Select, { ActionMeta, SingleValue, SelectInstance } from "react-select";

export type OptionType = {
  label: string;
  value: string | number | null;
  [key: string]: any; // For additional properties
};

type DependentSelectComponentProps = {
  onAction?: () => void;
  onChange: (
    option: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string; };
  value: SingleValue<OptionType> | null; // รับค่าที่แปลงแล้วจากข้างนอก
  fetchDataFromGetAPI: () => Promise<any>; // Function to fetch data
  onInputChange?: (inputText: string) => void;
  valueKey: string; // Key to extract the value from fetched options
  labelKey: string; // Key to extract the label from fetched options
  placeholder?: string;
  isClearable?: boolean; // Allow clearing the selection
  label?: string; // Optional label for the input
  labelOrientation?: "horizontal" | "vertical"; // Label position
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

const DependentSelectComponent: React.FC<DependentSelectComponentProps> = ({
  onAction,
  onChange,
  id = "",
  nextFields = {},
  fetchDataFromGetAPI,
  onInputChange,
  value,
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      selectRef.current?.focus();
    }
  }, [isError]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const keycode = e.key;
    if (keycode === "Enter") {
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
      keycode === "ArrowUp"
        ? nextFields?.up
        : keycode === "ArrowDown"
          ? nextFields?.down
          : keycode === "ArrowLeft"
            ? nextFields?.left
            : keycode === "ArrowRight"
              ? nextFields?.right
              : null;

    if (nextFieldId) {
      const nextEl = document.getElementById(nextFieldId);

      if (nextEl) {
        nextEl.focus();
        if ((nextEl as HTMLInputElement).select) {
          (nextEl as HTMLInputElement).select();
        }
      }

      e.preventDefault();
    }
  };
  const [options, setOptions] = useState<OptionType[]>([]);
  // const [value, setValue] = useState<SingleValue<OptionType> | null>(null);
  const selectRef = useRef<SelectInstance<OptionType> | null>(null);


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetchDataFromGetAPI();
        const formattedOptions = res?.responseObject?.map((item: any) => ({

          label: item[labelKey],
          value: item[valueKey],
          ...item, // Include additional data if needed
        }));
        setOptions(formattedOptions);
        if (!formattedOptions) {
          // console.log("formattedOptions", formattedOptions);
          // setValue(null);
        }
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };

    fetchOptions();
  }, [fetchDataFromGetAPI, valueKey, labelKey]);

  // useEffect(() => {
  //   if (defaultValue) {
  //     const mewValue = options?.filter((o) => o.value === defaultValue.value);
  //     if (mewValue) {
  //       setValue(mewValue[0]);
  //     }
  //   }
  // }, [defaultValue, options]);

  return (
    <div
      ref={containerRef}
      className={`${className} flex flex-col sm:flex-row items-start sm:items-center gap-2`}
    >

      {label && (
        <div
          style={{
            marginBottom: labelOrientation === "vertical" ? "0.5rem" : "0",
          }}
          className={`${classNameLabel || ""} whitespace-nowrap `}
        >
          <label>{label}{require && <span style={{ color: "red" }}>*</span>}</label>
        </div>
      )}
      <Select
        options={options}
        // onChange={(
        //   option: SingleValue<OptionType>,
        //   actionMeta: ActionMeta<OptionType>
        // ) => {
        //   setValue(option);
        //   onChange(option, actionMeta);
        // }}
        // defaultValue={defaultValue}
        value={value}
        onChange={(option, actionMeta) => {
          onChange(option, actionMeta); // ส่งกลับไปยัง parent
        }}
        onInputChange={(inputValue, { action }) => {
          if (action === "input-change" && onInputChange) {
            onInputChange(inputValue);
          }
        }}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        className={`${classNameSelect} ${isError ? "ring-2 ring-red-500 animate-shake rounded-sm" : ""}`}

        ref={selectRef}
        inputId={id}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "32px",
            height: heightInput,
            borderColor: "#d9d9e0",
            backgroundColor: state.isDisabled ? "#f9f9fb" : "#ffffff",
            opacity: 1,
            boxShadow: "none",
            width: '100%',
            
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            height: heightInput,
            padding: "0 8px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }),
          singleValue: (base, state) => ({
            ...base,
            color: state.isDisabled ? "#0007149f" : "#000000",
            fontSize: "14px", // สามารถปรับขนาดตัวอักษรได้ตามต้องการ
          }),
          input: (base, state) => ({
            ...base,
            margin: "0",
            color: state.isDisabled ? "#0007149f" : "#000000",
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            height: heightInput,
          }),
        }}
        isDisabled={isDisabled}
      />
      {errorMessage && (
        <div className=" text-red-600 pt-1 text-xs"> {errorMessage}</div>
      )}
    </div>
  );
};

export default DependentSelectComponent;
