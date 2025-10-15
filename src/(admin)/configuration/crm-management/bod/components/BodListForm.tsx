"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
	BodListSchema,
	type BodListDTO,
	emptyBodList,
} from "../schemas/bodListSchema";

export default function AddBodList() {
	const form = useForm<BodListDTO>({
		resolver: zodResolver(BodListSchema),
		defaultValues: emptyBodList,
		mode: "onSubmit",
	});

	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const onSubmit = async (data: BodListDTO) => {
		setIsSubmitting(true);
		console.log("✅ Submitted:", data);
		setTimeout(() => setIsSubmitting(false), 1500);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="bg-white rounded-lg border mb-6 mt-4">
					<div className="p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-6">Manage Bod</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									BOD Type <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="bodType"
									control={form.control}
									render={({ field }) => (
										<>
											<Input {...field} placeholder="Enter BOD Type" />
											{form.formState.errors.bodType && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.bodType.message}
												</p>
											)}
										</>
									)}
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Name <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="name"
									control={form.control}
									render={({ field }) => (
										<>
											<Input {...field} placeholder="Enter Name" />
											{form.formState.errors.name && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.name.message}
												</p>
											)}
										</>
									)}
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Position <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="position"
									control={form.control}
									render={({ field }) => (
										<>
											<Input {...field} placeholder="Enter Position" />
											{form.formState.errors.position && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.position.message}
												</p>
											)}
										</>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Email <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="email"
									control={form.control}
									render={({ field }) => (
										<>
											<Input {...field} placeholder="Enter Email" />
											{form.formState.errors.email && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.email.message}
												</p>
											)}
										</>
									)}
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Phone No <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="phoneNo"
									control={form.control}
									render={({ field }) => (
										<>
											<Input {...field} placeholder="Enter Phone Number" />
											{form.formState.errors.phoneNo && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.phoneNo.message}
												</p>
											)}
										</>
									)}
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-sm text-gray-600">Sequence Order</Label>
								<Controller
									name="sequence"
									control={form.control}
									render={({ field }) => (
										<>
											<Input {...field} placeholder="Enter Sequence" />
											{form.formState.errors.sequence && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.sequence.message}
												</p>
											)}
										</>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<DateConverter
								form={form}
								name="appointedDateBS"
								labelNep="Appointed Date (BS)"
								labelEng="Appointed Date (AD)"
							/>
							<DateConverter
								form={form}
								name="reappointedDateBS"
								labelNep="Reappointed Date (BS)"
								labelEng="Reappointed Date (AD)"
							/>
							<div className="flex flex-col gap-2">
								<Label className="text-sm text-gray-600">Is Active</Label>
								<Controller
									name="isActive"
									control={form.control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Image Upload <span className="text-red-500">*</span>
								</Label>
								<FormInputFile
									form={form}
									name="image"
									fileNameField="imageName"
									accept=".png,.jpg,.jpeg,.pdf"
									maxSize={5}
									validTypes={["image/png", "image/jpeg", "application/pdf"]}
									inputClass="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
								/>
								{form.formState.errors.image && (
									<p className="text-red-500 text-sm mt-1">
										{form.formState.errors.image.message}
									</p>
								)}
							</div>

							<div className="space-y-1 md:col-span-2">
								<Label className="text-sm text-gray-600">Description</Label>
								<Controller
									name="description"
									control={form.control}
									render={({ field }) => (
										<Textarea
											{...field}
											placeholder="Enter description"
											className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white h-[100px]"
										/>
									)}
								/>
							</div>
						</div>

						<hr className="border-gray-200 mb-4" />

						<div className="flex justify-start"></div>
					</div>
				</div>
			</form>
			<div className="flex justify-start -mt-6">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
				>
					{isSubmitting ? "Processing..." : "Add BOD"}
				</Button>
			</div>
		</Form>
	);
}
