import SaleOrder from "@/features/Financial/sale-order"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <SaleOrder/>
        </ToastProvider>
    )
}
