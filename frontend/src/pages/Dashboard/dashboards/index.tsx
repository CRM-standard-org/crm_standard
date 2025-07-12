import Dashboards from "@/features/Dashboard/dashboards"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <Dashboards/>
        </ToastProvider>
    )
}
