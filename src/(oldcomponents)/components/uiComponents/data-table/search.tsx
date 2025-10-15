import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Search, X } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";

export type TableSearchOptions = {
	name: string;
	placeholder: string;
	type?: string;
};

interface SearchFormProps {
	searchOptions: TableSearchOptions[];
	onSearch: (searchData: Record<string, any>) => void;
	onReset: () => void;
	isLoading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
	searchOptions,
	onSearch,
	onReset,
	isLoading = false,
}) => {
	const form = useForm({
		defaultValues: searchOptions.reduce(
			(acc, option) => {
				acc[option.name] = "";
				return acc;
			},
			{} as Record<string, string>,
		),
	});

	const { watch, handleSubmit, reset } = form;

	const watchedValues = watch();

	const onSubmit = (data: Record<string, any>) => {
		onSearch(data);
	};

	const handleReset = () => {
		reset();
		onReset();
	};

	return (
		<div className="flex items-center gap-3 flex-wrap">
			<Form {...form}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex items-center gap-3 flex-wrap"
				>
					{searchOptions?.map((searchOption) => (
						<div key={searchOption.name} className="min-w-[200px]">
							<FormInput
								form={form}
								name={searchOption.name}
								type={searchOption.type || "text"}
								placeholder={searchOption.placeholder}
								label=""
								disabled={isLoading}
							/>
						</div>
					))}

					<div className="flex gap-2">
						<Button
							type="submit"
							variant="outline"
							size="sm"
							disabled={isLoading}
							className="flex items-center gap-2"
						>
							<Search size={16} />
							Search
						</Button>

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleReset}
							disabled={isLoading}
							className="flex items-center gap-2"
						>
							<X size={16} />
							Reset
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
