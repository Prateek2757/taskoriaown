import { z } from "zod";


export const PersonalInfoSchema = z.object({

    // agent information
    agentCode: z.string().optional().nullable(),
    agentName: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    address: z.string().optional().nullable(),

    // identification information
    citizenShipNumber: z.string().optional().nullable(),
    registrationNumber: z.string().optional().nullable(),
    policyNumber: z.string().optional().nullable(),
    clientNumber: z.string().optional().nullable(),
    kycId: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    religion: z.string().optional().nullable(),
    placeOfBirth: z.string().optional().nullable(),
    age: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),

    //family information
    fatherName: z.string().optional().nullable(),
    motherName: z.string().optional().nullable(),
    grandFatherName: z.string().optional().nullable(),
    spouseName: z.string().optional().nullable(),
    maritalStatus: z.string().optional().nullable(),

    // location
    permanentProvince: z.string().optional().nullable(),
    permanentDistrict: z.string().optional().nullable(),
    permanentMunicipality: z.string().optional().nullable(),


    //Company status or information
    branch: z.string().optional().nullable(),
    profession: z.string().optional().nullable(),
    qualification: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    incomeAmount: z.string().optional().nullable(),
    companyAddress: z.string().optional().nullable(),
    panNo: z.string().optional().nullable(),
    citNo: z.string().optional().nullable(),

    //bank details
    bankName:z.string().optional().nullable(),
    bankBranchCode:z.string().optional().nullable(),
    bankAccountNumber:z.string().optional().nullable(),

    //landlord details
    landLordName: z.string().optional().nullable(),
	landLordAddress: z.string().optional().nullable(),
	landLordContactNumber: z.string().optional().nullable(),

});


export type PersonalInformation = z.infer<typeof PersonalInfoSchema>;


export const PremiumInformation = z.object(
    {
        
    }
)