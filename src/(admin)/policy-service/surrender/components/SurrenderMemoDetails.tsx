"use client";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const SurrenderMemoPage = ({ proposalData }: { proposalData: any }) => {
  const displayData = (field: string): string => {
    if (!proposalData) return "Loading...";

    // Handle nested fields and specific formatting
    switch (field) {
      case "fullName":
        return proposalData.fullName || "N/A";
      case "policyNumber":
        return proposalData.policyNumber || "N/A";
      case "productName":
        return proposalData.productName || "N/A";
      case "sumAssured":
        return proposalData.sumAssured
          ? `₹${proposalData.sumAssured.toLocaleString()}`
          : "N/A";
      case "term":
        return proposalData.term || "N/A";
      case "payTerm":
        return proposalData.payTerm || "N/A";
      case "modeOfPayment":
        return proposalData.modeOfPayment || "N/A";
      case "dateOfBirth":
        return proposalData.dateOfBirth
          ? new Date(proposalData.dateOfBirth).toLocaleDateString()
          : "N/A";
      case "totalPremiumPaid":
        return proposalData.totalPremiumPaid
          ? `₹${proposalData.totalPremiumPaid.toLocaleString()}`
          : "N/A";
      case "branchName":
        return proposalData.branchName || "N/A";
      case "premium":
        return proposalData.premium
          ? `₹${proposalData.premium.toLocaleString()}`
          : "N/A";
      case "basicPremium":
        return proposalData.basicPremium
          ? `₹${proposalData.basicPremium.toLocaleString()}`
          : "N/A";
      case "dateOfCommencement":
        return proposalData.dateOfCommencement
          ? new Date(proposalData.dateOfCommencement).toLocaleDateString()
          : "N/A";
      case "nextDueDate":
        return proposalData.nextDueDate
          ? new Date(proposalData.nextDueDate).toLocaleDateString()
          : "N/A";
      case "lastPremiumPaidDate":
        return proposalData.lastPremiumPaidDate
          ? new Date(proposalData.lastPremiumPaidDate).toLocaleDateString()
          : "N/A";
      case "dateOfMaturity":
        return proposalData.dateOfMaturity
          ? new Date(proposalData.dateOfMaturity).toLocaleDateString()
          : "N/A";
      case "surrenderDate":
        return proposalData.surrenderDate
          ? new Date(proposalData.surrenderDate).toLocaleDateString()
          : "N/A";
      case "anniversaryDate":
        return proposalData.anniversaryDate
          ? new Date(proposalData.anniversaryDate).toLocaleDateString()
          : "N/A";
      case "riskStartDate":
        return proposalData.riskStartDate
          ? new Date(proposalData.riskStartDate).toLocaleDateString()
          : "N/A";
      case "vestingDate":
        return proposalData.vestingDate
          ? new Date(proposalData.vestingDate).toLocaleDateString()
          : "N/A";
      case "requestBranch":
        return proposalData.requestBranch || "N/A";
      case "isBlackListed":
        return proposalData.isBlackListed ? "Yes" : "No";
      case "isAssigned":
        return proposalData.isAssigned ? "Yes" : "No";
      case "noOfPremiumPaidInYears":
        return proposalData.noOfPremiumPaidInYears || "N/A";
      case "paidUpSumAssured":
        return proposalData.paidUpSumAssured
          ? `₹${proposalData.paidUpSumAssured.toLocaleString()}`
          : "N/A";
      case "adjustedPSA":
        return proposalData.adjustedPSA
          ? `₹${proposalData.adjustedPSA.toLocaleString()}`
          : "N/A";
      case "totalBonus":
        return proposalData.totalBonus
          ? `₹${proposalData.totalBonus.toLocaleString()}`
          : "N/A";
      case "adjustedBonus":
        return proposalData.adjustedBonus
          ? `₹${proposalData.adjustedBonus.toLocaleString()}`
          : "N/A";
      case "paidUpValue":
        return proposalData.paidUpValue
          ? `₹${proposalData.paidUpValue.toLocaleString()}`
          : "N/A";
      case "surrenderValueFactor":
        return proposalData.surrenderValueFactor || "N/A";
      case "completedMonths":
        return proposalData.completedMonths || "N/A";
      case "monthlyAdjustmentFactor":
        return proposalData.monthlyAdjustmentFactor || "N/A";
      case "surrenderValue":
        return proposalData.surrenderValue
          ? `₹${proposalData.surrenderValue.toLocaleString()}`
          : "N/A";
      case "totalAmount":
        return proposalData.totalAmount
          ? `₹${proposalData.totalAmount.toLocaleString()}`
          : "N/A";
      case "tax":
        return proposalData.tax
          ? `₹${proposalData.tax.toLocaleString()}`
          : "N/A";
      case "netPayable":
        return proposalData.netPayable
          ? `₹${proposalData.netPayable.toLocaleString()}`
          : "N/A";
      case "amountInWords":
        return proposalData.amountInWords || "N/A";
      default:
        const value = proposalData[field];
        return value || "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print and Back buttons */}
      <div className="flex justify-end gap-2 p-4 no-print">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Home
        </Button>
      </div>

      {/* Print Content Container */}
      <div className="print-content">
        {/* First Page - Main Content */}
        <div className="bg-gray-100 w-full  max-w-6xl mx-auto p-3 print:bg-white print:p-0">
          <div className="space-y-3">
            {/* Header */}
            <div className="text-center">
              <img
                className="mx-auto mb-1 h-10"
                src="/images/logo.png"
                alt="Logo"
              />
              <h3 className="text-xl font-bold text-gray-900 main-title">
                Surrender Memo
              </h3>
            </div>

            {/* Proposal Details Section */}
            <div className="border-t border-b border-black py-1">
              <h4 className="text-center font-bold text-base section-title">
                Proposal Details
              </h4>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-3 overflow-x-scroll">
              {/* Left Column */}
              <div className="space-y-2">
                <table className="w-full border border-gray-300 compact-table">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <th className="w-1/3 p-1 text-left font-medium">
                        Policy No
                      </th>
                      <td className="w-1/12 text-center">:</td>
                      <td className="w-1/2 p-1">
                        {displayData("policyNumber")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">Name</th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("fullName")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">Product</th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("productName")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">Sum Assured</th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("sumAssured")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Term | Pay Term
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">
                        {displayData("term")} | {displayData("payTerm")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">MOP</th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("modeOfPayment")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Proposer Name
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("fullName")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">DOB</th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("dateOfBirth")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Total Premium Paid
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("totalPremiumPaid")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Policy Branch
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("branchName")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Is Assigned?
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("isAssigned")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <table className="w-full border border-gray-300 compact-table">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <th className="w-1/2 p-1 text-left font-medium">
                        Premium
                      </th>
                      <td className="w-1/12 text-center">:</td>
                      <td className="w-1/3 p-1">{displayData("premium")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Basic Premium
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("basicPremium")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">DOC</th>
                      <td className="text-center">:</td>
                      <td className="p-1">
                        {displayData("dateOfCommencement")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Next Due Date
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("nextDueDate")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Last Premium Paid Date
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">
                        {displayData("lastPremiumPaidDate")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Date of Maturity
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("dateOfMaturity")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Date of Surrender
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("surrenderDate")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Anniversary Date
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("anniversaryDate")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Risk Start Date
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("riskStartDate")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Vesting Date
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("vestingDate")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Request Branch
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("requestBranch")}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-medium">
                        Is BlackList?
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1">{displayData("isBlackListed")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculation Part Section */}
            <div className="border-t border-b border-black py-1">
              <h4 className="text-center font-bold text-base section-title">
                Calculation Part
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-x-scroll">
              {/* Left Column - PSA Table */}
              <div className="space-y-2">
                <table className="w-full border border-gray-300 text-xs compact-table">
                  <thead>
                    <tr className="border-b border-gray-300 text-center font-bold">
                      <td className="p-1">Ins.</td>
                      <td className="p-1">Term</td>
                      <td className="p-1">Rate</td>
                      <td className="p-1">Amount</td>
                      <td className="p-1">Period</td>
                      <td className="p-1">SVF</td>
                      <td className="p-1">SV</td>
                    </tr>
                  </thead>
                  <tbody>
                    {proposalData?.paidUpSumAssuredList ? (
                      <tr className="border-b border-gray-300 text-center">
                        <td className="p-1">1</td>
                        <td className="p-1">20</td>
                        <td className="p-1">5%</td>
                        <td className="p-1">₹50,000</td>
                        <td className="p-1">1</td>
                        <td className="p-1">0.8</td>
                        <td className="p-1">₹40,000</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-1 text-center">
                          No Data Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <table className="w-full border border-gray-300 compact-table">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <th className="w-3/5 p-1 text-left font-bold">
                        No of Premium Paid (In Years)
                      </th>
                      <td className="w-1/12 text-center">:</td>
                      <td className="w-1/3 p-1 text-right">
                        {displayData("noOfPremiumPaidInYears")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">
                        Paid Up Sum Assured
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("paidUpSumAssured")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">Adjusted PSA</th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("adjustedPSA")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">Bonus</th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("totalBonus")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">
                        Adjusted Bonus
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("adjustedBonus")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">Paid Up Value</th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("paidUpValue")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">
                        Surrender Value Factor
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("surrenderValueFactor")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">
                        No. of Completed Months
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("completedMonths")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">
                        Monthly Adjustment Factor
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("monthlyAdjustmentFactor")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="p-1 text-left font-bold">
                        Surrender Value
                      </th>
                      <td className="text-center">:</td>
                      <td className="p-1 text-right">
                        {displayData("surrenderValue")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Column - Bonus Table */}
              <div className="space-y-2">
                <table className="w-full border border-gray-300 compact-table">
                  <thead>
                    <tr className="border-b border-gray-300 text-center">
                      <td className="w-1/6 p-1">SN</td>
                      <td className="w-1/4 p-1">Start</td>
                      <td className="w-1/4 p-1">End</td>
                      <td className="w-1/10 p-1">Rate</td>
                      <td className="w-1/10 p-1">Inst</td>
                      <td className="w-1/10 p-1 text-center">Bonus</td>
                    </tr>
                  </thead>
                  <tbody>
                    {proposalData?.bonusList &&
                    proposalData.bonusList.length > 0 ? (
                      <>
                        {proposalData.bonusList.map(
                          (bonus: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-300 text-center"
                            >
                              <td className="p-1">{index + 1}</td>
                              <td className="p-1">
                                {bonus.startDate
                                  ? new Date(
                                      bonus.startDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="p-1">
                                {bonus.endDate
                                  ? new Date(bonus.endDate).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="p-1">
                                {bonus.rate ? `${bonus.rate}%` : "N/A"}
                              </td>
                              <td className="p-1">
                                {bonus.installments || "N/A"}
                              </td>
                              <td className="p-1 text-right">
                                {bonus.bonusAmount
                                  ? `₹${bonus.bonusAmount.toLocaleString()}`
                                  : "N/A"}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className="border-b border-gray-300 text-center font-bold">
                          <td className="p-1"></td>
                          <td className="p-1"></td>
                          <td className="p-1"></td>
                          <td className="p-1">Total</td>
                          <td className="p-1">:</td>
                          <td className="p-1 text-right">
                            {displayData("totalBonus")}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr className="border-b border-gray-300 text-center">
                        <td className="p-1" colSpan={6}>
                          No bonus data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accounting Part Section */}
            <div className="border-t border-b border-black py-1">
              <h4 className="text-center font-bold text-base section-title">
                Accounting Part
              </h4>
            </div>

            <div className="w-1/2 overflow-x-scroll">
              <table className="w-full border border-gray-300 compact-table">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <th className="w-1/2 p-1 text-left">Total Amount</th>
                    <td className="w-1/12 text-center">:</td>
                    <td className="w-1/3 p-1 text-right">
                      {displayData("totalAmount")}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="p-1 text-left">Tax</th>
                    <td className="text-center">:</td>
                    <td className="p-1 text-right">{displayData("tax")}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="p-1 text-left font-bold">Net Payable</th>
                    <td className="text-center">:</td>
                    <td className="p-1 text-right font-bold">
                      {displayData("netPayable")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount in Words */}
            <div className="p-3">
              <p className="font-bold text-sm">
                Amount in words:{" "}
                <strong>{displayData("amountInWords") || "N/A"}</strong>
              </p>
              <p className="mt-1 text-sm">
                Hence, It is approved to release payment to Mr./Mrs./Ms.{" "}
                <strong>{displayData("fullName")}</strong>.
              </p>
            </div>

            {/* Signatures */}
            <table className="w-full mt-4 overflow-x-hidden">
              <tbody>
                <tr>
                  <td className="text-center">_______________________</td>
                  <td className="text-center">_______________________</td>
                  <td className="text-center">_______________________</td>
                </tr>
                <tr>
                  <td className="text-center text-sm">
                    <strong>Prepared By</strong>
                    <br />
                  </td>
                  <td className="text-center text-sm">
                    <strong>Checked By</strong>
                    <br />
                  </td>
                  <td className="text-center text-sm">
                    <strong>Approved By</strong>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td className="text-center text-sm">(John Smith)</td>
                  <td className="text-center text-sm"></td>
                  <td className="text-center text-sm">(Jane Doe)</td>
                </tr>
              </tbody>
            </table>

            <div className="text-right mt-2">
              <span className="text-xs">
                Generated by Admin on 2024-01-01 10:30:00
              </span>
            </div>
          </div>
        </div>

        {/* Second Page - Nepali Content */}
        <div
          className="bg-gray-100 w-full max-w-6xl mx-auto p-3 mt-4 print:bg-white print:p-0 print:mt-0 page-break"
          id="daabi"
        >
          <div className="mt-4">
            <div className="text-center">
              <img
                className="mx-auto mb-1 h-10"
                src="/images/logo.png"
                alt="Logo"
              />
              <h1 className="text-lg font-bold">
                आई. एम. ई. लाइफ इन्स्योरेन्स कम्पनी लिमिटेड
              </h1>
              <p className="text-xs mt-1">
                पोष्ट बक्स नं. ७४०, हाथवे कम्प्लेक्स, लैनचौर-२६, काठमाण्डौ,
                नेपाल ।<br />
                फोन नं. ४०२४०७१, फ्याक्स नं. ४०२४०७५
              </p>
              <h1 className="text-lg font-bold mt-1">दावी फछ्यौट पूर्जा</h1>
            </div>

            <div className="mt-3 text-justify">
              <p className="text-xs">
                <strong>आई. एम. ई. लाइफ इन्स्योरेन्स कम्पनी लिमिटेडबाट</strong>{" "}
                मेरो/ हाम्रो नाममा जारी भएको <strong>Life Insurance</strong>{" "}
                प्रकारको बीमालेख नं. <strong>POL123456789</strong> अन्तर्गत बीमा
                भएकोमा मिति ................... मा अवधि भुक्तानी भएको वा{" "}
                <strong> बीमालेख समर्पण गरिएको </strong> वा
                .........................कारणबाट मृत्यु भएको
                वा........................कारणबाट अशक्त / अपाङ्ग भएको वा
                ........................कारणवाट दावी भुक्तानी बापत तपसीलमा
                उल्लेख भएका शिर्षक अन्तर्गत प्रचलित ऐन नियम बमोजिम लाग्ने{" "}
                <strong> ५% </strong> कर रकम रु.{" "}
                <strong> ७,१८२ (अक्षेरुपी सात हजार एक सय बयासी) </strong>
                कट्टा गरी जम्मा रकम{" "}
                <strong>
                  {" "}
                  रु. १,३६,४५८ (अक्षरेपी एक लाख छत्तीस हजार चार सय पचास आठ){" "}
                </strong>{" "}
                उपलब्ध गराइएमा
                <strong> आई. एम. ई लाइफ इन्स्योरेन्स कं. लि. </strong> लाई यस
                बीमालेख अन्तर्गतको उल्लेखित दायित्वबाट मुक्त गरिदिन मन्जुर
                गर्दछु/गर्दछौ । यसमा अन्यथा भए गरेमा यसै कागजको आधारमा बदर
                गरिदिन मञ्जुर छौ भनि राजिखुशी साथ यो सहि छाप गरि दिएँ/दियौं ।
              </p>
            </div>

            {/* Nepali Tables and Forms */}
            <div className="mt-3">
              <p className="font-bold underline text-xs">तपसील</p>
              <p className="text-xs">
                १. बीमा बापतको रकम
                &nbsp;रु...................(अक्षेरुपी..................................)
              </p>
              <p className="text-xs">
                २.बोनस वापत रकम (यदि दिइने भएमा)
                &nbsp;रु.......................(अक्षेरुपी.................................)
              </p>
              <p className="text-xs">
                ३. पुरक करार अन्तर्गतका रकमहरु (यदि आकर्षित हुने भएमा) :
              </p>
              <p className="text-xs">
                क) दुर्घटना बापत रकम
                &nbsp;रु.........................(अक्षेरुपी.............................)
              </p>
              <p className="text-xs">
                ख) स्थायी पूर्ण अशक्तता बापत प्रदान गरिने मासिक आय सुविधा रकम
                मिति..............................देखि...................................सम्म
                एकमुष्ठ / मासिक रु...................................का दरले
                बीमालेखको शर्त बमोजिम नियमित रुपले भुक्तानी गरिने ।
              </p>
              <p className="text-xs">
                (ग) बीमीत जीवित रहेसम्मको लागि पूरक करारमा रहेको व्यवस्था बमोजिम
                नियमित रुपमा बीमालेख बहाल रहने गरी बीमितको तर्फबाट भुक्तानी
                हुनुपर्ने बीमाशुल्क स्वत भुक्तानी भएको मान्य हुनुपर्ने गरि प्रति
                किस्ता एकमुष्ठ / मासिक रु............................
                (अक्षेरुपी.......................................)का दरले
                बीमाशुल्क छूट सुविधा बीमकले प्रदान गर्ने ।
              </p>
              <p className="text-xs">
                घ) मासिक आपको रुपमा
                मिति.........................देखि..........................सम्म
                प्रति महिना
                रु..............................(अक्षेरुपी.......................................)का
                दरले नियमित रुपमा भुक्तानी गरिने ।
              </p>
              <p className="text-xs">
                ४. समर्पण मूल्य बापतको जम्मा रकम रु.{" "}
                <strong>
                  १,४३,६४० (अक्षेरुपी एक लाख त्रैसठ हजार छ सय चालीस)
                </strong>
                <br />
                <span className="text-xs">
                  (स्पष्टिकरण, समर्पण मूल्य रकममा बोनश मुनाफाको अंश समावेश भए
                  नभएको स्पष्ट उल्लेख गर्नु पर्नेछ ।)
                </span>
              </p>
            </div>

            <div className="mt-2">
              <table className="w-full" id="noBorder">
                <tbody>
                  <tr>
                    <td className="text-xs">
                      <strong>कूल दाबी रकम </strong>
                    </td>
                    <td className="text-xs">
                      रु.{" "}
                      <strong>
                        {" "}
                        १,४३,६४० (अक्षेरुपी एक लाख त्रैसठ हजार छ सय चालीस){" "}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs">
                      प्रचलित नियम बमोजिम कट्टी गर्नुपर्ने कर रकम{" "}
                    </td>
                    <td className="text-xs">
                      रु.{" "}
                      <strong>७,१८२ (अक्षेरुपी सात हजार एक सय बयासी) </strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs">
                      कर कट्टा गरेपछि बीमितले पाउने खूद दावी रकम
                    </td>
                    <td className="text-xs">
                      रु.{" "}
                      <strong>
                        १,३६,४५८ (अक्षेरुपी एक लाख छत्तीस हजार चार सय पचास आठ){" "}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Table */}
            <div className="mt-3">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th
                      className="text-left w-3/5 font-bold text-xs"
                      colSpan={3}
                    >
                      बीमीतको तर्फबाट दावी फछ्यौट पूर्जामा हस्ताक्षर गर्ने
                      व्यक्तिः-
                    </th>
                    <th className="text-left font-bold text-xs">
                      बीमकको तर्फबाट दावी फछ्यौट पूर्जा जारी गर्ने अधिकारीको:-
                    </th>
                  </tr>
                  <tr>
                    <td  className="text-xs border-2 border-black">हस्ताक्षर:-</td>
                    <td className="text-center w-1/3 text-xs border-2 border-black" colSpan={2}>
                      <strong>औंठा छाप</strong>
                    </td>
                    <td className="text-xs">हस्ताक्षर:-</td>
                  </tr>
                  <tr>
                    <td className="text-xs">नाम थर:-</td>
                    <td className="text-center text-xs">
                      <strong>दायाँ</strong>
                    </td>
                    <td className="text-center text-xs">
                      <strong>बायाँ</strong>
                    </td>
                    <td className="text-xs">नाम थर:-</td>
                  </tr>
                  <tr>
                    <td className="text-xs">ठेगाना:-</td>
                    <td rowSpan={6}></td>
                    <td rowSpan={6}></td>
                    <td className="text-xs">पद:-</td>
                  </tr>
                  <tr>
                    <td className="text-xs">बीमीत र सो व्यक्ति बीचको नाता:-</td>
                    <td className="text-xs">मिति:-</td>
                  </tr>
                  <tr>
                    <td className="text-xs">मिति:-</td>
                    <td className="text-xs">कार्यालयको छाप:-</td>
                  </tr>
                  <tr>
                    <td className="text-xs">
                      <strong>साक्षी:-</strong>
                    </td>
                    <td rowSpan={3}></td>
                  </tr>
                  <tr>
                    <td className="text-xs">हस्ताक्षर-</td>
                  </tr>
                  <tr>
                    <td className="text-xs">नाम थर:-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center mt-6 text-xs">
              इति सम्बत् ....................
              साल......................महिना.....................गते:.......................रोज
              सुभम् ।
            </p>
          </div>
        </div>

        {/* Third Page - Application Form */}
        <div className="bg-gray-100 w-full max-w-6xl mx-auto p-3 mt-4 print:bg-white print:p-0 print:mt-0 page-break">
          <div className="text-sm px-6">
            <p className="text-right mt-4 font-bold">
              मिति: ........./........./.......
            </p>
            <p className="text-sm">
              श्रीमान् प्रमुख ज्यू,
              <br />
              आई.एम.ई लाइफ ईन्स्योरेन्स क.लि.
              <br />
              काठमाण्डौं ।<br />
              मार्फत शाखा कार्यालय:....................................।
            </p>
            <p className="ml-6 font-bold text-sm">
              विषयः जीवन बीमालेख नं.........................................
              समर्पण गर्ने सम्बन्धमा ।
            </p>

            <p className="text-justify text-sm">
              उपरोक्त सम्बन्धमा मेरो
              ............................................. कारण रकमको आवश्यकता
              भएको हुँदा माथि उल्लेखित बीमालेख रद्द गरि कम्पनिको नियमानुसार
              प्राप्त हुने रकम उपलब्ध गराई दिनु हुन अनुरोध गर्दछु ।<br />
              <br />
              <span className="font-bold text-sm">
                सलग्न:
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; १. सक्कल बीमालेख,
                नागरिकताको फोटोकपी र दावी फछ्यौट पुर्जा
                ..........................थान १
              </span>
            </p>
            <p className="text-justify text-sm">
              नोट: बीमालेख धितो कर्जा सुबिधाको उपयोग गरेको भए सो समेत उल्लेख
              गर्नहुन र प्राप्त हुने सम्पुर्ण कर्जा रकममा कट्टा गरिनेछ , यदि दिन
              बाकी पर्ने भए मात्र सोबाकी रकम मात्र भुक्तान गरिनेछ ।
            </p>
            <p className="text-sm">
              बीमालेख धितो राखेको
              मिति:.........................................................
              बीमालेख धितो कर्जा रकम
              रु..............................................................
            </p>

            <div className="mt-2">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-2/5"></td>
                    <td className="w-1/2 font-bold text-sm">
                      बीमित/प्रस्तावकको बैक सम्वन्धी बिवरण:
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/3"></td>
                    <td className="w-3/5 text-lg">
                      १. बैकको नाम
                      :..........................................................................................
                      <br />
                      २. बैकको शाखाको ठेगाना
                      :.....................................................................
                      <br />
                      ३. खातावालाको नाम
                      :................................................................................
                      <br />
                      ४. बैकको खाता
                      नं...................................................................................
                      <br />
                      <span className="text-xs">
                        बैक खाता नं प्रमाणित गर्नको लागि Cheque Copy वा अन्य
                        कुनै कागजात अनिवार्य पेश गर्नु पर्नेछ । यदि उल्लेखित
                        खाताको बिवरण गलत भएर यस कम्पनीलाई कुनै नोक्सानी भएमा
                        सोको जिम्मेवार ग्राहक स्वय म्रहने जानकारी गराउदछौ ।
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="-mt-20 text-sm">निवेदक,</p>
            <p className="border-t-2 border-dotted w-60 mt-8 text-sm">
              <strong>(बीमित/प्रस्तावकको हस्ताक्षर)</strong>
            </p>
            <p className="border-b-2 border-dashed pb-3 text-sm">
              नामः................................................................................................
              <br />
              मोवाईल
              नंः........................................................................................
              ईमेल
              ठेगाना.....................................................................................
            </p>
            <p className="font-bold text-center border-t-2 border-dashed pt-3 text-sm">
              कार्यालय प्रयोजनको लागि मात्र ( क्षेत्रिय/शाखा प्रमुख वा
              कर्मचारीले भर्ने)
            </p>
            <p className="text-sm">
              माथि उल्लेखित प्रस्तावक/बीमितलाई समर्पणको बिषयमा कट्टा भई
              प्राप्तहुने रकम सहित सम्पुर्ण जानकारी गराई प्रस्ताव फाराममा रहेको
              हस्ताक्षर संग एकिन गरि दावी फछ्यौट पुर्जा समेत प्राप्त भई मेरो
              अघिनमा रहेकोे हुँदा बीमालेख अन्र्तगतको समर्पण रकम उपलब्ध गराई दिनु
              हुनका लागि सिफारिस गर्दछु ।
            </p>
            <p className="text-sm">
              क्षेत्रिय/शाखा प्रमुख वा कर्मचारीको
              नाम:..................................................................
              <br />
              <br />
              हस्ताक्षर:.......................................................................
            </p>
            <div className="w-40 ml-3/4 h-24 -mt-8">
              <table className="w-full h-full">
                <tbody>
                  <tr>
                    <td className="text-center text-xs">कार्यालयको छाप</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurrenderMemoPage;
