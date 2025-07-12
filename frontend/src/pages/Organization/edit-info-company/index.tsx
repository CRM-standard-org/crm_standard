import EditInfoCompany from "@/features/Organization/edit-info-company"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditInfoCompany/>
        </ToastProvider>
    )
}
