import EditInfoQuotation from "@/features/Financial/edit-info-quotation"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditInfoQuotation/>
        </ToastProvider>
    )
}
