import CreateTeam from "@/features/Organization/create-team"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <CreateTeam/>
        </ToastProvider>
    )
}
