import CustomerDetails from "@/features/Customer/customer-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CustomerDetails/>
        </ToastProvider>
    )
}
