"use client";

import { FormProvider, useForm } from "react-hook-form";
import CommissionEdit from "../components/commissionEdit";



export default function Page() {
	const form = useForm<AddEditKycDTO>({
		defaultValues: {
			fatherName: "",
			fatherNameLocal: "",
			motherName: "",
			motherNameLocal: "",
			grandFatherName: "",
			grandFatherNameLocal: "",
			spouseName: "",
			spouseNameLocal: "",
		},
	});

	return (
        <FormProvider {...form}>
		<div className="min-h-screen">
			<CommissionEdit form={form} />
		</div>
		</FormProvider>
	);
}