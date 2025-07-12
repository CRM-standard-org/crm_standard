import { MS_USER_ALL } from "@/types/response/response.user";
import { create } from "zustand";

interface LocalProfileData {
  profile: MS_USER_ALL;
  setLocalProfileData: (data: MS_USER_ALL) => void;
}

// Define a default user profile
const defaultProfile: MS_USER_ALL = {
  employee_id: "",
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  role_id: "",
  birthday: undefined,
  phone_number: "",
  line_id: "",
  addr_number: "",
  addr_alley: "",
  addr_street: "",
  addr_subdistrict: "",
  addr_district: "",
  addr_province: "",
  addr_postcode: "",
  position: "",
  remark: "",
  created_at: undefined,
  updated_at: undefined,
  created_by: "",
  updated_by: "",
  role: undefined,
};

export const useLocalProfileData = create<LocalProfileData>()((set) => ({
  profile: defaultProfile,
  setLocalProfileData: (data: MS_USER_ALL) => {
    set({ profile: data });
  },
}));
