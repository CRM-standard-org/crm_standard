import SellProcess from "@/features/Dashboard/sell-process"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <SellProcess/>
        </ToastProvider>
    )
}
