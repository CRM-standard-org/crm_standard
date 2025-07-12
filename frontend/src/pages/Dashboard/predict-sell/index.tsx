import PredictSell from "@/features/Dashboard/predict-sell"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <PredictSell/>
        </ToastProvider>
    )
}
