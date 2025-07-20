
import React, { useEffect, useState, useRef } from "react";
import Select, { MultiValue, ActionMeta, SelectInstance } from "react-select";
import TagCustomer from "@/components/customs/tagCustomer/tagCustomer";

export type OptionColorType = {
  label: string;
  value: string;
  color: string;
};

type TagSelectComponentProps = {
  onChange: (
    option: MultiValue<OptionColorType>,
    actionMeta: ActionMeta<OptionColorType>
  ) => void;
  fetchDataFromGetAPI: () => Promise<any>;
  onInputChange?: (inputText: string) => void;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
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
  defaultValue?: MultiValue<OptionColorType> | null;
  isDisabled?: boolean;
  errorMessage?: string;
};

const TagSelectComponent: React.FC<TagSelectComponentProps> = ({
  onChange,
  onInputChange,
  fetchDataFromGetAPI,
  id = "",
  nextFields = {},
  placeholder = "กรุณาเลือก...",
  isClearable = true,
  label = "",
  labelOrientation = "horizontal",
  className = "",
  classNameSelect = "",
  classNameLabel = "",
  require = "",
  isError,
  heightInput = "32px",
  defaultValue = [],
  isDisabled = false,
  errorMessage,
}) => {
  const [options, setOptions] = useState<OptionColorType[]>([]);
  const [selectedTags, setSelectedTags] = useState<MultiValue<OptionColorType> | null>(null);
  const selectRef = useRef<SelectInstance<OptionColorType> | null>(null);
  const [hasSetDefault, setHasSetDefault] = useState(false);

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
        const tagList = res?.responseObject || [];

        const formattedOptions = tagList.map((tag: any) => ({
          label: tag.tag_name || tag.name,
          value: tag.tag_id || tag.id,
          color: tag.color,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error loading tag options", error);
      }
    };

    fetchOptions();
  }, [fetchDataFromGetAPI]);

  // defaultValue
  useEffect(() => {
    if (!hasSetDefault && defaultValue && defaultValue.length > 0 && options.length > 0) {
      const defaults = options.filter((opt) =>
        defaultValue.some((d) => d.value === opt.value)
      );
      setSelectedTags(defaults);
      setHasSetDefault(true);
    }
  }, [defaultValue, options, hasSetDefault]);



  const handleKeyDown = (e: React.KeyboardEvent) => {
    const keycode = e.key;
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

  const handleChange = (
    selected: MultiValue<OptionColorType>,
    actionMeta: ActionMeta<OptionColorType>
  ) => {
    setSelectedTags(selected);
    onChange(selected, actionMeta);
  };

  return (
    <div
      ref={containerRef}
      className={`${className} flex flex-col sm:flex-row items-start sm:items-center gap-2`}
    >

      {label && (
        <div
          style={{ marginBottom: labelOrientation === "vertical" ? "0.5rem" : "0" }}
          className={`${classNameLabel || ""} whitespace-nowrap`}
        >
          <label>{label}{require && <span style={{ color: "red" }}>*</span>}</label>

        </div>
      )}

      <Select

        isMulti
        options={options}
        value={selectedTags}
        onChange={handleChange as any}
        onInputChange={(inputValue, { action }) => {
          if (action === "input-change" && onInputChange) {
            onInputChange(inputValue);
          }
        }}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        className={`${classNameSelect} ${isError ? "ring-2 ring-red-500 animate-shake rounded-sm" : ""}`}

        isDisabled={isDisabled}
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
          }),
          multiValue: (styles, { data }) => ({
            ...styles,
            backgroundColor: data.color || "#3b82f6",
            color: "#fff",
          }),
          multiValueLabel: (styles) => ({
            ...styles,
            color: "#fff",
          }),
          multiValueRemove: (styles) => ({
            ...styles,
            color: "#fff",
            ":hover": {
              backgroundColor: "#2563eb",
              color: "#fff",
            },
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: heightInput,
          }),
        }}
      />



      {errorMessage && <div className="text-red-600 pt-1 text-xs">{errorMessage}</div>}
    </div>
  );
};

export default TagSelectComponent;
