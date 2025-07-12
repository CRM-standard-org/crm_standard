import CreateEmployee from "@/features/Organization/create-employee"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CreateEmployee/>
        </ToastProvider>
    )
}
