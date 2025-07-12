import CustomerActivity from "@/features/Customer/customer-activity"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CustomerActivity/>
        </ToastProvider>
    )
}
