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

  // ใช้ object ในการเก็บ state ของแต่ละเมนู
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // ฟังก์ชันเปิด/ปิดเมนูย่อย
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // ตรวจสอบ active class
  const getActiveClass = (url: string) => {
    const currentPathname = pathname.split("?")[0];
    const targetPathname = url.split("?")[0];

    return currentPathname === targetPathname
      ? "bg-bg_main text-[#00337d] font-bold"
      : "";
  };

  return (
    <SidebarGroup>
      {navMain.name && <SidebarGroupLabel>{navMain.name}</SidebarGroupLabel>}

      <SidebarMenu>
        {navMain.items.map((item) => {
          const isOpen = openMenus[item.title] || false;

          return item.items && item.items.length > 0 ? (
            <Collapsible key={item.title} asChild open={isOpen}>
              <SidebarMenuItem className="focus:border-none focus:outline-none">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={`sidebar-item-custom transition-opacity ${
                      item.disable ? "" : "hover:opacity-100"
                    } ${getActiveClass(item.url)} h-10`}
                    onClick={() => toggleMenu(item.title)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>

                    <SidebarMenuAction
                      className={`transition-transform ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      <ChevronRight />
                    </SidebarMenuAction>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={getActiveClass(subItem.url)}
                        >
                          <Link to={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`sidebar-item-custom transition-opacity ${
                  item.disable ? "" : "hover:opacity-100"
                } ${getActiveClass(item.url)} h-10`}
              >
                <Link to={item.url}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideBarItems;
