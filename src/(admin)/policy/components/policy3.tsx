import convertToNepaliNumber from "@/components/utils/convertToNepaliNumber";

const Policy3 = ({ policyBond }: { policyBond: any }) => {
  console.log("policyBond", policyBond);
  return (
    <div className="">
      <div className="border border-gray-800 mb-6">
        <table className="w-full ">
          <tbody>
            <tr className="border-b border-gray-800">
              <td rowSpan={2} className="border-r border-gray-800 p-2">
                <b>बीमालेख कार्यालय :</b> {policyBond?.branchNameLocal}
              </td>
              <td className="p-2">
                <b>बीमा अभिकर्ता इजाजत पत्र नं : </b>{" "}
                {policyBond?.agentLicenseNumberLocal}
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>बीमा अभिकर्ता कोड नं : </b> {policyBond?.agentCodeLocal}
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="border-r border-gray-800 p-2">
                <b>बीमा अवधि :</b> {policyBond?.termLocal} 
              </td>
              <td  className="p-2">
                <b>बीमालेख नं : </b> {policyBond?.policyNumberLocal}
              </td>
            </tr>
            {/* <tr className="border-b border-gray-800">
              <td className="border-r border-gray-800 p-2">
								<b>बीमाशुल्क भुक्तानी अवधि :</b> {policyBond?.asfadsfasdfasdf}
							</td>
            </tr> */}

            <tr className="border-b border-gray-800">
              <td rowSpan={5} className="border-r border-gray-800 p-2">
                <b>बीमितको</b>
                <br />
                <b>नाम,थर : </b> {policyBond?.insuredNameLocal} <br></br>
                <b>ठेगाना : </b> {policyBond?.insuredAddressLocal}
                <br />
                <br />
                <br />
                <br />
              </td>
              <td className="p-2">
                <b>बीमा रकम (रु)</b>
                <br />
                <b>अङ्कमा : {policyBond?.premiumLocal}</b> <br></br>
                 <b>अक्षरमा : {policyBond?.premiumInWordLocal}</b>{/* maybe premium1 */}
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>बीमाशुल्क रकम : </b> {policyBond?.sumAssuredLocal}
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>बीमा प्रारम्भ मिति : </b> {policyBond?.dateOfCommencementLocal}
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>बीमा सामाप्ति हुने मिति : </b> {policyBond?.maturityDateLocal}
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>बीमाशुल्क भुक्तानी तरिका : </b>{" "}
                {policyBond?.modeOfPaymentLocal}
              </td>
            </tr>

            <tr className="border-b border-gray-800">
              <td rowSpan={6} className="border-r border-gray-800 p-2">
                <b>
                  इच्‍छाएको व्यक्तिको
                </b>
                <br />
                <b>नाम,थर : </b> {policyBond?.nomineeNameLocal}<br/>
                <b>ठेगाना : </b> {policyBond?.nomineeAddressLocal}
              </td>
              <td className="p-2">
                <b>नविकरण बिमाशुल्क भुक्तानी गर्नुपर्ने मितिहरु : </b>{" "}
                {policyBond?.nextDueDateLocal}
              </td>
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>अन्तिम बीमाशुल्क भुक्तानी गर्नुपर्ने मिति : </b>{" "}
                {policyBond?.finalPayDateLocal}
              </td>
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>बीमितको जन्म मिति : </b> {policyBond?.dateOfBirthLocal}
              </td>
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>उमेर खुल्ने प्रमाण पत्र : </b>{" "}
                {policyBond?.identityDocumentTypeLocal}
              </td>
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>प्रस्‍ताव मिति : </b> {policyBond?.dateOfCommencementLocal}
              </td>
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-2">
                <b>व्यक्तिगत स्वास्थ्य सम्बन्धी विवरणको मिति : </b>{" "}
                {policyBond?.medicalTestDateLocal}
              </td>
            </tr>
            <tr>
              <td className="border-r border-gray-800 p-2">
                <b>बीमित र इच्छाइएको व्यक्ति बीचको नाता :</b>{" "}
                {policyBond?.nomineeRelationLocal}
              </td>
              <td className="p-2">
                <b>संलन पूरक करार : </b> {policyBond?.riderNumberLocal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Policy3;
