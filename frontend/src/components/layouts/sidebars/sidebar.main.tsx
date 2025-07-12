import "./sidebar.css";
import { SidebarItemLogout } from "./sidebarItemLogout";
import { SidebarItem } from "./sidebarItem";
import { IoHomeOutline } from "react-icons/io5";
import { RiProductHuntLine } from "react-icons/ri";
import { FaWpforms } from "react-icons/fa";
import { PiGooglePhotosLogo } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { SidebarMenuItem } from "./sidebarMenuItem";

const SidebarMain = () => {
  const ListSidebarItems: {
    icon: JSX.Element;
    name: string;
    path: string;
    menu?: { icon: JSX.Element; name: string; path: string }[];
    disabled?: boolean;
  }[] = [
    {
      icon: <IoHomeOutline style={{ width: "24px", height: "24px" }} />,
      name: "แดชบอร์ด",
      path: `/dashboard`,
      disabled: true,
    },
    // {
    //   icon: <PiGooglePhotosLogo style={{ width: "24px", height: "24px" }} />,
    //   name: "การชำระเงินล่าช้า",
    //   path: `/overdue-payment`,
    //   disabled: true,
    // },
    // {
    //   icon: <PiGooglePhotosLogo style={{ width: "24px", height: "24px" }} />,
    //   name: "การวางแผน",
    //   path: `/planning`,
    //   disabled: true,
    // },
    // {
    //   icon: <PiGooglePhotosLogo style={{ width: "24px", height: "24px" }} />,
    //   name: "ตารางการส่งมอบ",
    //   path: `/delivery-schedule`,
    //   disabled: true,
    // },
    // {
    //   icon: <BiCategory style={{ width: "24px", height: "24px" }} />,
    //   name: "งาน",
    //   path: `/task`,
    //   disabled: true,
    // },
    // {
    //   icon: <RiProductHuntLine style={{ width: "24px", height: "24px" }} />,
    //   name: "การขาย",
    //   path: `/sale`,
    //   disabled: true,
    // },
    // {
    //   icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
    //   name: "ข้อมูลหลัก",
    //   path: `/master`,
    //   disabled: true,
    // },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ปฏิทิน",
      path: `/calendar`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "สาเหตุ",
      path: `/ms-issue-reason`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "เครื่องมือ",
      path: `/ms-tool`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "กลุ่มซ่อม",
      path: `/ms-group-repair`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "สี",
      path: `/ms-color`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ลูกค้า",
      path: `/ms-customer`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "แบรนด์",
      path: `/ms-brand`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ตำแหน่ง",
      path: `/ms-position`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "รายการซ่อม",
      path: `/ms-repair`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "รุ่นรถ",
      path: `/ms-brandmodel`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "จัดการสาขา",
      path: `/ms-companies`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ร้านค้า",
      path: `ms-supplier`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "เปลี่ยนผู้รับผิดชอบ",
      path: `/responsible-person`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "การชำระเงินล่าช้า",
      path: `/late-payment`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "งาน",
      path: `/job`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ปฏิทินนัดหมายถอด",
      path: `/calendar-removal`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "เหตุผลการใช้เครื่องมือ",
      path: `/ms-tooling-reason`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "บิลใบส่งมอบ",
      path: `/delivery-schedule`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "Sale",
      path: `/sale`,
      menu: [
        {
          icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
          name: "ใบเสนอราคา",
          path: `/quotation`,
        },
        {
          icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
          name: "ใบรับซ่อม",
          path: `/ms-repair-receipt`,
        },
        {
          icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
          name: "เยี่ยมลูกค้า",
          path: `/visiting-customers`,
        },
      ],
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "Approve",
      path: `/approve-quotation`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "Payment",
      path: `/ms-payment`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ใบรับซ่อม Supplier",
      path: `/get-supplier`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ใบส่งเคลม",
      path: `/send-for-a-claim`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ใบรับเคลม",
      path: `/receive-a-claim`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "Register",
      path: `/register`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "__Barcode",
      path: `/barcode`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "clearby",
      path: `/clearby`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ใบส่งซัพพลายเออร์",
      path: `/supplier-delivery-note`,
    },
    {
      icon: <FaWpforms style={{ width: "24px", height: "24px" }} />,
      name: "ใบรับซ่อมซัพพลายเออร์",
      path: `/supplier-repair-receipt`,
    },
  ];
  return (
    <section
      style={{ boxShadow: "4px 2px 12px 0px #0A0A100F" }}
      className=" sm:w-[256px] w-[64px]  relative z-10 h-[calc(100vh-118px)] "
    >
      <div className="overflow-y-auto overflow-x-hidden h-full">
        {ListSidebarItems.map((item) => {
          return item.menu && item.menu.length > 0 ? (
            <SidebarMenuItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              path={item.path}
              menu={item.menu}
              disabled={item.disabled}
            />
          ) : (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              path={item.path}
              disabled={item.disabled}
            />
          );
        })}
      </div>

      <div className=" fixed bottom-0 border-t-[1px] border-[#f6f7f9]">
        <SidebarItemLogout />
      </div>
    </section>
  );
};

export default SidebarMain;
