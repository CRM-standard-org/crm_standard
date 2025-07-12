import EmployeeDetails from "@/features/Organization/employee-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EmployeeDetails/>
        </ToastProvider>
    )
}
