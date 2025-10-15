export const API_BASE_URL = process.env.BASE_URL;

export const API_ENDPOINTS = {
  login: "OnlineUsers/Login",
  user_token: "Auth/GenerateUserToken",
  login_user: "auth/token",

  //Role
  role_list: "Role/RoleList",
  role_required_fields: "Role/AvailableRoleLists",
  role_add: "Role/AddRole",
  role_edit: "Role/EditRole",
  role_details: "Role/GetRoleDetails",
  // application_user
  application_user_required_fields: "ApplicationUsers/GetRequiredDetails",
  application_user_list: "ApplicationUsers/UserList",
  application_user_add: "ApplicationUsers/AddUser",
  application_user_update: "ApplicationUsers/UpdateUser",
  application_user_details: "ApplicationUsers/GetUserDetails",

  // Kyc
  kyc_list: "kyc/kyclist",
  kyc_detail: "kyc/GetKYCDetails",
  kyc_view: "kyc/ViewKYCDetails",
  kyc_add: "kyc/ManageKYC",
  kyc_required_fields: "kyc/GetKYCRequiredList",
  kyc_getverifydata: "kyc/GetKYCDetailsToVerify",
  kyc_verify: "kyc/VerifyKYC",

  //Endorsement
  endorsement_list: "kyc/kycEndorsementlist",
  endorsement_detail: "kyc/GetKYCEndorsementDetails",
  endorsement_getverifydata: "kyc/GetKYCEndorsementDetailsToVerify",
  endorsement_verify: "kyc/VerifyKYCEndorsement",
  endorsement_view: "kyc/ViewKYCEndorsementDetails",
  endorsement_add: "kyc/ManageKYCEndorsement",
  endorsement_update: "kyc/ManageKYCEndorsement",
  forward_endorsement_to_verify: "kyc/GetForwardKYCEndorsementDetails",
  forward_endorsement_detail: "kyc/ForwardKYCEndorsement",

  // Register
  generate_otp: "Authentication/GenerateOTP",
  verify_otp: "Authentication/VerifyOTP",
  register: "OnlineUsers/Register",

  // Forgot Password
  generate_otp_forgot_password: "OnlineUsers/ForgotPassword",
  verify_otp_forgot_password: "OnlineUsers/VerifyForgotPassword",
  change_password: "OnlineUsers/ChangePassword",

  //Branch
  branch_list: "branch/GridList",
  branch_sub_list: "branch/SubGridList",
  branch_add: "branch/Manage",
  branch_detail: "branch/GetUpdateDetail",
  // Proposal
  proposal_list: "Proposal/ProposalList",
  proposal_detail: "Proposal/GetProposalDetails",
  proposal_view: "Proposal/ViewProposalDetails",
  proposal_CheckMedicalReportStatus: "Proposal/CheckMedicalReportStatus",
  proposal_bmi: "Proposal/CalculateBMI",
  // Online Proposal
  online_proposal_list: "Proposal/OnlineProposalList",
  online_proposal_detail: "Proposal/GetOnlineProposalDetails",
  online_proposal_view: "Proposal/ViewOnlineProposalDetails",
  online_proposal_add: "Proposal/ManageOnlineProposal",

  proposal_required_fields: "Proposal/GetOnlineRequiredList",
  proposal_required_list: "Proposal/GetRequiredList",
  proposal_verify: "Proposal/Approve",
  proposal_decline_remarks: "Proposal/Decline",

  get_product_wise_detail: "Proposal/GetProductWiseDetailsList",

  // Payment
  checkout: "Proposal/ESEWACheckOut",
  payment_success: "Proposal/PaymentSuccess",
  payment_failure: "Proposal/PaymentFailure",

  //ConnectIPS payment
  connectips_checkout: "Proposal/NCHLCheckOut",
  connectips_payment_success: "Proposal/NCHLPaymentSuccess",
  connectips_payment_failure: "Proposal/NCHLPaymentFailure",

  // Policy
  policy_list: "Policy/GetOnlinePolicyList",
  policy_detail: "Policy/GetOnlinePolicyDetails",
  policy_paper: "Policy/GetOnlinePolicyPaperDetails",
  policy_receipt: "Policy/GetOnlineReceiptDetails",
  generate_policy: "Proposal/GenerateOnlinePolicy",
  PolicyBond_getdetail: "Policy/GetPolicyBondDetails",

  // Verify
  check_client_id: "kyc/CheckClientId",

  // Generate Referral link
  generate_referral_link: "Proposal/GetReferralLink",

  // Target
  target_add: "StaffManagement/PostTargetDetails",
  get_target_details: "StaffManagement/AchievementOfTheDay",
  lead_add: "StaffManagement/DERDataPost",
  lead_view_data: "StaffManagement/DERReport",

  // Premium
  premium_calculation: "Proposal/PremiumCalculation",

  // Underwriting
  post_underwritting_form: "Proposal/ManageProposal",

  // agent
  get_agent_list: "Utility/GetSelectDropDown",

  // First Premium
  get_first_premium: "PremiumCollection/GetFirstPremiumDetails",
  add_payfirstPremium: "PremiumCollection/PayFirstPremium",
  FPIReceipt_getdetail: "PremiumCollection/GetFPIReceiptDetails",

  // Surrender list
  surrender_list: "Surrender/GridList",
  surrender_delete: "Surrender/Delete",
  surrender_add: "Surrender/Manage",
  surrender_registration_details: "Surrender/GetRegistrationDetail",
  surrender_calculation: "Surrender/Calculation",
  surrender_details_edit: "Surrender/GetDetailsToEdit",
  surrender_forward: "Surrender/Forward",
  surrender_memo: "Surrender/GenerateMemo",

  //Account secton
  leager_setup: "LedgerSetup/GetCOAList",
  ledger_list: "LedgerSetup/GetLedgerList",
  ledger_add: "LedgerSetup/AddLedger",
  ledger_details: "LedgerSetup/GetLedgerRequiredDetails",
  check_medical: "Proposal/CheckMedicalCriteria",

  // Utility
  get_utility_dropdown: "Utility/GetSelectDropDown",
  get_utility_result: "Utility/GetResult",

  // Voucher
  voucher_list: "VoucherManagement/GetVoucherGridList",
  voucher_detail: "VoucherManagement/GetVoucherDetails",
  voucher_view: "Voucher/ViewVoucherDetails",
  voucher_add: "VoucherManagement/VoucherInsert",
  voucher_required_list: "VoucherManagement/voucherRequiredList",
  voucher_update: "VoucherManagement/VoucherUpdate",
  voucher_approve: "VoucherManagement/ApproveVoucher",

  // Department
  department_list: "department/gridlist",
  department_manage: "department/manage",
  department_detail: "department/getdetail",

  // Doctor
  doctor_list: "doctor/getgridlist",
  doctor_manage: "doctor/manage",
  doctor_detail: "doctor/getdetails",

  // Marketing Staff
  marketingstaff_list: "marketingstaff/getgridlist",
  marketingstaff_manage: "marketingstaff/manage",
  marketingstaff_detail: "marketingstaff/getdetails",

  // Email SMS
  emailsms_list: "emailsms/getgridlist",
  emailsms_manage: "emailsms/manage",
  emailsms_detail: "emailsms/getdetails",

  // Province
  province_list: "province/gridlist",
  province_manage: "province/manage",
  province_detail: "province/getdetail",

  // District
  district_list: "district/gridlist",
  district_required_fields: "district/GetRequiredDetails",
  district_manage: "district/manage",
  district_detail: "district/getdetail",

  // Municipality
  municipality_list: "Municipality/GridList",
  municipality_required_fields: "Municipality/GetRequiredDetails",
  municipality_details: "Municipality/GetDetail",
  municipality_add: "Municipality/Manage",

  // Product Group
  productgroup_list: "productgroup/gridlist",
  productgroup_manage: "productgroup/manage",
  productgroup_detail: "productgroup/getdetails",

  // Kyc List
  kyclink_list: "kyc/GridList",
  kyclink_manage: "kyc/ManageKYCLink",
  kyclink_detail: "kyc/GetKYCLinkDetails",
  kyclink_detail_id: "kyc/GetKYCLinkDetailById",
  kyclink_approve: "kyc/ApproveLinkData",
  kyclink_decline: "kyc/DeclineKYCLink",

  // Rider Criteria
  ridercriteria_list: "ridercriteria/gridlist",
  ridercriteria_manage: "ridercriteria/manage",
  ridercriteria_details: "ridercriteria/getdetail",
  ridercriteria_required_fields: "ridercriteria/getrequireddetails",

  //rider type
  ridertype_list: "ridertype/getgridlist",
  ridertype_manage: "ridertype/manage",
  ridertype_details: "ridertype/getdetails",

  //Scheme Waive
  schemewaive_list: "schemewaive/gridlist",
  schemewaive_manage: "schemewaive/manage",
  schemewaive_details: "schemewaive/getdetails",
  schemewaive_required_fields: "schemewaive/getrequireddetails",

  // Document Management
  documentmanagement_list: "DocManagement/GetDocDetailsLists",
  // documentmanagement_list: 'DocManagement/GetDocDetailsLists'
  documentmanagement_requiredlist: "DocManagement/GetRequiredDetails",
};

export const getApiUrl = (
  endpoint: keyof typeof API_ENDPOINTS,
  params?: Record<string, string>
): string => {
  let queryString = "";
  if (params) {
    queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `${API_BASE_URL}/api/${API_ENDPOINTS[endpoint]}?${queryString}`;
  }
  return `${API_BASE_URL}/api/${API_ENDPOINTS[endpoint]}`;
};
