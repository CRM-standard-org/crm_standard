import ManageTeam from "@/features/Organization/manage-team"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ManageTeam/>
        </ToastProvider>
    )
}
