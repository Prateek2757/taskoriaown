const Policy5 = ({ policyBond }: { policyBond: any }) => {
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
							<td  className="p-2">
								<b>बीमालेख नं : </b> {policyBond?.policyNumber}
							</td>
						</tr>
						{/* <tr className="border-b border-gray-800">
							<td className="border-r border-gray-800 p-2">
								<b>बीमाशुल्क भुक्तानी अवधि :</b> {policyBond?.asfadsfasdfasdf}
							</td>
						</tr> */}

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
                                <b>बीमित र प्रस्तावक बिचको नाता :</b> {policyBond?.nomineeRelationLocal}
							</td>
							<td className="p-2">
								<b>बीमाङ्क रकम : </b> {policyBond?.premiumLocal}
								<br />
								<b>अङ्कमा : {policyBond?.premiumLocal}</b> <br />
								<b>अक्षरमा : {policyBond?.premiumInWordLocal} ।</b>
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमाशुल्क रकम : </b> {policyBond?.sumAssured} <br />
                                <b> मुल बीमालेखको बीमाशुल : </b> {policyBond?.sumAssured} <br />
                                <b>बीमाशुल्क छुट सुिवधाको अितरक्त बीमाशुल्क:</b> {policyBond?.sumAssured} <br />
                                <b> बीमाशुल्क छुट सुिवधा र मािसक आय सुिवधाको अितरक्त बीमाशुल्क :</b> {policyBond?.sumAssured} <br />
                                <b>  क्रिया खर्च सुिवधाको अितरक्त बीमाशुल्क  :</b> {policyBond?.sumAssured} <br />
                                <b>  जम्मा बीमाशुल्क रकम </b> {policyBond?.sumAssured} <br />
							</td>
						</tr>
						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b> बीिमतको जन्म िमित: </b> {policyBond?.dateOfBirth} <br />
								<b> उमेर खुल्ने प्रमाणपत्र : </b> {policyBond?.identityDocumentTypeLocal} <br />
							</td>
						</tr>
						{/* <tr className="border-b border-gray-800">
							<td className="p-2">
								<b>बीमाशुल्क भुक्तानी तरिका : </b> {policyBond?.modeOfPaymentLocal}
							</td>
						</tr> */}

						<tr className="border-b border-gray-800">
							<td  className="border-r border-gray-800 p-2">
						<b>बीमा प्रारम्भ मिति : </b> {policyBond?.dateOfCommencement} <br />
							
								
							</td>
							<td className="p-2">
								<b> प्रस्तावकको जन्म मिति: </b>{policyBond?.dateOfBirth} <br />
                                <b> संलग्न उमेर खुल्ने प्रमाणपत्र : </b>{policyBond?.identityDocumentTypeLocal}

							</td>
						</tr>

  <tr  className="border-b border-gray-800">
							<td rowSpan={3} className="border-r border-gray-800 p-2">
								<b> बीमा प्रारम्भ मिति  : </b>
								{policyBond?.finalPayDate}
<br></br>
								<b> जोखम प्रारभ हुने मिति:  : </b>
								{policyBond?.finalPayDate}
							</td>
							<td className="p-2">
								<b>  व्यक्तगत स्वास्थ्य सम्बन्धी विवरणको मिति  : </b>{" "}
								{policyBond?.finalPayDate}
							</td>
						</tr>  

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b> बीमाशुल्क भुक्तानी तरका  : </b> {policyBond?.dateOfBirth}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td className="p-2">
								<b> निवकरण िबमाशुल्क भुक्तानी गनुपन मितिहरु: </b>
								{policyBond?.nextDueDate}
							</td>
						</tr>

						<tr className="border-b border-gray-800">
							<td rowSpan={2} className="border-r border-gray-800 p-2">
								<b> बीमा सामाप्ति हुने मिति </b> {policyBond?.dateOfCommencement}
							</td>

                            <td className="p-2">
								<b>  अम बीमाशुल्क भुक्तानी गनुपन मिति :  </b> {policyBond?.dateOfCommencement}
							</td>
                             </tr>
                            <tr className="border-b border-gray-800">
                            <td className="p-2">
								<b>   संलग्न पूरक करारको क्रमाङ्क: </b> {policyBond?.dateOfCommencement}
							</td>
                           
						</tr>

						{/* <tr className="border-b border-gray-800">
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
						</tr> */}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Policy5;
