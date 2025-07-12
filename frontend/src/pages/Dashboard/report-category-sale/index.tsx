import ReportCategorySale from "@/features/Dashboard/report-category-sale"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ReportCategorySale/>
        </ToastProvider>
    )
}
