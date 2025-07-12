import PaymentMethod from "@/features/Financial/payment-method"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <PaymentMethod/>
        </ToastProvider>
    )
}
