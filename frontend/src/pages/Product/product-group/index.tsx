import ProductGroup from "@/features/Product/product-group"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ProductGroup/>
        </ToastProvider>
    )
}
