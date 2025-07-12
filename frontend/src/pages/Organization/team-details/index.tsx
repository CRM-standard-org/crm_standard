import TeamDetails from "@/features/Organization/team-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <TeamDetails/>
        </ToastProvider>
    )
}
