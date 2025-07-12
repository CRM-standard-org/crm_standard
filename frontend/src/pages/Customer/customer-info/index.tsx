import CustomerInfo from "@/features/Customer/customer-info"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CustomerInfo/>
        </ToastProvider>
    )
}
