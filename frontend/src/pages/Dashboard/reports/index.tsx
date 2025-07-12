import Reports from "@/features/Dashboard/reports"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <Reports/>
        </ToastProvider>
    )
}
