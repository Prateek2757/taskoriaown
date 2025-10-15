import { PaymentDetails } from "./PaymentDetails";
import PolicyDetails from "./PolicyDetails";
import PolicyLoanDetails from "./PolicyLoanDetails";


export const LoanRepaymentForm = () => {
    return (
        <div>

            <PolicyDetails policyDetails={null} />
            <PolicyLoanDetails policyDetails={null} />
            <PaymentDetails />

        </div>
    );
}