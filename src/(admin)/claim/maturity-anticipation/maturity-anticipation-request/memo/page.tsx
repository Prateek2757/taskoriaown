"use client";
import { Button } from "@/components/ui/button";
import { Printer, FileDown, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// Types for data
interface PolicyData {
  policyNo: string;
  policyBranch: string;
  name: string;
  sumAssured: string;
  premium: string;
  product: string;
  totalPremiumPaid: string;
  mop: string;
  instalment: string;
  term: string;
  payTerm: string;
  doc: string;
  maturityDate: string;
  lastPremiumPaid: string;
  nextDueDate: string;
}

interface AnticipatedData {
  instalment: string;
  anticipatedDate: string;
  anticipatedAmount: string;
  deductedLoan: string;
  deductedInterest: string;
  netPayable: string;
}

interface InstalmentHistory {
  instalment: string;
  anticipatedDate: string;
  amount: string;
  paidDate: string;
}

export default function AnticipatedMemoWithForm() {
  const [loading, setLoading] = useState(false);
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [anticipatedData, setAnticipatedData] =
    useState<AnticipatedData | null>(null);
  const [history, setHistory] = useState<InstalmentHistory[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setPolicyData({
        policyNo: "N/A",
        policyBranch: "N/A",
        name: "N/A",
        sumAssured: "N/A",
        premium: "N/A",
        product: "N/A",
        totalPremiumPaid: "N/A",
        mop: "N/A",
        instalment: "N/A",
        term: "N/A",
        payTerm: "N/A",
        doc: "N/A",
        maturityDate: "N/A",
        lastPremiumPaid: "N/A",
        nextDueDate: "N/A",
      });

      setAnticipatedData({
        instalment: "N/A",
        anticipatedDate: "N/A",
        anticipatedAmount: "N/A",
        deductedLoan: "N/A",
        deductedInterest: "N/A",
        netPayable: "N/A",
      });

      setHistory([
        {
          instalment: "N/A",
          anticipatedDate: "N/A",
          amount: "N/A",
          paidDate: "N/A",
        },
      ]);
    }, 1000);
  }, []);

  const handlePrint = () => {
    const printStyles = `
      <style>
        @media print {
          @page { margin: 0.5in; }
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      </style>
    `;
    const styleElement = document.createElement("div");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    window.print();
    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  return (
    <div>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Export
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <FileText className="w-4 h-4" />
          PDF
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Printer size={18} />
          Print
        </Button>
      </div>

      <div className="print-content max-w-5xl mx-auto p-6 border border-gray-300 shadow-md bg-white space-y-10">
        <div>
          <div className="flex justify-between items-start mb-4">
            <Image
              src={"/images/logo-sun.png"}
              width={140}
              height={80}
              alt="Company Logo"
              className="object-contain"
            />
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold">Anticipated Memo</h1>
              <p className="text-sm">Sun Life Insurance</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4 border-b border-gray-400">
            Policy Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-300 rounded-md text-sm">
              {[
                ["Policy No", policyData?.policyNo || "N/A"],
                ["Policy Branch", policyData?.policyBranch || "N/A"],
                ["Name", policyData?.name || "N/A"],
                ["Sum Assured", policyData?.sumAssured || "N/A"],
                ["Premium", policyData?.premium || "N/A"],
                ["Product", policyData?.product || "N/A"],
                ["Total Premium Paid", policyData?.totalPremiumPaid || "N/A"],
              ].map(([label, value], idx, arr) => (
                <div
                  key={label}
                  className={`grid grid-cols-[1fr_auto_1fr] items-center p-2 ${
                    idx !== arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="text-center">:</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="border border-gray-300 rounded-md text-sm">
              {[
                ["MOP", policyData?.mop || "N/A"],
                ["Instalment", policyData?.instalment || "N/A"],
                [
                  "Term | Pay Term",
                  `${policyData?.term || "N/A"} | ${
                    policyData?.payTerm || "N/A"
                  }`,
                ],
                [
                  "DOC | Maturity Date",
                  `${policyData?.doc || "N/A"} | ${
                    policyData?.maturityDate || "N/A"
                  }`,
                ],
                [
                  "Last Premium Paid Date",
                  policyData?.lastPremiumPaid || "N/A",
                ],
                ["Next Due Date", policyData?.nextDueDate || "N/A"],
              ].map(([label, value], idx, arr) => (
                <div
                  key={label}
                  className={`grid grid-cols-[1fr_auto_1fr] items-center p-2 ${
                    idx !== arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="text-center">:</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4 border-b border-gray-400 text-center">
            Anticipated Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-300 rounded-md text-sm">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center p-2">
                <span className="font-semibold">Anticipated Instalment</span>
                <span className="text-center">:</span>
                <span className="text-right">
                  {anticipatedData?.instalment || "N/A"}
                </span>
              </div>
            </div>

            <div className="border border-gray-300 rounded-md text-sm">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center p-2">
                <span className="font-semibold">Anticipated Date</span>
                <span className="text-center">:</span>
                <span className="text-right">
                  {anticipatedData?.anticipatedDate || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm mb-4">
            It is forwarded for approval for Anticipated Amount of{" "}
            <strong>{policyData?.name || "N/A"}</strong> amounting{" "}
            <strong>NPR. {anticipatedData?.anticipatedAmount || "N/A"}</strong>.
            Anticipated Amount should be paid after adjusting loan amount &
            Interest as follows;
          </p>

          <h2 className="text-lg font-semibold mb-4 border-b border-gray-400 text-center">
            Amount & Instalment Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-300 rounded-md text-sm">
              {[
                [
                  "Anticipated Amount",
                  anticipatedData?.anticipatedAmount || "N/A",
                ],
                [
                  "Deducted Loan Amount",
                  anticipatedData?.deductedLoan || "N/A",
                ],
                [
                  "Deducted Interest",
                  anticipatedData?.deductedInterest || "N/A",
                ],
                ["Net Payable", anticipatedData?.netPayable || "N/A"],
              ].map(([label, value], idx, arr) => (
                <div
                  key={label}
                  className={`grid grid-cols-[1fr_auto_1fr] items-center p-2 ${
                    idx !== arr.length - 1 ? "border-b border-gray-300" : ""
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="text-center">:</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Right Box - Instalment History as Normal Table */}
            <div className="border border-gray-300 rounded-md text-sm overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Instalment</th>
                    <th className="border p-2">Anticipated Date</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? (
                    history.map((h, idx) => (
                      <tr key={idx}>
                        <td className="border p-2 text-center">
                          {h.instalment}
                        </td>
                        <td className="border p-2 text-center">
                          {h.anticipatedDate}
                        </td>
                        <td className="border p-2 text-right">{h.amount}</td>
                        <td className="border p-2 text-center">{h.paidDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border p-2 text-center" colSpan={4}>
                        No records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selection Section */}
          <div className="mb-6 text-sm">
            <p className="font-semibold mb-2">Please Tick One *</p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                <label>Adjustment</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                <label>PayCheque</label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm mt-12">
            <div className="text-center">
              <p>_________________________</p>
              <p>Prepared By</p>
            </div>
            <div className="text-center">
              <p>_________________________</p>
              <p>Checked By</p>
            </div>
            <div className="text-center">
              <p>_________________________</p>
              <p>Approved By</p>
            </div>
          </div>

          <p className="text-xs text-right mt-6 text-gray-600">
            Generated on {new Date().toLocaleString()} by ADMIN_USER
          </p>
        </div>

        {/* Nepali Application Form Section */}
        <div className="border-t border-gray-400 pt-6">
          <div className="flex justify-between mb-4">
            <p>मिति: ......./......./.......</p>
          </div>

          <p>श्रीमान प्रमुख ज्यू,</p>
          <p>सन लाइफ इन्स्योरेन्स कं. लि.</p>
          <p>क्षेत्रीय/शाखा/उप–शाखा कार्यालय</p>

          <p className="mt-4 font-semibold">
            विषय : धन सरिता/प्लस (वार्षिक अग्रिम भुक्तानी साच्ती) लाभ गिरिको रकम
            नकिकरणमा समायोजन गर्ने सम्बन्धमा ।
          </p>

          <p className="mt-4">
            जीवन बीमालेख नं.
            ......................................................
          </p>

          <p className="mt-4">
            महोदय, <br />
            माथे उल्लेखित लेख अनुसार म कम्पनीमा रहेको मेरो नामको बीमालेखमा
            ...... रकम नकिकरणका लागि निवेदन गर्दछु ।
          </p>

          {/* Applicant & Bank Details */}
          <div className="grid grid-cols-2 gap-8 mt-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">निवेदक</h3>
              <p>हस्ताक्षर: .......................</p>
              <p>नाम: .......................</p>
              <p>बीमालेख नं: .......................</p>
              <p>मोबाइल नं: .......................</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">बैंकको विवरण</h3>
              <p>बैंकको नाम: .......................</p>
              <p>बैंकको ठेगाना: .......................</p>
              <p>बैंकको खाता नं: .......................</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-10 border-t border-gray-400 pt-6">
            <h3 className="font-semibold mb-2">
              कार्यालय प्रयोजनको लागि सिफारिस गर्नुहुन ।
            </h3>
            <p>श्रीमान प्रमुख ज्यू</p>
            <p>केन्द्रीय कार्यालय, काठमाडौं ।</p>

            <p className="mt-4">
              बीमालेख नं.............................को
              श्री............................. लाई मञ्जुर गरिएको जानकारी
              गराइन्छ ।
            </p>

            <div className="grid grid-cols-2 gap-8 mt-6 text-sm">
              <div>
                <p>हस्ताक्षर: .......................</p>
                <p>नाम: .......................</p>
                <p>पद: .......................</p>
                <p>क्षेत्रीय/शाखा/उप–शाखा: .......................</p>
              </div>
              <div className="text-center">
                <p>कार्यालयको छाप</p>
                <div className="border w-32 h-20 mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
