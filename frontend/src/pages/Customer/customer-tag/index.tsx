import CustomerTag from "@/features/Customer/customer-tag";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CustomerTag/>
        </ToastProvider>
    )
}
