const Policy18 = ({ policyBond }: { policyBond: any }) => {
    console.log("policyBond", policyBond);
    return (
       <div className="policy-bond-container">
    <div className="border border-gray-800 mb-6">
        <table className="w-full">
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

                        {/* Row 2: बीमा अवधि and बीमालेख नं */}
                        <tr className="border-b border-gray-800">
                            <td className="border-r border-gray-800 p-2">
                                <b>बीमा अवधि :</b> {policyBond?.termLocal}
                            </td>
                            <td className="p-2">
                                <b>बीमालेख नं :</b> {policyBond?.policyNumberLocal}
                            </td>
                        </tr>

                        {/* Row 3: बीमितको  and बीमाङ्क रकम */}
                        <tr className="border-b border-gray-800">
                            <td rowSpan={3} className="border-r border-gray-800 p-2">
                                <b><u>बीमितको</u></b>
                                <br />
                                <b>नाम,थर :</b> {policyBond?.insuredNameLocal}
                                <br /><br />
                                <b>स्थायी ठेगाना :</b> {policyBond?.insuredAddressLocal}
                            </td>
                            <td className="p-2">
                                <b>बीमाङ्क रकम:</b>
                                <br />
                                <b>अङ्कमा :</b> {policyBond?.sumAssuredLocal}
                                <br />
                                <b>अक्षरमा :</b> {policyBond?.sumAssuredInWordsLocal}
                            </td>
                        </tr>

                        {/* Row 4: */}
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमाशुल्क रकम:</b> {policyBond?.premiumLocal}
                                <br />
                                <b>बीमा प्रारम्भ मिति :</b> {policyBond?.dateOfCommencementLocal}
                                <br />
                                <b>बीमा समाप्ति हुने मिति :</b> {policyBond?.maturityDateLocal}
                                <br />
                                <b>बीमाशुल्क भुक्तानी तरिका :</b> {policyBond?.premiumFrequencyLocal}
                                <br />
                                <b>प्रथम बीमाशुल्क भुक्तानी मिति :</b> {policyBond?.firstPremiumDateLocal}
                                <br />
                                <b>रसिद नं :</b> {policyBond?.receiptNumberLocal}
                            </td>
                        </tr>

                        {/* Row 5: */}
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमाशुल्क भुक्तानी अवधि :</b> {policyBond?.paymentTermLocal}
                                <br />
                                <b>नविकरण बीमाशुल्क भुक्तानी गर्नुपर्ने मिति :</b> {policyBond?.renewalDateLocal}
                            </td>
                        </tr>

                        {/* Row 6: इच्छाएको व्यक्तिको*/}
                        <tr className="border-b border-gray-800">
                            <td rowSpan={4} className="border-r border-gray-800 p-2">
                                <b><u>इच्छाएको व्यक्तिको</u></b>
                                <br />
                                <b>नाम,थर :</b> {policyBond?.nomineeNameLocal}
                                <br /><br />
                                <b>ठेगाना :</b> {policyBond?.nomineeAddressLocal}
                                <br /><br />
                                <b>इच्छाएको व्यक्तिको माता/पिताको नाम :</b> {policyBond?.nomineeParentNameLocal}
                                <br /><br />
                                <b>बीमित र इच्छाएको व्यक्तिको बीचको नाता :</b> {policyBond?.relationshipWithNomineeLocal}
                            </td>
                            <td className="p-2">
                                <b>अन्तिम बीमाशुल्क भुक्तानी गर्नुपर्ने मिति :</b> {policyBond?.finalPremiumDateLocal}
                            </td>
                        </tr>

                        {/* Row 7: बीमितको जन्म मिति */}
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमितको जन्म मिति :</b> {policyBond?.dateOfBirthLocal}
                            </td>
                        </tr>

                        {/* Row 8: उमेर खुल्ने प्रमाणपत्र */}
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>उमेर खुल्ने प्रमाणपत्र :</b> {policyBond?.identityDocumentTypeLocal}
                            </td>
                        </tr>

                        {/* Row 9: प्रस्ताव मिति and व्यक्तिगत स्वास्थ्य सम्बन्धी विवरण घोषणा मिति */}
                        <tr>
                            <td className="p-2">
                                <b>प्रस्ताव मिति :</b> {policyBond?.proposalDateLocal}
                                <br />
                                <b>व्यक्तिगत स्वास्थ्य सम्बन्धी विवरण घोषणा मिति :</b> {policyBond?.healthDeclarationDateLocal}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-left mt-4">
                {policyBond?.documentDateLocal}
            </div>
        </div>
    );
};

export default Policy18;