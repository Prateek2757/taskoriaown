import  { useState } from 'react'

const Usevalidation = () => {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const getAllValidationErrors = (errors: any): string[] => {
		const errorMessages: string[] = [];

		const extractErrors = (obj: any, prefix = "") => {
			Object.keys(obj).forEach((key) => {
				const value = obj[key];
				const fieldPath = prefix ? `${prefix}.${key}` : key;

				if (value?.message) {
					const readableField = fieldPath
						.replace(/([A-Z])/g, " $1")
						.replace(/^./, (str) => str.toUpperCase())
						.replace(/\./g, " - ");
					errorMessages.push(`${readableField}: ${value.message}`);
				} else if (typeof value === "object" && value !== null) {
					extractErrors(value, fieldPath);
				}
			});
		};

		extractErrors(errors);
		return errorMessages;
	};
	const onInvalid = (errors: any) => {
		console.log("Form validation errors:", errors);
		const errorMessages = getAllValidationErrors(errors);
		setValidationErrors(errorMessages);

		window.scrollTo({ top: 0, behavior: "smooth" });
	};
  return {
    onInvalid,
    validationErrors
  }

}

export default Usevalidation
