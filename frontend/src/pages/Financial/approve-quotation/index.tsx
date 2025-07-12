import ApproveQuotation from "@/features/Financial/approve-quotation"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ApproveQuotation/>
        </ToastProvider>
    )
}
