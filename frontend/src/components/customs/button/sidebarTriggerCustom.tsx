import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";

const SidebarTriggerCustom = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={
        "-ml-1 h-7 w-7  text-theme-yellow "
      }
      onClick={() => {
        toggleSidebar();
      }}
    >
      {/* {open ? <RiArrowLeftSFill /> : <RiArrowRightSFill />} */}
      <GiHamburgerMenu  />

      {/* <span className="sr-only">Toggle Sidebar</span> */}
    </Button>
  );
};
export default SidebarTriggerCustom;
