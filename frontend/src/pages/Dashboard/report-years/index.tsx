import ReportYears from "@/features/Dashboard/report-years"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ReportYears/>
        </ToastProvider>
    )
}
