import { useLocalProfileData } from "@/zustand/useProfile";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { permissionMap } from "./permissionMap";

const PermissionRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useLocalProfileData();

  React.useEffect(() => {
    if (profile && profile.role?.role_name) {
      // Create a mapping of URL paths to permissionMap keys
      const pathToPermissionMapKey: Record<string, string> = {
        "ms-color": "สี",
        "manage-customer": "การจัดการลูกค้า",
        "customer-info": "กำหนดข้อมูลพื้นฐานลูกค้า",
        "customer-tag": "กลุ่มแท็ก",
        "customer-role": "บทบาทลูกค้า",
        "customer-activity": "บันทึกกิจกรรม", 
        "quotation":"ใบเสนอราคา",
        "approve-quotation":"อนุมัติใบเสนอสินค้า",
        "sale-order":"ใบสั่งขาย",
        "products":"สินค้าทั้งหมด",
        "product-group":"กลุ่มสินค้า",
        "product-unit":"หน่วยสินค้า",
        "manage-info-company":"การจัดการข้อมูลบริษัท",
        "employee":"พนักงาน",
        "manage-team":"การจัดการทีม",

      };
      // Find the corresponding permissionMap key by matching the pathname
      const matchedPath = Object.keys(pathToPermissionMapKey).find((path) =>
        location.pathname.includes(path)
      );

      if (matchedPath) {
        const pathName = pathToPermissionMapKey[matchedPath];

        const matchedPermission = Object.entries(permissionMap).find(([key]) =>
          pathName.includes(key)
        );

        if (matchedPermission) {
          const [, permissions] = matchedPermission;
          // Check if the user has permission for this object
          const userPermission = permissions[profile.role?.role_name];

          if (userPermission === "N") {
            // Redirect to /home if the user has no permission ('N')
            navigate("/");
          }
        }
      }
    }
  }, [location, profile, navigate]);

  return null; // This component doesn't render anything, it's just used for logic
};

export default PermissionRedirect;
