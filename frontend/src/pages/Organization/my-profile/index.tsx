import MyProfileFeature from "@/features/Organization/my-profile";
import { ToastProvider } from "@/components/customs/alert/ToastContext";

export default function MyProfilePage() {
  return (
    <ToastProvider>
      <MyProfileFeature />
    </ToastProvider>
  );
}
