"use client";
import { ReactNode } from "react";

type ButtonProps = {
  onClick: () => void;
  children?: ReactNode;
  width?: string;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  isLoading?: boolean;
  disable?: boolean;
};
const ButtonOutline = (props: ButtonProps) => {
  const { onClick, children, width, type, className, disable } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disable}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px 10px 16px",
        borderRadius: "8px",
        backgroundColor: "white",
        width: width ?? "auto",
        color: "#074E9F",
        textTransform: "none",
        cursor: disable ? "not-allowed" : "pointer",
        border: "1px solid #074E9F",
      }}
      className={`${className} hover:bg-white hover:text-[#074E9F] `}
    >
      {children}
    </button>
  );
};

export default ButtonOutline;
