import CreateActivity from "@/features/Customer/create-activity"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CreateActivity/>
        </ToastProvider>
    )
}
