import EditSaleOrder from "@/features/Financial/edit-sale-order"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <EditSaleOrder/>
        </ToastProvider>
    )
}
