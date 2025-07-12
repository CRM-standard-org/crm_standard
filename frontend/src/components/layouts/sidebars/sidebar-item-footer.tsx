import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, Box } from "@radix-ui/themes";
import { ReactNode } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const SidebarItemFooter = ({
  user,
  items,
}: {
  user: {
    name: string;
    avatar: string;
  };
  items: {
    icon: ReactNode;
    name: string;
    onClick: () => void;
  }[];
}) => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14  hover:text-black  data-[state=open]:text-black"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar> */}
              <Box className=" relative">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  fallback={"/images/avatar2.png"}
                  width={"32px"}
                  height={"32px"}
                  style={{ maxWidth: "32px", maxHeight: "32px"}}
                />
              </Box>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
              </div>
              <MdOutlineKeyboardArrowDown className="ml-auto size-4 text-theme-yellow" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg hover:opacity-100"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            {items?.map((item) => (
              <DropdownMenuItem
                onClick={item.onClick}
                key={item.name}
                className="DropdownMenuItemCustom cursor-pointer"
              >
                {/* <LogOut className="text-theme-yellow" /> */}
                {item.icon}
                <div className="h-full w-full">{item.name}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarItemFooter;
