import Products from "@/features/Product/products"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <Products/>
        </ToastProvider>
    )
}
