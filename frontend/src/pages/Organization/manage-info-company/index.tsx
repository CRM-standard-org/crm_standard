import ManageInfoCompany from "@/features/Organization/manage-info-company"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ManageInfoCompany/>
        </ToastProvider>
    )
}
