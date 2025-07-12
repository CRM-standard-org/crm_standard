import CreateCustomer from "@/features/Customer/create-customer"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CreateCustomer/>
        </ToastProvider>
    )
}
