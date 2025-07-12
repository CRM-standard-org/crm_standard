import SummarySale from "@/features/Dashboard/summary-sale"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <SummarySale/>
        </ToastProvider>
    )
}
