import ReportCustomers from "@/features/Dashboard/report-customers"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ReportCustomers/>
        </ToastProvider>
    )
}
