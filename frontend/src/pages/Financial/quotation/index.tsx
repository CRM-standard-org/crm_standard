import Quotation from "@/features/Financial/quotation"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <Quotation/>
        </ToastProvider>
    )
}
