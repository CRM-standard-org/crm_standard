import { Avatar, Box, Flex, Link, Text } from "@radix-ui/themes";
import { useLocalProfileData } from "@/zustand/useProfile";
import SidebarTriggerCustom from "@/components/customs/button/sidebarTriggerCustom";
import { appConfig } from "@/configs/app.config";

const NavbarProfileInfo = () => {
  const { profile } = useLocalProfileData();
  const profilePicture = profile?.profile_picture ?
    `${appConfig.baseApi}${profile?.profile_picture}`
    : null;
  return (
    // <HoverCard.Root>
    //   <HoverCard.Trigger>
    //     <Flex className=" text-main mr-8" align={"center"} gap={"4"}>
    //       <Box className=" relative">
    //         <Box className=" w-3 h-3 rounded-full bg-green-600 absolute border-white border-2 bottom-0 right-0"></Box>
    //         <Avatar
    //           src="/images/avatar2.png"
    //           fallback={"/images/avatar2.png"}
    //           size={"2"}
    //         />
    //       </Box>
    //       <Text className=" text-sm">Admin</Text>
    //       <FaCaretDown />
    //     </Flex>
    //   </HoverCard.Trigger>
    //   <HoverCard.Content maxWidth="300px">
    //     <Flex gap={"2"} direction={"column"} width={"140px"}>
    //       <ListMenuNavbarProfile title={"ออกจากระบบ"} />
    //     </Flex>
    //   </HoverCard.Content>
    // </HoverCard.Root>
    <Flex className=" text-main mr-8" align={"center"} gap={"4"}>
      <Box className=" relative">
        <Box className=" w-3 h-3 rounded-full bg-green-600 absolute border-white border-2 bottom-0 right-0"></Box>
        <Avatar
          src={profilePicture || "/images/avatar2.png"}
          fallback={"/images/avatar2.png"}
          size={"2"}
        />
      </Box>
      <Text className=" text-sm">{profile?.role?.role_name ?? "Admin"}</Text>
    </Flex>
  );
};

const NavbarMain = () => {
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
        <NavbarProfileInfo />
      </Flex>
    </Flex>
  );
};

export default NavbarMain;
