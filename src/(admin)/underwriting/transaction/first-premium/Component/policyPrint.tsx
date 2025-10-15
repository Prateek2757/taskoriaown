const PolicyPrint = ({ policyBond }: { policyBond: any }) => {
	console.log("policyBond", policyBond);
	return (
		<div className="">
			<div className="border border-gray-800 mb-6">
				<table className="w-full ">
					<tbody>
						<tr className="border-b border-gray-800">
							<td rowSpan={2} className="border-r border-gray-800 p-2">
								<b>बीमालेख कार्यालय :</b> {policyBond?.BranchNameLocal}
							</td>
							<td className="p-2">
								<b>बीमा अभिकर्ता इजाजत पत्र नं : </b>{" "}
								{policyBond?.agentLicenseNumber}
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमा अभिकर्ता कोड नं : </b> {policyBond?.agentCode}
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="border-r border-gray-800 p-2">
								<b>बीमा अवधि :</b> {policyBond?.term}
							</td>
							<td rowSpan={2} className="p-2">
								<b>बीमालेख नं : </b> {policyBond?.policyNumber}
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="border-r border-gray-800 p-2">
								<b>बीमाशुल्क भुक्तानी अवधि :</b> {policyBond?.asfadsfasdfasdf}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td rowSpan={4} className="border-r border-gray-800 p-2">
								<b>
									<u>बीमितको</u>
								</b>
								<br />
								<b>नाम,थर : </b> {policyBond?.insuredNameLocal}
								<br />
								<br />
								<br />
								<br />
								<b>स्‍थायी ठेगाना : </b> {policyBond?.insuredAddressLocal}
							</td>
							<td className="p-2">
								<b>बीमाङ्क रकम : </b> {policyBond?.premium}
								<br />
								<b>अङ्कमा : {policyBond?.premium}</b>
								<b>अक्षरमा : {policyBond?.premium} ।</b>
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमाशुल्क रकम : </b> {policyBond?.sumAssured}
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमा प्रारम्भ मिति : </b> {policyBond?.dateOfCommencement}
								<b>बीमा सामाप्ति हुने मिति : </b> {policyBond?.maturityDate}
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमाशुल्क भुक्तानी तरिका : </b> {policyBond?.modeOfPaymentLocal}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td rowSpan={6} className="border-r border-gray-800 p-2">
								<b>
									<u>इच्‍छाएको व्यक्तिको</u>
								</b>
								<br />
								<b>नाम,थर : </b> {policyBond?.nomineeName}
								<br />
								<br />
								<br />
								<b>ठेगाना : </b> {policyBond?.nomineeAddress}
							</td>
							<td className="p-2">
								<b>नविकरण बिमाशुल्क भुक्तानी गर्नुपर्ने मितिहरु : </b>{" "}
								{policyBond?.nextDueDate}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>अन्तिम बीमाशुल्क भुक्तानी गर्नुपर्ने मिति : </b>{" "}
								{policyBond?.finalPayDate}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमितको जन्म मिति : </b> {policyBond?.dateOfBirth}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>उमेर खुल्ने प्रमाणपत् : </b>{" "}
								{policyBond?.identityDocumentTypeLocal}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>प्रस्‍ताव मिति : </b> {policyBond?.dateOfCommencement}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>व्यक्तिगत स्वास्थ्य सम्बन्धी विवरण घोषणा मिति : </b>{" "}
								{policyBond?.medicalTestDate}
							</td>
						</tr>
						<tr>
							<td className="border-r border-gray-800 p-2">
								<b>बीिमत र इाइएको व्य बीचको नाता :</b>{" "}
								{policyBond?.nomineeRelationLocal}
							</td>
							<td className="p-2">
								<b>संलन पूरक करारः : </b> {policyBond?.riderNumber}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PolicyPrint;
