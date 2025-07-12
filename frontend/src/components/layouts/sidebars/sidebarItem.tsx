import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SidebarItemProps = {
  icon: ReactNode;
  name: string;
  path: string;
  disabled?: boolean;
};

export const SidebarItem = (props: SidebarItemProps) => {
  const location = useLocation();
  const pathWithIndex = location.pathname.split("/")[1];
  const path = props.path.replace("/", "");
  const isActivePath = pathWithIndex ? path.includes(pathWithIndex) : false;

  const activeClassName = isActivePath
    ? "text-text_main_blue border-l-[#074E9F] bg-bg_main"
    : "border-l-white";
  return (
    <Link
      to={props.path}
      className={twMerge(
        `sm:w-[256px] w-[60px] h-[48px] p-2 flex gap-2  border-l-[4px] items-center hover:bg-bg_main  active:text-text_main_blue cursor-pointer ${
          props.disabled ? "pointer-events-none bg-stone-50" : ""
        }`,
        activeClassName
      )}
    >
      {props.icon}
      <div className=" text-4 leading-6 font-normal hidden sm:block">
        {props.name}
      </div>
    </Link>
  );
};
