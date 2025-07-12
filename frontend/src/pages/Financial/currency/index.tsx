import Currency from "@/features/Financial/currency"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <Currency/>
        </ToastProvider>
    )
}
