import ApproveDetailsQuotation from "@/features/Financial/approve-details-quotation"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ApproveDetailsQuotation/>
        </ToastProvider>
    )
}
