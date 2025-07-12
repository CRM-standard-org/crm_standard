"use client";

import { ReactNode } from "react";

type ButtonProps = {
  id?: string;
  onClick: () => void;
  children?: ReactNode;
  width?: string;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  isLoading?: boolean;
};
const ButtonDefault = (props: ButtonProps) => {
  const { onClick, children, width, type, className, isLoading, id } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px 10px 16px",
        borderRadius: "8px",
        backgroundColor: "#074E9F",
        width: width ?? "auto",
        color: "white",
        textTransform: "none",
        cursor: isLoading ? "wait" : "pointer",
      }}
      className={`hover:bg-[#074E9F] hover:text-white  ${className} `}
    >
      <label
        htmlFor={id}
        className=" w-full h-full"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: isLoading ? "wait" : "pointer",
        }}
      >
        {children}
      </label>
    </button>
  );
};

export default ButtonDefault;
