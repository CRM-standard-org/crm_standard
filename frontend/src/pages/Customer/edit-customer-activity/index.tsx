import EditCustomerActivity from "@/features/Customer/edit-customer-activity";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditCustomerActivity/>
        </ToastProvider>
    )
}
