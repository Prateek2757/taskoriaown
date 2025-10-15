import { useCallback, useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";

interface ageprops {
	form: any;
	dateOfBirth: string;
	field: string;
	extrafield?: string;
}
const useGetAge = ({ form, field, extrafield, dateOfBirth }: ageprops) => {
	const [age, setAge] = useState<string>("");
	const getAge = useCallback(
		async (value: string, extrafield?: string) => {
			try {
				const submitData: PostCallData & {
					flag: string;
					search: string;
					extras?: string;
				} = {
					flag: "CalculateAge",
					search: value,
					extras: extrafield,
					endpoint: "get_utility_result",
				};

				const response = await apiPostCall(submitData);

				if (response && response.status === API_CONSTANTS.success) {
					setAge(response.data.data.toString());
					form.setValue(
						`${field ? field : "Age"}`,
						response.data.data.toString(),
					);
				} else {
					alert(
						`Failed to convert Date: ${
							response?.data.message || "Unknown error"
						}`,
					);
				}
			} catch (error) {
				console.error("Error getting age", error);
				alert(`Error: ${error || "Failed to convert Date"}`);
			} finally {
			}
		},
		[form, field],
	);

	useEffect(() => {
		if (dateOfBirth) {
			return;
		}
		getAge(dateOfBirth, extrafield);
	}, [getAge, dateOfBirth, extrafield]);
	return {
		age,
		getAge,
	};
};

export default useGetAge;
