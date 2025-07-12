import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Box } from "@radix-ui/themes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TbPointFilled } from "react-icons/tb";

type SidebarItemProps = {
  icon: ReactNode;
  name: string;
  path: string;
  menu?: { icon: JSX.Element; name: string; path: string }[];
  disabled?: boolean;
};

export const SidebarMenuItem = (props: SidebarItemProps) => {
  const location = useLocation();
  const pathWithIndex = location.pathname.split("/")[1];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={props.name} className=" border-0">
        <AccordionTrigger
          className="p-0 px-2 m-0"
          style={{ textDecoration: "none" }}
        >
          <Box
            className={twMerge(
              `sm:w-[100px] w-[60px] h-[48px]  flex gap-2  border-l-[4px] items-center ${
                props.disabled ? "pointer-events-none bg-stone-50" : ""
              } border-l-white `
            )}
          >
            {props.icon}
            <div className=" text-4 leading-6 font-normal hidden sm:block ">
              {props.name}
            </div>
          </Box>
        </AccordionTrigger>
        <AccordionContent>
          {props.menu &&
            props.menu?.length > 0 &&
            props.menu.map((item) => {
              const path = item.path.replace("/", "");
              const isActivePath = pathWithIndex ? path.includes(pathWithIndex) : false;
              const activeClassName = isActivePath
                ? "text-text_main_blue border-l-[#074E9F] bg-bg_main"
                : "border-l-white";
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={twMerge(
                    `sm:w-[256px] w-[60px] h-[48px] p-2 pl-10 flex gap-2  border-l-[4px] items-center hover:bg-bg_main  active:text-text_main_blue cursor-pointer ${
                      props.disabled ? "pointer-events-none bg-stone-50" : ""
                    }`,
                    activeClassName
                  )}
                >
                  <TbPointFilled />
                  <div className=" text-4 leading-6 font-normal hidden sm:block">
                    {item.name}
                  </div>
                </Link>
              );
            })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
