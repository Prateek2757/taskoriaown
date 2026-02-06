
export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">Refund Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated: {new Date().getFullYear()}
          </p>
        </div>

        <section className="space-y-4">
          <p>
            This Refund Policy explains the terms and conditions under which{' '}
            <strong>Taskoria Pty Ltd</strong> (ABN 37 658 760 831) ("Taskoria", "we", "our", or "us") 
            processes refunds for payments made through our Platform.
          </p>
          <p>
            Taskoria operates as a marketplace connecting Customers with Professionals. Our role is to 
            facilitate these connections, and refunds are subject to the specific circumstances of each 
            transaction.
          </p>
          <p>
            By using the Platform and engaging in transactions, you acknowledge that you have read, 
            understood, and agree to be bound by this Refund Policy.
          </p>
        </section>

        <section className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Important Notice
          </h2>
          <p className="text-blue-800 dark:text-blue-200">
            Taskoria acts as a marketplace platform facilitating connections between Customers and 
            Professionals. The contract for services is formed directly between the Customer and 
            Professional. Refund eligibility depends on the nature of the service, completion status, 
            and compliance with our Terms & Conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Scope of This Policy</h2>
          <p>This Refund Policy applies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Platform service fees charged to Customers</li>
            <li>Platform commission fees charged to Professionals</li>
            <li>Subscription or membership fees (where applicable)</li>
            <li>Featured listing or advertising fees</li>
            <li>Any other payments processed through the Taskoria Platform</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Customer Refunds</h2>
          
          <h3 className="text-xl font-semibold">2.1 Eligible Refund Scenarios</h3>
          <p>
            Customers may be eligible for a full or partial refund in the following circumstances:
          </p>
          
          <div className="ml-4 space-y-4">
            <div>
              <p className="font-semibold">Service Not Provided</p>
              <p className="text-gray-700 dark:text-gray-300">
                If a Professional fails to show up for a confirmed booking or does not provide 
                the agreed service, you may request a full refund of any fees paid through the Platform.
              </p>
            </div>

            <div>
              <p className="font-semibold">Service Significantly Different from Description</p>
              <p className="text-gray-700 dark:text-gray-300">
                If the service delivered is materially different from what was quoted or agreed upon, 
                and the Professional is unable or unwilling to rectify the issue, a refund may be considered.
              </p>
            </div>

            <div>
              <p className="font-semibold">Professional Misconduct or Policy Violation</p>
              <p className="text-gray-700 dark:text-gray-300">
                If a Professional engages in behaviour that violates our Community Guidelines or Terms 
                of Service (such as harassment, discrimination, or fraudulent activity), affected Customers 
                may receive a refund.
              </p>
            </div>

            <div>
              <p className="font-semibold">Cancellation by Professional</p>
              <p className="text-gray-700 dark:text-gray-300">
                If a Professional cancels a confirmed booking without valid reason or adequate notice, 
                the Customer will receive a full refund of any prepaid amounts.
              </p>
            </div>

            <div>
              <p className="font-semibold">Duplicate or Erroneous Charges</p>
              <p className="text-gray-700 dark:text-gray-300">
                If you are charged multiple times for the same service or charged in error, the duplicate 
                or incorrect charge will be refunded in full.
              </p>
            </div>

            <div>
              <p className="font-semibold">Platform Technical Errors</p>
              <p className="text-gray-700 dark:text-gray-300">
                If a payment was processed due to a technical error on our Platform (e.g., booking confirmed 
                without your authorization), a full refund will be issued.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6">2.2 Non-Eligible Refund Scenarios</h3>
          <p>
            Refunds will generally <strong>not</strong> be provided in the following situations:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Change of Mind:</strong> If you decide you no longer want the service after a 
              Professional has been engaged or work has commenced.
            </li>
            <li>
              <strong>Cancellation by Customer:</strong> If you cancel a confirmed booking (cancellation 
              fees may apply as outlined in our Terms & Conditions).
            </li>
            <li>
              <strong>Minor Dissatisfaction:</strong> General dissatisfaction with service quality that 
              does not rise to the level of material breach or non-performance.
            </li>
            <li>
              <strong>Completed Services:</strong> Services that have been completed in accordance with 
              the agreed terms and accepted by the Customer.
            </li>
            <li>
              <strong>Third-Party Issues:</strong> Issues arising from circumstances beyond Taskoria's 
              or the Professional's control (e.g., weather delays, client-side access issues).
            </li>
            <li>
              <strong>Failure to Communicate:</strong> Issues arising from Customer's failure to provide 
              accurate information, respond to Professional communications, or grant access as required.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">2.3 Partial Refunds</h3>
          <p>
            In cases where services were partially completed or the issue is partially resolved, 
            Taskoria may issue a partial refund at its discretion. The refund amount will be determined 
            based on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The extent of service completion</li>
            <li>The nature and severity of the issue</li>
            <li>Efforts made by the Professional to resolve the matter</li>
            <li>Evidence provided by both parties</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Professional Refunds</h2>
          
          <h3 className="text-xl font-semibold">3.1 Commission Fee Refunds</h3>
          <p>
            Professionals may be eligible for refunds of platform commission fees in limited circumstances:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cancelled Bookings:</strong> If a Customer cancels before service commencement 
              and no work was performed, commission fees will be refunded.
            </li>
            <li>
              <strong>Payment Disputes:</strong> If a payment is disputed and ultimately reversed, 
              any commission charged on that transaction will be refunded.
            </li>
            <li>
              <strong>Platform Errors:</strong> If commission was charged in error due to a technical 
              issue, the incorrect amount will be refunded.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">3.2 Subscription or Feature Refunds</h3>
          <p>
            Professionals who purchase subscriptions, featured listings, or advertising packages may 
            request refunds under the following conditions:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Within Cooling-off Period:</strong> Refunds available within 14 days of purchase 
              if the feature has not been substantially used.
            </li>
            <li>
              <strong>Service Outage:</strong> If the Platform experiences significant downtime affecting 
              your subscription benefits, a pro-rata refund may be issued.
            </li>
            <li>
              <strong>Non-Delivery of Features:</strong> If advertised features are not provided or 
              become unavailable, affected Professionals may receive refunds.
            </li>
          </ul>

          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>Note:</strong> Subscription refunds are generally not available once the subscription 
            period has commenced and features have been accessed or utilized.
          </p>
        </section>

        {/* Refund Process */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. How to Request a Refund</h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Step 1: Contact the Other Party</p>
              <p className="text-gray-700 dark:text-gray-300">
                Before requesting a refund through Taskoria, we encourage you to first attempt to 
                resolve the issue directly with the Professional or Customer through our messaging system.
              </p>
            </div>

            <div>
              <p className="font-semibold">Step 2: Submit a Refund Request</p>
              <p className="text-gray-700 dark:text-gray-300">
                If the issue cannot be resolved directly, submit a refund request through:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your Taskoria account dashboard ("Dispute" or "Request Refund" option)</li>
                <li>Email to: <span className="text-blue-600 dark:text-blue-400">support@taskoria.com</span></li>
                <li>Customer support portal on our website</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Step 3: Provide Required Information</p>
              <p className="text-gray-700 dark:text-gray-300">
                Your refund request must include:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Booking or transaction reference number</li>
                <li>Date of service or transaction</li>
                <li>Detailed explanation of the issue</li>
                <li>Supporting evidence (photos, messages, receipts, etc.)</li>
                <li>Amount requested for refund</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Step 4: Review and Investigation</p>
              <p className="text-gray-700 dark:text-gray-300">
                Our team will review your request and may contact both parties to gather additional 
                information. We aim to respond to refund requests within <strong>5-7 business days</strong>.
              </p>
            </div>

            <div>
              <p className="font-semibold">Step 5: Decision and Processing</p>
              <p className="text-gray-700 dark:text-gray-300">
                Once a decision is made, you will be notified via email. If approved, refunds are 
                typically processed within <strong>7-10 business days</strong> and will appear in your 
                original payment method.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mt-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Time Limit:</strong> Refund requests must be submitted within <strong>30 days</strong> of 
              the transaction or service completion date. Requests made after this period may not be considered.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Dispute Resolution</h2>
          
          <h3 className="text-xl font-semibold">5.1 Taskoria's Role</h3>
          <p>
            When disputes arise between Customers and Professionals, Taskoria will:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facilitate communication between parties</li>
            <li>Review evidence provided by both sides</li>
            <li>Make fair and reasonable determinations based on our policies</li>
            <li>Act as a neutral mediator where appropriate</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">5.2 Final Decision Authority</h3>
          <p>
            Taskoria reserves the right to make final determinations on refund eligibility. Our 
            decisions will be based on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Terms & Conditions compliance</li>
            <li>Evidence and documentation provided</li>
            <li>Historical conduct of involved parties</li>
            <li>Applicable consumer protection laws</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">5.3 Escalation Process</h3>
          <p>
            If you disagree with our refund decision, you may:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request a review by a senior member of our support team</li>
            <li>Provide additional evidence or information</li>
            <li>Seek external dispute resolution through relevant consumer protection authorities</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Refund Processing</h2>
          
          <h3 className="text-xl font-semibold">6.1 Processing Timeline</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-semibold">Request Review:</span>
              <span className="text-gray-700 dark:text-gray-300">5-7 business days</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-semibold">Refund Processing:</span>
              <span className="text-gray-700 dark:text-gray-300">7-10 business days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Bank/Card Processing:</span>
              <span className="text-gray-700 dark:text-gray-300">3-5 business days</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6">6.2 Refund Methods</h3>
          <p>
            Refunds will be issued using the original payment method whenever possible:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Credit/Debit Cards:</strong> Refunded to the original card</li>
            <li><strong>Bank Transfer:</strong> Refunded to the original bank account</li>
            <li><strong>Digital Wallets:</strong> Refunded to the original wallet</li>
            <li><strong>Platform Credit:</strong> May be offered as an alternative (with your consent)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">6.3 Platform Credit Option</h3>
          <p>
            In some cases, we may offer Platform credit as an alternative to a direct refund. 
            Platform credit:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Can be used for future bookings or services on Taskoria</li>
            <li>Does not expire within 12 months of issuance</li>
            <li>Is non-transferable and linked to your account</li>
            <li>May be offered with a bonus incentive (e.g., 110% credit value)</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>Note:</strong> Platform credit is always optional. You may decline and request 
            a standard refund instead.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Special Circumstances</h2>
          
          <h3 className="text-xl font-semibold">7.1 Emergency or Extreme Weather</h3>
          <p>
            In cases of extreme weather events, natural disasters, or emergencies that prevent 
            service delivery, Taskoria will work with both parties to find a fair resolution, 
            which may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full refund to the Customer</li>
            <li>Rescheduling without penalty</li>
            <li>Partial compensation to the Professional for preparation time</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">7.2 Service Provider Insolvency or Unavailability</h3>
          <p>
            If a Professional becomes unavailable (e.g., business closure, serious illness) and 
            cannot fulfill a booking, Taskoria will:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Issue a full refund to affected Customers</li>
            <li>Attempt to connect you with alternative Professionals</li>
            <li>Provide support throughout the transition</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">7.3 Fraudulent Activity</h3>
          <p>
            If we detect or confirm fraudulent activity related to a transaction:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Affected parties will receive full refunds</li>
            <li>The fraudulent account will be permanently suspended</li>
            <li>We will cooperate with law enforcement as appropriate</li>
            <li>Additional security measures may be implemented</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Your Consumer Rights</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              Australian Consumer Law (ACL)
            </h3>
            <p className="text-green-800 dark:text-green-200">
              This Refund Policy operates in conjunction with your rights under the Australian 
              Consumer Law. Nothing in this policy excludes, restricts, or modifies your statutory 
              rights under the ACL.
            </p>
          </div>

          <p className="mt-4">
            Under the Australian Consumer Law, you have certain consumer guarantees including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Services must be provided with acceptable care and skill</li>
            <li>Services must be fit for the purpose disclosed</li>
            <li>Services must be provided within a reasonable time</li>
            <li>The right to a remedy if these guarantees are not met</li>
          </ul>

          <p className="mt-4">
            For more information about your consumer rights, visit the Australian Competition 
            and Consumer Commission (ACCC) website at{' '}
            <span className="text-blue-600 dark:text-blue-400">www.accc.gov.au</span>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Refund Fees and Charges</h2>
          
          <h3 className="text-xl font-semibold">9.1 No Refund Processing Fees</h3>
          <p>
            Taskoria does not charge fees for processing legitimate refund requests. If you are 
            entitled to a refund, you will receive the full refunded amount without deductions.
          </p>

          <h3 className="text-xl font-semibold mt-6">9.2 Third-Party Payment Processing Fees</h3>
          <p>
            Please note that payment processing fees charged by third-party payment providers 
            (credit card companies, banks, payment gateways) are generally non-refundable. These 
            fees are set by the payment provider, not Taskoria.
          </p>

          <h3 className="text-xl font-semibold mt-6">9.3 Currency Conversion</h3>
          <p>
            If your original payment involved currency conversion, refunds will be processed in 
            the original currency. Exchange rate fluctuations between the payment date and refund 
            date may result in a different amount in your local currency.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Contact Us</h2>
          <p>
            If you have questions about this Refund Policy or need assistance with a refund request, 
            please contact us:
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-3">
            <div>
              <p className="font-semibold">Email:</p>
              <p className="text-blue-600 dark:text-blue-400">support@taskoria.com</p>
            </div>
            <div>
              <p className="font-semibold">Customer Support Portal:</p>
              <p className="text-gray-700 dark:text-gray-300">Available via your Taskoria account dashboard</p>
            </div>
            <div>
              <p className="font-semibold">Business Address:</p>
              <p className="text-gray-700 dark:text-gray-300">Taskoria Pty Ltd</p>
              <p className="text-gray-700 dark:text-gray-300">ABN 37 658 760 831</p>
            </div>
            <div>
              <p className="font-semibold">Response Time:</p>
              <p className="text-gray-700 dark:text-gray-300">We aim to respond to all inquiries within 24-48 hours</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Changes to This Policy</h2>
          <p>
            We may update this Refund Policy from time to time to reflect changes in our practices, 
            legal requirements, or business operations. When we make changes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We will update the "Last Updated" date at the top of this page</li>
            <li>Material changes will be communicated via email or platform notification</li>
            <li>Your continued use of the Platform constitutes acceptance of the updated policy</li>
          </ul>
          <p className="mt-3">
            We encourage you to review this Refund Policy periodically to stay informed about 
            our refund practices.
          </p>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Acknowledgment</h2>
          <p className="text-gray-700 dark:text-gray-300">
            By using the Taskoria Platform, you acknowledge that you have read, understood, and 
            agree to be bound by this Refund Policy. If you do not agree with any part of this 
            policy, please discontinue use of our services.
          </p>
        </section>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p>
            This Refund Policy was last updated in {new Date().getFullYear()} and is effective immediately.
          </p>
          {/* <p className="mt-2">
            © {new Date().getFullYear()} Taskoria Pty Ltd. All rights reserved.
          </p> */}
        </div>
      </div>
    </div>
  );
}