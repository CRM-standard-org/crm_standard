import { HTMLInputTypeAttribute } from "react";

type InputTextareaFormManageProps = {
  register: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
  placeholder: string;
  name: string;
  msgError?: string;
  type?: HTMLInputTypeAttribute | undefined;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  rows?: number;
};

const InputTextareaFormManage = ({
  register,
  placeholder,
  name,
  msgError,
  type = "text",
  disabled,
  required,
  showLabel = true,
  rows,
}: InputTextareaFormManageProps) => {
  return (
    <div className=" w-full">
      {showLabel && (
        <label
          className=" flex gap-1 "
          htmlFor={name}
          style={{
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "28px",
          }}
        >
          {name} {required && <div className=" text-red-500">*</div>}
        </label>
      )}
      <div className=" w-full flex  items-center relative mt-1">
        <textarea
          disabled={disabled}
          id={name}
          {...register}
          rows={rows ?? 4}
          maxLength={type === "to" || type === "tel" ? 10 : undefined}
          placeholder={placeholder}
          className={`no-spinners border rounded-lg text-black  p-4 w-full focus:border-gray focus:outline-none `}
        />
      </div>
      {msgError && <div className="text-require">{msgError}</div>}
    </div>
  );
};

export default InputTextareaFormManage;
