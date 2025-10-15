import { z } from 'zod';

export const AddTargetSchema = z.object({
    NoOfNewAgent: z
        .string()
        .min(1, { message: 'Please Enter No of New Agent' }),
    FPIPolicyCount: z
        .string()
        .min(1, { message: 'Please Enter FPI Policy Count' }),
    FPIPreimum: z.string().min(1, { message: 'Please Enter FPI Premium' }),
    TermPolicyCount: z
        .string()
        .min(1, { message: 'Please Enter Term Policy Count' }),
    TermPreimum: z.string().min(1, { message: 'Please Enter Term Premium' }),
    TermPolicyCountIndividual: z
        .string()
        .min(1, { message: 'Please Enter Term Policy Count Individual' }),
    TermPreimumIndividual: z
        .string()
        .min(1, { message: 'Please Enter Term Premium Individual' }),
    RPIPolicyCount: z
        .string()
        .min(1, { message: 'Please Enter RPI Policy Count' }),
    RPIPreimum: z.string().min(1, { message: 'Please Enter RPI Premium' }),
    NoOfAMCreation: z
        .string()
        .min(1, { message: 'Please Enter No of MM Creation' }),
    NoOfClubAchiever: z
        .string()
        .min(1, { message: 'Please Enter No of Club Achiever' }),
    MOUWithCooperatives: z
        .string()
        .min(1, { message: 'Please Enter MOU with Cooperatives' }),
    Remarks: z.string().min(1, { message: 'Please Enter Remarks' }),
});

export type AddTargetDTO = z.infer<typeof AddTargetSchema>;

export const emptyTarget = {
    NoOfNewAgent: '',
    FPIPolicyCount: '',
    FPIPreimum: '',
    TermPolicyCount: '',
    TermPreimum: '',
    TermPolicyCountIndividual: '',
    TermPreimumIndividual: '',
    RPIPolicyCount: '',
    RPIPreimum: '',
    NoOfAMCreation: '',
    NoOfClubAchiever: '',
    MOUWithCooperatives: '',
    Remarks: '',
};



