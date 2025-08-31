import { Outlet } from "react-router-dom";
import { SidebarInset, useSidebar } from "../ui/sidebar";

const OutletApp = () => {
  const { open } = useSidebar();

  return (
    <SidebarInset
      className={`m-0 p-0 bg-[#F6F7F9] ${
        open ? "w-[calc(100%-255px)]" : "w-full"
      } max-w-full `}
    >
      <div className=" px-4 py-4 overflow-auto max-h-[calc(100%-70px)]">
        <Outlet />
      </div>
    </SidebarInset>
  );
};

export default OutletApp;
