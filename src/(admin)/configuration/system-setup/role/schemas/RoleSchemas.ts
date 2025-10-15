import { z } from "zod";

export const AddRoleSchema = z.object({
  roleName: z
    .string()
    .min(1, { message: "Role name is required" }),
      dashboardPermission: z.boolean().default(false),

    microInsuranceDashboard:z.boolean().default(false),

  selectedRoles: z.array(z.string()).default([]),


  groupSetup: z.boolean().default(false),
  manageGroup: z.boolean().default(false),
  addGroup: z.boolean().default(false),
  editGroup: z.boolean().default(false),

  groupBalance: z.boolean().default(false),
  manageBalance: z.boolean().default(false),
  addBalance: z.boolean().default(false),
  editBalance: z.boolean().default(false),
  deleteBalance: z.boolean().default(false),
  approveBalance: z.boolean().default(false),

  microInsurancePermission: z.boolean().default(false),
  microInsurance: z.boolean().default(false),
  uploadPolicy: z.boolean().default(false),
  approvePolicy: z.boolean().default(false),
  issuePolicy: z.boolean().default(false),
  deleteBatch: z.boolean().default(false),
  unApprovedPolicy: z.boolean().default(false),
  allowForAgent: z.boolean().default(false),
  allowForDiffBranch: z.boolean().default(false),
  microPolicyPrint: z.boolean().default(false),
  microBusinessReport: z.boolean().default(false),
  claimReport: z.boolean().default(false),
  pendingPremiumReport: z.boolean().default(false),
  refundPremium: z.boolean().default(false),
  addRefundPremium: z.boolean().default(false),
  approveRefundPremium: z.boolean().default(false),
  accountStatement: z.boolean().default(false),
  groupInfoReport: z.boolean().default(false),
  commissionReport: z.boolean().default(false),

  microProductRate: z.boolean().default(false),
  editProductRate: z.boolean().default(false),
  productRate: z.boolean().default(false),
  addProductRate: z.boolean().default(false),

  microCommissionRate: z.boolean().default(false),
  editCommissionRate: z.boolean().default(false),
  commissionRate: z.boolean().default(false),
  addCommissionRate: z.boolean().default(false),

  //  Configuration Section 
  userPermission: z.boolean().default(false),
  addUserDirectly: z.boolean().default(false),
  editUser: z.boolean().default(false),
  user: z.boolean().default(false),
  userStatus: z.boolean().default(false),
  addUser: z.boolean().default(false),

  productGroupPermission: z.boolean().default(false),
  productGroup: z.boolean().default(false),
  editProductGroup: z.boolean().default(false),
  addProductGroup: z.boolean().default(false),

  productPermission: z.boolean().default(false),
  product: z.boolean().default(false),
  editProduct: z.boolean().default(false),
  addProduct: z.boolean().default(false),

  documentPermission: z.boolean().default(false),
  editDocument: z.boolean().default(false),
  documentManagement: z.boolean().default(false),

  rolePermission: z.boolean().default(false),
  addRole: z.boolean().default(false),
  editRole: z.boolean().default(false),
  assignRole: z.boolean().default(false),
  role: z.boolean().default(false),

  branchPermission: z.boolean().default(false),
  editBranch: z.boolean().default(false),
  addBranch: z.boolean().default(false),
  branch: z.boolean().default(false),
  editCorporateBranch: z.boolean().default(false),
  subBranch: z.boolean().default(false),

  agentPermission: z.boolean().default(false),
  addEditAgent: z.boolean().default(false),
  agentList: z.boolean().default(false),

  //  Claim Section 
  microDeathPermission: z.boolean().default(false),
  delete: z.boolean().default(false),
  forward: z.boolean().default(false),
  approve: z.boolean().default(false),
  edit: z.boolean().default(false),
  deathAllList: z.boolean().default(false),
  checkList: z.boolean().default(false),
  forwardList: z.boolean().default(false),
  recommendList: z.boolean().default(false),
  payment: z.boolean().default(false),
  microDeath: z.boolean().default(false),
  check: z.boolean().default(false),
  approvalList: z.boolean().default(false),
  recommend: z.boolean().default(false),
  paymentList: z.boolean().default(false),
  register: z.boolean().default(false),
});

export type AddRoleDTO = z.infer<typeof AddRoleSchema>;

// Schema for editing a role (adds roleId)
export const AddEditRoleSchema = AddRoleSchema.extend({
  roleId: z.string().optional().nullable(),
});

//  Type for Edit Role
export type AddEditRoleDTO = z.infer<typeof AddEditRoleSchema>;

//  Empty default role (for form initialization)
export const emptyRole: AddRoleDTO = {
  roleName: "",
  selectedRoles: [],

  // Dashboard
  dashboardPermission: false,
  microInsuranceDashboard: false,

  // Micro Insurance
  groupSetup: false,
  manageGroup: false,
  addGroup: false,
  editGroup: false,

  groupBalance: false,
  manageBalance: false,
  addBalance: false,
  editBalance: false,
  deleteBalance: false,
  approveBalance: false,

  microInsurancePermission: false,
  microInsurance: false,
  uploadPolicy: false,
  approvePolicy: false,
  issuePolicy: false,
  deleteBatch: false,
  unApprovedPolicy: false,
  allowForAgent: false,
  allowForDiffBranch: false,
  microPolicyPrint: false,
  microBusinessReport: false,
  claimReport: false,
  pendingPremiumReport: false,
  refundPremium: false,
  addRefundPremium: false,
  approveRefundPremium: false,
  accountStatement: false,
  groupInfoReport: false,
  commissionReport: false,

  microProductRate: false,
  editProductRate: false,
  productRate: false,
  addProductRate: false,

  microCommissionRate: false,
  editCommissionRate: false,
  commissionRate: false,
  addCommissionRate: false,

  // Configuration
  userPermission: false,
  addUserDirectly: false,
  editUser: false,
  user: false,
  userStatus: false,
  addUser: false,

  productGroupPermission: false,
  productGroup: false,
  editProductGroup: false,
  addProductGroup: false,

  productPermission: false,
  product: false,
  editProduct: false,
  addProduct: false,

  documentPermission: false,
  editDocument: false,
  documentManagement: false,

  rolePermission: false,
  addRole: false,
  editRole: false,
  assignRole: false,
  role: false,

  branchPermission: false,
  editBranch: false,
  addBranch: false,
  branch: false,
  editCorporateBranch: false,
  subBranch: false,

  agentPermission: false,
  addEditAgent: false,
  agentList: false,

  // Claim
  microDeathPermission: false,
  delete: false,
  forward: false,
  approve: false,
  edit: false,
  deathAllList: false,
  checkList: false,
  forwardList: false,
  recommendList: false,
  payment: false,
  microDeath: false,
  check: false,
  approvalList: false,
  recommend: false,
  paymentList: false,
  register: false,
};
