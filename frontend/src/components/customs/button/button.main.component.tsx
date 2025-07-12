import { Button } from "@radix-ui/themes";
import { MouseEventHandler, ReactNode } from "react";

type ButtonsProps = {
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  btnType:
    | "submit"
    | "cancel"
    | "delete"
    | "default"
    | "search"
    | "primary"
    | "general";
  size?: "1" | "2" | "3";
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  variant?:
    | "classic"
    | "solid"
    | "soft"
    | "surface"
    | "outline"
    | "ghost"
    | undefined;
  loading?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
};

const Buttons = ({
  className,
  onClick,
  disabled = false,
  btnType = "default",
  size = "2",
  children,
  variant = "solid",
  loading,
  type,
}: ButtonsProps) => {
  // Define button styles based on `btnType`
  const buttonStyles: Record<string, string> = {
    general: "text-white",
    submit: "bg-save text-white hover:bg-hover_save", // Submit: Green
    cancel: "bg-gray-500 text-white hover:bg-gray-600", // Cancel: Grey
    delete: "bg-red-500 text-white hover:bg-red-600", // Delete: Red
    default:
      "bg-white text-[#00337d] border border-[#00337d] hover:bg-gray-100 ", // Default: White
    search: "bg-[#0DCAF0] text-white hover:bg-[#4FDDF5]", // Search: Info (blue)
    primary: "bg-[#00337d] text-white hover:bg-[#00337d]", // Primary: Indigo
  };

  const classNameBtn = buttonStyles[btnType] || "";
  const loadingBtn = loading ? "opacity-50 !cursor-not-allowed " : "";
  const hoverEffect =
    loading || disabled ? "" : "hover:opacity-100 hover:bg-opacity-80";

  return (
    <Button
      type={type}
      size={size}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
      loading={loading}
      className={`h-input_main px-3 rounded ${classNameBtn} ${className} ${loadingBtn} ${hoverEffect} ${
        disabled || loading
          ? "cursor-not-allowed"
          : "opacity-100 hover:opacity-100"
      } `}
      style={{
        boxShadow: btnType === "default" ? "inset 0 0 0 1px #00337d" : "",
      }}
    >
      {children}
    </Button>
  );
};
export default Buttons;
