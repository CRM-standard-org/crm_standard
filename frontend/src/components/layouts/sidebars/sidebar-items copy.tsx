import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { IconType } from "react-icons/lib";
import { Link, useLocation } from "react-router-dom";

const SideBarItems = ({
  navMain,
}: {
  navMain: {
    name: string;
    items: {
      title: string;
      url: string;
      icon: IconType;
      isActive?: boolean;
      disable?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  };
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  const [openCollapsible, setOpenCollapsible] = useState(false);

  const getActiveClass = (url: string) => {
    const currentPathname = pathname.split("?")[0]; // เอาแค่ path ไม่รวม query string
    const targetPathname = url.split("?")[0]; // เอาแค่ path ของ url

    // ตรวจสอบว่า targetPathname เริ่มต้นด้วย currentPathname และต้องไม่เป็นเพียงแค่ prefix
    if (targetPathname === currentPathname) {
      return "bg-bg_main hover:bg-bg_main text-[#00337d] hover:text-[#00337d] font-bold";
    }
    return ""; // ถ้าไม่ตรงกับเงื่อนไขใดๆ
  };

  return (
    <SidebarGroup>
      {navMain.name && (
        <SidebarGroupLabel className="text-write">
          {navMain.name}
        </SidebarGroupLabel>
      )}

      <SidebarMenu>
        {navMain.items.map((item) => {
          return item.items && item.items?.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              open={openCollapsible}
            >
              <SidebarMenuItem className="focus:border-none focus:outline-none">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    style={{ boxShadow: "none" }}
                    className={`sidebar-item-custom transition-opacity delay-150 duration-300 ${
                      item.disable ? "" : "hover:opacity-100"
                    } active:bg-sidebar-activeitem ${getActiveClass(
                      item.url
                    )} h-10 focus:border-none focus:outline-none`}
                    onClick={() => setOpenCollapsible(!openCollapsible)}
                  >
                    {item.disable ? (
                      <div className="flex gap-2 items-center">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link
                        to={item.url}
                        className="focus:border-none focus:outline-none flex"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                    <SidebarMenuAction
                      className={`data-[state=open]:rotate-90 ${
                        openCollapsible ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      <ChevronRight className="" />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={getActiveClass(subItem.url)}
                        >
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem
              key={item.title}
              className="focus:border-none focus:outline-none"
            >
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                style={{ boxShadow: "none" }}
                className={`sidebar-item-custom transition-opacity delay-150 duration-300  ${
                  item.disable ? "" : "hover:opacity-100"
                } active:bg-sidebar-activeitem ${getActiveClass(
                  item.url
                )} h-10 focus:border-none focus:outline-none`}
              >
                {item.disable ? (
                  <div>
                    <item.icon className=" w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                ) : (
                  <Link
                    to={item.url}
                    className="focus:border-none focus:outline-none"
                  >
                    <item.icon className=" w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default SideBarItems;
