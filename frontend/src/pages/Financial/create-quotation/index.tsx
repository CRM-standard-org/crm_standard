import CreateQuotation from "@/features/Financial/create-quotation"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CreateQuotation/>
        </ToastProvider>
    )
}
