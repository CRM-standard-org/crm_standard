import ForcastSale from "@/features/Dashboard/forcast-sale"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ForcastSale/>
        </ToastProvider>
    )
}
