import { useCallback } from 'react';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';

const UseDropDownList = () => {
    const getDataDropdown = useCallback(
            async (
                value: string,
                flag: string,
                setData: (data: SelectOption[]) => void,
            ) => {
                try {
                    const submitData: PostCallData & {
                        flag: string;
                        search: string;
                    } = {
                        flag: flag,
                        search: value,
                        endpoint: "get_agent_list",
                    };
    
                    const response = await apiPostCall(submitData);
                    console.log("Response from getDataDropdown:", response);
    
                    if (response && response.status === API_CONSTANTS.success) {
                        setData(response.data || []);
                    } else {
                        alert(
                            `Failed to convert Date: ${response?.data.message || "Unknown error"}`,
                        );
                    }
                } catch (error) {
                    console.error("Error getting age", error);
                    alert(`Error: ${error || "Failed to convert Date"}`);
                } finally {
                }
            },
            [],
        );
  return {
    getDataDropdown
  }
}

export default UseDropDownList
