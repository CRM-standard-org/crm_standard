import ProductUnit from "@/features/Product/product-unit"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ProductUnit/>
        </ToastProvider>
    )
}
