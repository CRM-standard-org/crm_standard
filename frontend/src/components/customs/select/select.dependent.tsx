import React, { useEffect, useState, useRef } from "react";
import Select, { ActionMeta, SingleValue, SelectInstance } from "react-select";

export type OptionType = {
  label: string;
  value: string | number | null;
  [key: string]: unknown; // For additional properties
};

type DependentSelectComponentProps = {
  onAction?: () => void;
  onChange: (
    option: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string; };
  // value can be an OptionType or a primitive id (string|number|null)
  value: SingleValue<OptionType> | string | number | null; // รับค่าที่แปลงแล้วจากข้างนอก
  fetchDataFromGetAPI: (search?: string) => Promise<{ responseObject?: Record<string, unknown>[] }>; // Function to fetch data
  // fetchDataFromGetAPI may optionally accept a search string: (search?: string) => Promise<any>
  isSearchable?: boolean; // enable type-ahead search
  minSearchLength?: number; // minimum chars to trigger search
  debounceMs?: number; // debounce time for input
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
  // defaultValue removed (unused)
  isDisabled,
  errorMessage,
  isSearchable = true,
  minSearchLength = 0,
  debounceMs = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceRef = useRef<number | null>(null);
  // props are provided via destructure with defaults

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


  const fetchOptions = async (search?: string) => {
    try {
      setIsLoading(true);
      // call the fetch function; if it accepts a parameter it will use it, otherwise JS ignores it
      const res = await fetchDataFromGetAPI(search);
      const formattedOptions = (res?.responseObject || []).map((item) => {
        const row = item as Record<string, unknown>;
        return ({
          label: String(row[labelKey] ?? ""),
          // normalize value to string to avoid type mismatch between stored form value and option.value
          value: row[valueKey] != null ? String(row[valueKey]) : null,
          ...row,
        } as OptionType);
      });
      setOptions(formattedOptions || []);
    } catch (error) {
      console.error("Error fetching select options:", error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // initial load without search
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // ensure the value passed to react-select is the exact option object from the internal options array
        value={
          ((): SingleValue<OptionType> | null => {
            if (value == null) return null;
            // if it's an object with value property
            if (typeof value === "object" && (value as Record<string, unknown>).value !== undefined) {
              const v = (value as Record<string, unknown>).value;
              const found = options.find((opt) => String(opt.value) === String(v));
              if (found) return found;
              // fallback: if parent provided a label, use it
              const label = (value as Record<string, unknown>).label ?? String(v);
              return { label: String(label), value: v } as OptionType;
            }
            // primitive (string|number)
            const found = options.find((opt) => String(opt.value) === String(value));
            if (found) return found;
            // fallback synthetic option so react-select shows the selection
            return { label: String(value), value: value as string | number | null } as OptionType;
          })()
        }
        onChange={(option, actionMeta) => {
          onChange(option, actionMeta); // ส่งกลับไปยัง parent
        }}
        onInputChange={(newValue, { action }) => {
          if (action === "input-change") {
            setInputValue(newValue);
            if (onInputChange) onInputChange(newValue);

            if (!isSearchable) return;

            // stop previous debounce
            if (debounceRef.current) window.clearTimeout(debounceRef.current);

            // only trigger if length meets minSearchLength
            if ((newValue || "").length < (minSearchLength || 0)) {
              // if cleared, optionally reload base options
              if (!newValue) fetchOptions();
              return;
            }

            debounceRef.current = window.setTimeout(() => {
              fetchOptions(newValue);
            }, debounceMs);
          }
        }}
        isSearchable={isSearchable}
        isLoading={isLoading}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        className={`${classNameSelect} ${isError ? "ring-2 ring-red-500 animate-shake rounded-sm" : ""}`}

  ref={selectRef}
        inputId={id}
        tabIndex={0}
        onKeyDown={handleKeyDown}
  onMenuOpen={() => fetchOptions(inputValue)}
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
          indicatorsContainer: (provided) => ({
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
