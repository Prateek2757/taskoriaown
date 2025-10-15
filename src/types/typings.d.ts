interface SelectOption {
	disabled: boolean;
	group: string;
	selected: boolean;
	text: string;
	value: string;
}

interface KycRequiredFields {
	branchList: SelectOption[];
	residenceStatusList: SelectOption[];
	salutationList: SelectOption[];
	genderList: SelectOption[];
	maritalStatusList: SelectOption[];
	provinceList: SelectOption[];
	districtList: SelectOption[];
	identityDocumentTypeList: SelectOption[];
	qualificationList: SelectOption[];
	professionList: SelectOption[];
	incomeModeList: SelectOption[];
	bankList: SelectOption[];
	relationShipList: SelectOption[];
	nationalityList: SelectOption[];
	religionList: SelectOption[];
}

interface ProposalRequiredFields {
	qualificationList: SelectOption[];
	maritalStatusList: SelectOption[];
	documentTypeList: SelectOption[];
	relationList: SelectOption[];
	provinceList: SelectOption[];
	genderList: SelectOption[];
}

type TableSearchTypes = {
	searchName: string;
	searchKycNumber: string;
};

interface ProposalRequiredFields {
	documentRequiredList: SelectOption[];
	genderList: SelectOption[];
	healthExtraList: SelectOption[];
	identityDocumentTypeList: SelectOption[];
	incomeModeList: SelectOption[];
	incomeSourceList: SelectOption[];
	modeOfPaymentList: SelectOption[];
	nationalityList: SelectOption[];
	occupationExtraList: SelectOption[];
	payTermList: SelectOption[];
	permanentDistrictList: SelectOption[];
	permanentMunicipalityList: SelectOption[];
	permanentProvinceList: SelectOption[];
	productList: SelectOption[];
	professionList: SelectOption[];
	qualificationList: SelectOption[];
	relationList: SelectOption[];
	salutationList: SelectOption[];
	temporaryDistrictList: SelectOption[];
	temporaryMunicipalityList: SelectOption[];
	temporaryProvinceList: SelectOption[];
	termList: SelectOption[];
}


