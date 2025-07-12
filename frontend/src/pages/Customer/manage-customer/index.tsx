import ManageCustomer from "@/features/Customer/manage-customer"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ManageCustomer/>
        </ToastProvider>
    )
}
