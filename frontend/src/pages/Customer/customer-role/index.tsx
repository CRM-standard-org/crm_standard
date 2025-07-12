import CustomerRole from "@/features/Customer/customer-role";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CustomerRole/>
        </ToastProvider>
    )
}
