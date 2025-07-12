import SaleOrderDetails from "@/features/Financial/sale-order-details"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <SaleOrderDetails/>
        </ToastProvider>
    )
}
