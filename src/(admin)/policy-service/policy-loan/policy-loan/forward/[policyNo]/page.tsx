import { PolicyDetails } from "../../components/PolicyDetails";
import { PolicyForwardForm } from "../../components/PolicyLoanForward";
import { ProductDetails } from "../../components/ProductDetails";


export default function Page() {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 my-6 bg-white rounded-lg border-1 ">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Policy Details
                </h2>
                <PolicyDetails />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Product Details
                </h2>
                <ProductDetails />
            </div>
        </div>
        <div className="">
            <PolicyForwardForm />
        </div>

    </div>;
}