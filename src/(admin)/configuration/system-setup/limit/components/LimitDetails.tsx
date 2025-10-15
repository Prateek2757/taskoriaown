"use client";

import React, { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";

export default function LimitDetails() {
	const form = useForm({
		defaultValues: {
			limit: "",
		},
	});

	return (
		<section className="border border-gray-200 rounded-lg p-6 mb-8 bg-white">
			<h2 className="text-xl font-bold text-gray-800 mb-6">ADD ROLE DETAILS</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<FormInput
						form={form}
						name="limit"
						type="text"
						label="Limit Name"
						placeholder="Enter Limit name"
						required
					/>
				</div>
			</div>
		</section>
	);
}
