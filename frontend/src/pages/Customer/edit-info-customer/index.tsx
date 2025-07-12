import EditInfoCustomer from "@/features/Customer/edit-info-customer"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditInfoCustomer/>
        </ToastProvider>
    )
}
