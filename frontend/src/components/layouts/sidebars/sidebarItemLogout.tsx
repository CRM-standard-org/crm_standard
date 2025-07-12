import { IoIosLogOut } from "react-icons/io";
import { getLogout } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

export const SidebarItemLogout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    getLogout()
      .then((response) => {
          if (response.statusCode === 200) {
            navigate("/login"); 
          } else {
            alert(`Unexpected error: ${response.message}`);
          }
      })
      .catch((error) => {
          console.error("Error creating category:", error.response?.data || error.message);
          alert("Failed to create category. Please try again.");
      });
  };
  return (
    <div
      onClick={handleLogout}
      className={`sm:w-[256px] w-[60px] h-[48px] border-l-4 border-white p-2 flex gap-2 items-center hover:bg-bg_main  active:text-text_main_blue  cursor-pointer`}
    >
      <IoIosLogOut style={{ width: "24px", height: "24px" }} />
      <div className=" text-4 leading-6 font-normal  hidden sm:block">ออกจากระบบ</div>
    </div>
  );
};
