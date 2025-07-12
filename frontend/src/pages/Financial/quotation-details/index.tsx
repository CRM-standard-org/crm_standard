import QuotationDetails from "@/features/Financial/quotation-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <QuotationDetails/>
        </ToastProvider>
    )
}
