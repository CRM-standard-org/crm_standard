import {
  Avatar,
  Box,
  Flex,
  Link,
  Text,
  DropdownMenu,
  Separator,
} from "@radix-ui/themes";
import { useLocalProfileData } from "@/zustand/useProfile";
import SidebarTriggerCustom from "@/components/customs/button/sidebarTriggerCustom";
import { appConfig } from "@/configs/app.config";
import { LuLogOut, LuUser, LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

type NavbarMainProps = {
  onLogout?: () => void;
};

const NavbarProfileMenu = ({ onLogout }: { onLogout?: () => void }) => {
  const navigate = useNavigate();
  const { profile } = useLocalProfileData();
  const profilePicture = profile?.profile_picture
    ? `${appConfig.baseApi}${profile?.profile_picture}`
    : null;
  const fullName =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
    "ผู้ใช้งาน";
  const roleName = profile?.role?.role_name || "-";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Flex
          className=" text-main mr-2 sm:mr-4 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
          align="center"
          gap="3"
        >
          <Box className=" relative">
            <Box className=" w-3 h-3 rounded-full bg-green-600 absolute border-white border-2 bottom-0 right-0"></Box>
            <Avatar
              src={profilePicture || "/images/avatar2.png"}
              fallback={"/images/avatar2.png"}
              size="2"
            />
          </Box>
          <Box className="hidden sm:flex flex-col items-start leading-tight">
            <Text className=" text-sm font-medium max-w-[200px] truncate">
              {fullName}
            </Text>
            <Text className=" text-[11px] text-gray-500 max-w-[200px] truncate">
              {roleName}
            </Text>
          </Box>
        </Flex>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <Box className="px-2 py-2">
          <Text className=" text-xs text-gray-500">เข้าสู่ระบบเป็น</Text>
          <Text className=" text-sm font-medium block max-w-[240px] truncate">
            {fullName}
          </Text>
          <Text className=" text-xs text-gray-500 max-w-[240px] truncate">
            {roleName}
          </Text>
        </Box>
        <Separator size="4" />
        <DropdownMenu.Item onSelect={() => navigate("/my-profile")}>
          <Flex align="center" gap="2">
            <LuUser />
            <Text className=" text-sm">โปรไฟล์ของฉัน</Text>
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <Flex align="center" gap="2">
            <LuSettings />
            <Text className=" text-sm">ตั้งค่า</Text>
          </Flex>
        </DropdownMenu.Item>
        <Separator size="4" />
        <DropdownMenu.Item color="red" onSelect={() => onLogout?.()}>
          <Flex align="center" gap="2">
            <LuLogOut />
            <Text className=" text-sm">ออกจากระบบ</Text>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const NavbarMain = ({ onLogout }: NavbarMainProps) => {
  return (
    <Flex
      className="fixed w-screen top-0 h-[70px] shadow-navbar bg-white z-20"
      justify={"center"}
      align={"center"}
    >
      <Flex
        className="w-full"
        justify={"between"}
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,.108)",
          padding: "15px 30px",
        }}
      >
        <div className=" flex gap-4 items-center">
          <SidebarTriggerCustom />
          <Link href={"/"}>
            <Box className=" overflow-hidden sm:w-[320px] w-[200px]">
              <img
                src="/images/logo.png"
                alt="logo-main-website"
                className="hover:cursor-pointer hover:opacity-60 opacity-100 transition ease-in-out duration-300  sm:h-[40px] h-[32px]"
              />
            </Box>
          </Link>
        </div>
        <NavbarProfileMenu onLogout={onLogout} />
      </Flex>
    </Flex>
  );
};

export default NavbarMain;
