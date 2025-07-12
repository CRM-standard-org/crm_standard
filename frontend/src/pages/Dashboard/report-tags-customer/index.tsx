import ReportTagsCustomer from "@/features/Dashboard/report-tags-customer"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ReportTagsCustomer/>
        </ToastProvider>
    )
}
