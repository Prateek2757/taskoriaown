const Policy19 = ({ policyBond }: { policyBond: any }) => {
    console.log("policyBond", policyBond);
    return (
        <div className="policy-bond-container">
            <div className="border border-gray-800 mb-6">
                <table className="w-full">
                    <tbody>
                       
                        <tr className="border-b border-gray-800">
                            <td className="border-r border-gray-800 p-2" rowSpan={2}>
                                <b>बीमालेख कार्यालय :</b> {policyBond?.branchNameLocal}
                            </td>
                            <td className="p-2 border-b border-gray-800">
                                <b>बीमा अभिकर्ता इजाजत पत्र नं :</b> {policyBond?.agentLicenseNumberLocal}
                            </td>
                        </tr>
                       
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमा अभिकर्ता कोड नं :</b> {policyBond?.agentCodeLocal}
                            </td>
                        </tr>

                        
                        <tr className="border-b border-gray-800">
                           
                            <td className="border-r border-gray-800 p-0">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-800">
                                            <td className="p-2">
                                                <b>बीमा अवधि :</b> {policyBond?.termLocal}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-2">
                                                <b>बीमाशुल्क भुक्तानी अवधि :</b> {policyBond?.paymentTermLocal}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                          
                            <td className="p-2">
                                <b>बीमालेख नं :</b> {policyBond?.policyNumber}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            
                            <td className="border-r border-gray-800 p-2" rowSpan={8}>
                                <strong><u>बीमितको</u></strong><br />
                                <b>नाम,थर :</b> {policyBond?.insuredNameLocal }<br /><br />
                                <b>स्थायी ठेगाना :</b> {policyBond?.insuredAddressLocal }
                            </td>
                            <td className="p-2">
                                <b>बीमाङ्क रकम:</b><br />
                                <b>अङ्कमा :</b> {policyBond?.sumAssuredLocal}<br />
                                <b>अक्षरमा :</b> {policyBond?.sumAssuredInWordsLocal}
                            </td>
                        </tr>

                   
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमाशुल्क रकम :</b> {policyBond?.premiumAmountLocal}<br />
                            </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमा प्रारम्भ मिति :</b> {policyBond?.dateOfCommencementLocal}<br />
                            </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमा समाप्ति हुने मिति :</b> {policyBond?.maturityDateLocal}<br />
                            </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>बीमाशुल्क भुक्तानी तरिका :</b> {policyBond?.modeOfPaymentLocal}<br />
                            </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>नविकरण बीमाशुल्क भुक्तानी गर्नुपर्ने मिति :</b> {policyBond?.renewalDateLocal}<br />
                            </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>प्रथम बीमाशुल्क भुक्तानी मिति :</b> {policyBond?.firstPremiumDateLocal}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                            <td className="p-2">
                                <b>रसिद नं :</b> {policyBond?.receiptNumberLocal}
                            </td>
                        </tr>

                       
                        <tr className="border-b border-gray-800">
                            
                            <td className="border-r border-gray-800 p-2" rowSpan={4}>
                                <b><u>इच्छाएको व्यक्तिको</u></b><br />
                                <b>नाम,थर :</b> {policyBond?.nomineeNameLocal}<br /><br />
                                <b>ठेगाना :</b> {policyBond?.nomineeAddressLocal}<br /><br />
                                <b>इच्छाएको व्यक्तिको माता/पिताको नाम :</b> {policyBond?.nomineeParentNameLocal}<br /><br />
                                <b>बीमित र इच्छाएको व्यक्तिको बीचको नाता :</b> {policyBond?.nomineeRelationLocal}
                            </td>
                            
                            <td className="p-0">
                                <table className="w-full">
                                    <tbody>
                                       
                                        <tr className="border-b border-gray-800">
                                            <td className="p-2">
                                                <b>अन्तिम बीमाशुल्क भुक्तानी गर्नुपर्ने मिति :</b> {policyBond?.finalPaymentDateLocal}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="p-2">
                                                <b>बीमितको जन्म मिति :</b> {policyBond?.dateOfBirthLocal}<br />
                                                <b>उमेर खुल्ने प्रमाणपत्र :</b> {policyBond?.identityDocumentLocal}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <td className="p-2">
                                                <b>प्रस्ताव मिति :</b> {policyBond?.proposalDateLocal}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-2">
                                                <b>व्यक्तिगत स्वास्थ्य सम्बन्धी विवरण घोषणा मिति :</b> {policyBond?.medicalDeclarationDateLocal}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className="border border-gray-800 p-2">
                                <b>संलग्न पूरक करारको क्रमांक :</b> {policyBond?.confirmationAmountLocal}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            
            <div className="mt-4 text-sm">
                ५/११/२०२५ १२:००:०० AM
            </div>
        </div>
    );
};

export default Policy19;