import EditCustomerDetails from "@/features/Customer/edit-customer-details";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditCustomerDetails/>
        </ToastProvider>
    )
}
