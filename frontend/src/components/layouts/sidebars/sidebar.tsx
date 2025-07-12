import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { IconType } from "react-icons/lib";
import "../styles/sidebar.css";
import SideBarItems from "./sidebar-items";
import SidebarItemFooter from "./sidebar-item-footer";
import { useState } from "react";

export type DataSideBar = {
  sidebarHeader?: {
    name: string;
    avatar: string;
    headerItemsName: string;
    items: {
      name: string;
      url: string;
      avatar: string;
      onClick: () => void;
    }[];
  };

  sidebarItems: {
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
  }[];
  sidebarFooter?: {
    profile?: {
      name: string;
      avatar: string;
    };
    items?: {
      icon: React.ReactNode;
      name: string;
      onClick: () => void;
    }[];
  };
};
type SidebarComponentProps = {
  data: DataSideBar;
};
export function SidebarComponent(props: SidebarComponentProps) {
  const { data } = props;
  const { isMobile } = useSidebar();

  // เก็บสถานะเมนูที่เปิดอยู่
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // ฟังก์ชันสำหรับเปิด/ปิดเมนูย่อย
  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };
  return (
    <Sidebar className="border-white pt-[70px]">
      {data.sidebarHeader &&
        data.sidebarHeader.items &&
        data.sidebarHeader.items?.length > 0 && (
          <SidebarHeader className="bg-white">
            <SidebarMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    style={{ boxShadow: "none" }}
                    className="h-14 hover:bg-sidebar-activeitem hover:text-white data-[state=open]:bg-sidebar-activeitem data-[state=open]:text-white"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.sidebarHeader.avatar} alt={""} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.sidebarHeader.name}
                      </span>
                    </div>
                    <ChevronsUpDown className="text-yellow ml-auto size-4 text-theme-yellow" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-black bg-white text-white hover:opacity-100"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <SidebarGroupLabel className="text-write">
                    {data.sidebarHeader.headerItemsName}
                  </SidebarGroupLabel>
                  {data.sidebarHeader.items.map((item, index) => (
                    <React.Fragment key={item.name}>
                      <DropdownMenuGroup className="p-0 font-normal">
                        <DropdownMenuItem
                          onClick={item.onClick}
                          className="DropdownMenuItemCustom cursor-pointer"
                        >
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={item.avatar} alt={item.avatar} />
                            <AvatarFallback className="rounded-lg">
                              CN
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {item.name}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      {index + 1 !== data.sidebarHeader?.items.length && (
                        <DropdownMenuSeparator className="bg-black" />
                      )}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenu>
          </SidebarHeader>
        )}
      <SidebarContent className="bg-white">
        {data.sidebarItems.map((item) => (
          // <SideBarItems key={item.name} navMain={item} openMenu={openMenu} toggleMenu={toggleMenu}  />
          <SideBarItems key={item.name} navMain={item} />

        ))}
      </SidebarContent>
      <SidebarFooter className="bg-white">
        {data.sidebarFooter?.profile && data.sidebarFooter?.items && (
          <SidebarItemFooter
            user={data.sidebarFooter.profile}
            items={data.sidebarFooter?.items}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
