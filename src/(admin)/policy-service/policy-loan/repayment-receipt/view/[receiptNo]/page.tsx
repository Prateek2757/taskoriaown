import ReceiptPaymentView from "../../components/ReceiptPaymentView";
import { Image } from "lucide-react";
export default function Page() {
    return (
        <div className="border border-1 rounded-lg mt-4">
            <ReceiptPaymentView />
            <ReceiptPaymentView />
        </div>

    );
}