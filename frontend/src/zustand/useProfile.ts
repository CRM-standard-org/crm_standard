import { TypeAuth } from "@/types/response/response.auth"; 
import { create } from "zustand";

interface LocalProfileData {
  profile: TypeAuth;
  setLocalProfileData: (data: TypeAuth) => void;
}

const defaultProfile: TypeAuth = {
  employee_id: "",
  first_name: "",
  last_name: "",
  role: {
    role_id: "",
    role_name: "",
  },
  profile_picture: "",
};

export const useLocalProfileData = create<LocalProfileData>()((set) => ({
  profile: defaultProfile,
  setLocalProfileData: (data: TypeAuth) => {
    set({ profile: data });
  },
}));