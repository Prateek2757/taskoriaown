import { z } from 'zod';

export const AddLeadSchema = z.object({
    nameOfProspect: z
        .string()
        .min(1, { message: 'Please Enter Name of Prospect' }),
    Address: z
        .string()
        .min(1, { message: 'Please Enter Prospect Address' }),
    MobileNumber: z
    .string()
    .regex(/^9/, { message: "Please Enter Valid Mobile Number" })
    .length(10, { message: "Please Enter 10 digit Mobile No" })
    .regex(/^\d+$/, { message: "Please Enter Numbers Only" }),
    purposeOfVisit: z
        .string()
        .min(1, { message: 'Please Enter Purpose of Visit' }),
    Duration: z
        .string()
        .min(1, { message: 'Please Enter Duration of Meeting' }),
    KeyPoints: z
        .string()
        .min(1, { message: 'Please Enter Key Discussion Points' }),
    Remarks: z.string().min(1, {
        message: 'Please Enter Feedback by Prospect on Product/Service',
    }),
    NextMeetingDate: z
        .string()
        .min(1, { message: 'Please Enter Next Meeting Schedule' }),
});

export type AddLeadDTO = z.infer<typeof AddLeadSchema>;

export const emptyLead = {
    nameOfProspect: '',
    Address: '',
    MobileNumber: '',
    purposeOfVisit: '',
    Duration: '',
    KeyPoints: '',
    Remarks: '',
    NextMeetingDate: '',
};


export const ViewLeadSchema = z.object({
    FromDate: z.string().min(1, { message: 'Please Enter From Date' }),
    ToDate: z.string().min(1, { message: 'Please Enter To Date' }),
});

export type ViewLeadDTO = z.infer<typeof ViewLeadSchema>;

export const emptyViewLead = {
    FromDate: '',
    ToDate: '',
};

