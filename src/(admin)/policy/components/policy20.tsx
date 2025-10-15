const Policy20 = ({ policyBond }: { policyBond: any }) => {
	console.log("policyBond", policyBond);
	return (
		<div className="">
			<div className="border border-gray-800 mb-6">
				<table className="w-full ">
					<tbody>
						<tr className="border-b border-gray-800">
							<td rowSpan={3} className="border-r border-gray-800 p-2">
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
							<td className="p-2">
								<b>बीमा अभिकर्ताको नाम : </b> {policyBond?.agentCodeNameLocal}
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

						<tr className="border-b border-gray-800">
							<td rowSpan={3} className="border-r border-gray-800 p-2">
								<b>
									<u>बीमितको</u>
								</b>
								<br />
								<b>नाम,थर : </b> {policyBond?.insuredNameLocal}
								<br />
								<br />
								<br />
								<br />
                                <b>प्रस्तावकको </b> <br />
                                <b>नाम,थर : </b> {policyBond?.proposerNameLocal}
                                <br />
                                <b>ठेगाना : </b> {policyBond?.insuredAddressLocal}
                                <br />
                                <b>बीमित र प्रस्तावक बिचको नाता :</b> {policyBond?.relationshipLocal}
							</td>
							<td className="p-2">
								<b>बीमाङ्क रकम : </b>
								<br />
								<b>अङ्कमा : {policyBond?.premiumLocal}</b> <br />
								<b>अक्षरमा : {policyBond?.premiumInWordLocal} </b>
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमाशुल्क रकम : </b><br />
                                <b> मासिक आय सुबिधाको अतिरिक्त बीमा शुल्क: </b> {policyBond?.sumAssuredLocal} <br />
                                <b> घातक रोग सुबिधाको अतिरिक्त बीमा शुल्क:</b> {policyBond?.sumAssuredLocal} <br />
                                <b> प्रस्तावकको मृत्यु भएमा प्रदान गरिने Lump sum सुविधाको अतिरिक्त बीमा शुल्क:</b> {policyBond?.sumAssuredLocal} <br />
                                <b> दुर्घटना लाभ सुविधाको अतिरिक्त बीमाशुल्क:</b> {policyBond?.sumAssuredLocal} <br />
                                <b> Sun Medicare सुविधाको अतिरिक्त बीमा शुल्क:</b> {policyBond?.sumAssuredLocal} <br />
								<b> जम्मा बीमा शुल्क रकम:</b> {policyBond?.sumAssuredLocal} <br />
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b> बीमितको जन्म मिति : </b> {policyBond?.dateOfBirthLocal} <br />
								<b> उमेर खुल्ने प्रमाणपत्र : </b> {policyBond?.identityDocumentTypeLocal} <br />
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td  className="border-r border-gray-800 p-2">
						<b> बीमा प्रस्ताव मिति: </b> {policyBond?.dateOfCommencementLocal} <br />
							
								
							</td>
							<td className="p-2">
								<b>प्रस्तावकको जन्म मिति: </b>{policyBond?.dateOfBirthLocal} <br />
                                <b>  संलग्न उमेर खुल्ने प्रमाणपत्र : </b>{policyBond?.identityDocumentTypeLocal}
							</td>
						</tr>

  <tr  className="border-b border-gray-800">
							<td rowSpan={3} className="border-r border-gray-800 p-2">
								<b> बीमा प्रारम्भ मिति: </b>{" "}
								{policyBond?.finalPayDateLocal}
							</td>
							<td className="p-2">
								<b>  व्यक्तिगत स्वास्थ्य विरण प्राप्त मिति : </b>{" "}
								{policyBond?.finalPayDateLocal}
							</td>
						</tr>  

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b> बीमाशुल्क भुक्तानी तरका  : </b> {policyBond?.dateOfBirthLocal}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b> नविकरण बिमा शुल्क भुक्तानी गर्नुपर्ने र्मितिहरु: </b>
								{policyBond?.nextDueDateLocal}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td rowSpan={2} className="border-r border-gray-800 p-2">
								<b> बीमा सामाप्ति हुने मिति :</b> {policyBond?.dateOfCommencementLocal}
							</td>

                            <td className="p-2">
								<b>  अन्तिम बीमा शुल्क भुक्तानी गर्नुपर्ने मिति:  </b> {policyBond?.dateOfCommencementLocal}
							</td>
                             </tr>
                            <tr className="border-b border-gray-800">
                            <td className="p-2">
								<b> संलग्न पूरक करारको क्रमाङ्क: </b> {policyBond?.dateOfCommencementLocal}
							</td>
                           
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Policy20;