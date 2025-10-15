import React from "react";

const AdditionalInformation = ({partialPayments}: {partialPayments: any}) => {
	return (
		<div>
			<h2 className="text-lg font-semibold mb-4">Additional Information</h2>
			<div className="\ gap-4">
				<div className="bg-white rounded-lg shadow-sm border">
					<div className="p-6 gap-3">
						{/* Player Details Table */}
						<div className="bg-blue-50 rounded-lg p-4">
							<div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
								<div className="font-medium text-gray-700">Bank Name</div>
								<div className="text-gray-900">{partialPayments?.bankName}</div>

								<div className="font-medium text-gray-700">Bank Code</div>
								<div className="text-gray-900">
									{partialPayments?.bankCode || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Account Number</div>
								<div className="text-gray-900">
									{partialPayments?.bankAccountNumber || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Account Name</div>
								<div className="text-gray-900">
									{partialPayments?.bankAccountName || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Branch Code</div>
								<div className="text-gray-900">
									{partialPayments?.branchCode	 || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Gender</div>
								<div className="text-gray-900">{partialPayments?.gender || "N/A"}</div>

								<div className="font-medium text-gray-700">Father Name</div>
								<div className="text-gray-900">
									{/* Additional fields can be added here */}{" "}
									{partialPayments?.fatherName || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Mother Name</div>
								<div className="text-gray-900">
									{partialPayments?.motherName || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Citizenship Number</div>
								<div className="text-gray-900">
									{partialPayments?.citizenShipNumber || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Mobile No</div>
								<div className="text-gray-900">
									{partialPayments?.mobileNumber || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Citizenship Issue District</div>
								<div className="text-gray-900">
									{partialPayments?.citizenShipNoIssuedDistrict || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Assured Full Name</div>
								<div className="text-gray-900">
									{partialPayments?.assuredFullName || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Assured Date of Birth</div>
								<div className="text-gray-900">
									{partialPayments?.assuredDateOfBirth || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Address</div>
								<div className="text-gray-900">
									{partialPayments?.address || "N/A"}
								</div>

								<div className="font-medium text-gray-700">District Id</div>
								<div className="text-gray-900">
									{partialPayments?.districtId || "N/A"}
								</div>

								<div className="font-medium text-gray-700">Occupation Id</div>
								<div className="text-gray-900">
									{partialPayments?.occupationId || "N/A"}
								</div>

								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdditionalInformation;
