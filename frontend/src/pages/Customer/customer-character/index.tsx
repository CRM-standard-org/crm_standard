import CustomerCharacter from "@/features/Customer/customer-character";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CustomerCharacter/>
        </ToastProvider>
    )
}
