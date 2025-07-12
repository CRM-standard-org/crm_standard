import { Outlet } from "react-router-dom";
import NavbarMain from "./navbars/navbar.main";
import SidebarMain from "./sidebars/sidebar.main";
import { useEffect } from "react";
import { getAuthStatus } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getAuthStatus()
      .then((response) => {
        if (response.statusCode === 200) {  
          if (response.message == "Authentication required") {
            navigate("/login"); 
          }    
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error.message);
      });
  }, []);


  return (
    <div className=" relative w-screen h-screen">
      <NavbarMain />
      <div className=" flex pt-[70px] w-full h-full">
        <SidebarMain  />
        <div className="bg-[#F6F7F9] overflow-auto w-full sm:p-6"><Outlet /></div>
      </div>
    </div>
  );
};

export default MainLayout;
