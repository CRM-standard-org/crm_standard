import Employee from "@/features/Organization/employee"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <Employee/>
        </ToastProvider>
    )
}
