import { Outlet } from "react-router-dom";
import NavbarMain from "./navbars/navbar.main";
import { useEffect, useState } from "react";
import { getAuthStatus, getLogout } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { IoIosLogOut } from "react-icons/io";
import { DataSideBar, SidebarComponent } from "./sidebars/sidebar";

import { FaAppStore, FaCartShopping, FaCircleUser } from "react-icons/fa6";
import { IoIosCube, IoIosSettings } from "react-icons/io";
import { GiSellCard } from "react-icons/gi";
import { FaCalendarDay } from "react-icons/fa";

// import { getUserProfie } from "@/services/user.service";
import { useLocalProfileData } from "@/zustand/useProfile";
import { permissionMap } from "@/utils/permissionMap";
import PermissionRedirect from "@/utils/permissionRedirect";
import { appConfig } from "@/configs/app.config";

const MainLayout = () => {
  const navigate = useNavigate();
  const { setLocalProfileData, profile } = useLocalProfileData();



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
        console.error(
          "Error creating category:",
          error.response?.data || error.message
        );
        alert("Failed to create category. Please try again.");
      });
  };

  useEffect(() => {
    getAuthStatus()
      .then((response) => {
        if (response.statusCode === 200 && response.responseObject) {
          setLocalProfileData(response.responseObject);
        } else if (response.message === "Authentication required") {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error.message);

        navigate("/login");
      });
  }, [navigate, setLocalProfileData]);

  const editprofile = () => {

    //navigate('/eidit/companies', { state: { customer_id: profile.company_id} });
    // navigate(`/edit-info-company/${dataCompany?.company_id}`);
  }

  const rawSidebarItems = [
    {
      title: "การวิเคราะห์ติดตามผล",
      url: "",
      icon: FaCalendarDay,
      disable: true,
      items: [
        {
          title: "ติดตามกระบวนการขาย",
          url: `/sell-process`,
        },
        {
          title: "การติดตามตัวชี้วัดสำคัญ", //ลูกหนี้
          url: `/dashboards`,
        },
        {
          title: "คาดการณ์ยอดขาย", //ลูกหนี้ที่เกินกำหนด
          url: `/predict-sell`,
        },
        {
          title: "รายงาน", //ลูกหนี้ที่เกินกำหนด
          url: `/reports`,
        }
      ],
    },
    // {
    //   title: "ข้อมูล",
    //   url: "",
    //   icon: FaAppStore,
    //   disable: true,
    //   items: [
    //     {
    //       title: "สี",
    //       url: `/ms-color`,
    //     },
    //   ],
    // },

    {
      title: "ลูกค้า",
      url: "",
      icon: FaCircleUser,
      disable: true,
      items: [
        {
          title: "การจัดการลูกค้า",
          url: `/manage-customer`,
        },
        {
          title: "กำหนดข้อมูลพื้นฐานลูกค้า",
          url: `/customer-info`,
        },
        {
          title: "กลุ่มแท็ก",
          url: `/customer-tag`,
        },
        {
          title: "บทบาทลูกค้า",
          url: `/customer-role`,
        },
        {
          title: "นิสัย",
          url: `/customer-character`,
        },
        {
          title: "บันทึกกิจกรรม",
          url: `/customer-activity`,
        },
      ],
    },
    {
      title: "การขายและธุรกรรม",
      url: "",
      icon: GiSellCard,
      disable: true,
      items: [
        {
          title: "ใบเสนอราคา",
          url: `/quotation`,
        },
        {
          title: "อนุมัติใบเสนอราคา",
          url: `/approve-quotation`,
        },
        {
          title: "ใบสั่งขาย",
          url: `/sale-order`,
        },
        {
          title: "ช่องทางการชำระเงิน",
          url: `/payment-method`,
        },
        {
          title: "สกุลเงิน",
          url: `/currency`,
        },
      ],
    },
    {
      title: "สินค้า",
      url: "",
      icon: IoIosCube,
      disable: true,
      items: [
        {
          title: "สินค้า",
          url: `/products`,
        },
        {
          title: "กลุ่มสินค้า",
          url: `/product-group`,
        },
        {
          title: "หน่วยสินค้า",
          url: `/product-unit`,
        },
      ],
    }, {
      title: "การตั้งค่าองค์กร",
      url: "",
      icon: IoIosSettings,
      disable: true,
      items: [
        {
          title: "การจัดการข้อมูลบริษัท",
          url: `/manage-info-company`,
        },
        {
          title: "พนักงาน",
          url: `/employee`,
        },
        {
          title: "การจัดการทีม",
          url: `/manage-team`,
        },
      ],
    },

  ];

  const profilePicture = profile?.profile_picture ?
    `${appConfig.baseApi}${profile?.profile_picture}`
    : null;

  // ฟังก์ชันกรองเฉพาะเมนูที่ role ของ user มีสิทธิ์ (A หรือ R)
  const filteredSidebarItems = rawSidebarItems
    .map((item) => {
      if (item.items) {
        // ตรวจสอบ permission ของ items ย่อย
        const filteredSubItems = item.items.filter((subItem) => {
          const permission =
            permissionMap[subItem.title]?.[
            profile?.role?.role_name ?? "Admin"
            ] || "N";
          return permission !== "N";
        });

        // ถ้ามี items ที่ผ่านการกรอง ให้สร้าง object ใหม่
        if (filteredSubItems.length > 0) {
          return { ...item, items: filteredSubItems };
        }
      }

      // ตรวจสอบ permission ของเมนูหลัก
      const permission =
        permissionMap[item.title]?.[profile?.role?.role_name ?? "Admin"] || "N";
      if (permission !== "N") {
        return item; // คืนค่าเมนูหลักที่มี permission
      }

      return null; // กรณีที่ไม่มี permission จะคืนค่าเป็น null
    })
    .filter((item) => item !== null); // กรอง null ออกจากอาร์เรย์

  const dataSidebar: DataSideBar = {
    sidebarItems: [
      {
        name: "",
        items: filteredSidebarItems,
      },
    ],
    sidebarFooter: {
      profile: {

        name: `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`,
        avatar: profilePicture ?? "/images/avatar2.png",
      },
      items: [
        {
          icon: <IoIosLogOut className="text-theme-yellow" />,
          name: "ออกจากระบบ",
          onClick: () => {
            console.log("logout");
            handleLogout();
          },
        },
        {
          icon: <IoIosLogOut className="text-theme-yellow" />,
          name: "แก้ไขโปรไฟล์บริษัท",
          onClick: () => {
            console.log("logout");
            editprofile();
          },
        },
      ],
    },
  };

  return (
    <div className=" relative w-screen h-screen">
      <PermissionRedirect />

      <SidebarProvider
        style={{
          height: "100%",
          width: "100%",
          paddingTop: "70px",
          overflow: "hidden",
          boxShadow: "4px 2px 12px 0px #0A0A100F",
        }}
      >
        <NavbarMain />
        <SidebarComponent data={dataSidebar} />
      
        <SidebarInset className="m-0 p-0 bg-[#F6F7F9] w-full max-w-full">
          {/* <header className="clas flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 p-4">
              <SidebarTriggerCustom />
            </div>
          </header> */}
          <div className=" px-4 py-4 overflow-auto max-h-[calc(100%-70px)]">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
