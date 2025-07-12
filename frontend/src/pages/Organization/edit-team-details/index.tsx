import EditTeamDetails from "@/features/Organization/edit-team-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditTeamDetails/>
        </ToastProvider>
    )
}
