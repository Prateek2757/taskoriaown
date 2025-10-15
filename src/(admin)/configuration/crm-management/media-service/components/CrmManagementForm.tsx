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
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import {
	AddMediaServiceSchema,
	type AddMediaServiceDTO,
	emptyMediaService,
} from "../schemas/crmmanagementSchema";

export default function AddMediaService() {
	const form = useForm<AddMediaServiceDTO>({
		resolver: zodResolver(AddMediaServiceSchema),
		defaultValues: emptyMediaService,
		mode: "onChange",
	});

	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const onSubmit = async (data: AddMediaServiceDTO) => {
		setIsSubmitting(true);
		console.log("✅ Submitted:", data);

		setTimeout(() => setIsSubmitting(false), 1500);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="bg-white rounded-lg border mb-6 mt-4">
					<div className="p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-6">
							Manage Media Service
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Type <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="type"
									control={form.control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
												<SelectValue placeholder="Select Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="news">News</SelectItem>
												<SelectItem value="notice">Notice</SelectItem>
												<SelectItem value="slider">Slider</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								{form.formState.errors.type && (
									<p className="text-red-500 text-xs">
										{form.formState.errors.type.message}
									</p>
								)}
							</div>

							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Title <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="title"
									control={form.control}
									render={({ field }) => (
										<Input
											placeholder="Enter Title"
											className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											{...field}
										/>
									)}
								/>
								{form.formState.errors.title && (
									<p className="text-red-500 text-xs">
										{form.formState.errors.title.message}
									</p>
								)}
							</div>

							<div className="space-y-1">
								<Label className="text-sm text-gray-600">Summary</Label>
								<Controller
									name="summary"
									control={form.control}
									render={({ field }) => (
										<Input
											placeholder="Enter Summary"
											className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											{...field}
										/>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Priority <span className="text-red-500">*</span>
								</Label>
								<Controller
									name="priority"
									control={form.control}
									render={({ field }) => (
										<Input
											placeholder="Enter Priority"
											className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											{...field}
										/>
									)}
								/>
								{form.formState.errors.priority && (
									<p className="text-red-500 text-xs">
										{form.formState.errors.priority.message}
									</p>
								)}
							</div>

							<DateConverter
								form={form}
								name="date"
								labelNep="Date (BS)"
								labelEng="Date (AD)"
								required={true}
								inputClass="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="space-y-1">
								<Label className="text-sm text-gray-600">
									Media File <span className="text-red-500">*</span>
								</Label>
								<FormInputFile
									form={form}
									name="image"
									fileNameField="imageName"
									accept=".png,.jpg,.jpeg,.pdf"
									maxSize={5}
									validTypes={["image/png", "image/jpeg", "application/pdf"]}
									required
									inputClass="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

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

						<div className="space-y-1 mb-4">
							<Label className="text-sm text-gray-600">Description</Label>
							<Controller
								name="description"
								control={form.control}
								render={({ field }) => (
									<Textarea
										placeholder="Enter description"
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										{...field}
									/>
								)}
							/>
						</div>

						<hr className="border-gray-200 mb-4" />
					</div>
				</div>
			</form>

			<div className="flex justify-start -mt-6">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
				>
					{isSubmitting ? "Processing..." : "Add Media Service"}
				</Button>
			</div>
		</Form>
	);
}
