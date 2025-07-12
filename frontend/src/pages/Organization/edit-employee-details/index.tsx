import EditEmployeeDetails from "@/features/Organization/edit-employee-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditEmployeeDetails/>
        </ToastProvider>
    )
}
