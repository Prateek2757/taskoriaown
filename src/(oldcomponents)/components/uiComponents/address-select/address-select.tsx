import FormCombo from "@/components/formElements/FormCombo";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";

type AddressSelectProps<T extends NonNullable<FieldValues>> = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<T>;
	pName: Path<T>;
	mName: Path<T>;
	dName: Path<T>;
};

function AddressSelect<T extends FieldValues>({
	form,
	kycRequiredFields,
	pName,
	dName,
	mName,
}: AddressSelectProps<T>) {
	const pathname = usePathname();
	// Get the locale from the URL path (e.g., /en/page -> 'en')
	const locale = (pathname?.split("/")?.[1] || "en") as "en" | "ne";
	const isLoggedIn = useSession().status === "authenticated";

	const [districtList, setDistrictList] = useState<SelectOption[]>([]);
	const [municipalityList, setMunicipalityList] = useState<SelectOption[]>([]);
  const [provinceLoaded, setProvinceLoaded] = useState(false);
  const [districtLoaded, setDistrictLoaded] = useState(false);

	const formTyped = form as UseFormReturn<FieldValues>;
const provinceName = form.watch(pName);
  const districtName = form.watch(dName);
const getDistrict = useCallback(
  async (provinceValue: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
        extra: string;
      } = {
        flag: "DistrictAutoComplete",
        search: "",
        extra: provinceValue,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData, isLoggedIn);

      if (response?.status === API_CONSTANTS.success) {
        setDistrictList(response.data);
      } else {
        alert(`Failed to get District: ${response?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error fetching District: ${String(error)}`);
    } finally {
      console.log("District fetched successfully");
    }
  },
  [isLoggedIn]
);

const getMunicipality = useCallback(
  async (districtValue: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
        extra: string;
      } = {
        flag: "MunicipalityAutoComplete",
        search: "",
        extra: districtValue,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData, isLoggedIn);

      if (response?.status === API_CONSTANTS.success) {
        setMunicipalityList(response.data);
      } else {
        alert(`Failed to get Municipality: ${response?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error fetching Municipality: ${String(error)}`);
    } finally {
      console.log("Municipality fetched successfully");
    }
  },
  [isLoggedIn]
);


useEffect(() => {
  
    // First load, don't clear existing values, just fetch districts
    if (provinceName) {
      getDistrict(provinceName);
    }

     if (provinceLoaded) {
      form.setValue(dName, "");
      form.setValue(mName, "");
      setDistrictList([]);
      setMunicipalityList([]);
    } else {
      setProvinceLoaded(true);
    }
  }, [provinceName]);

 useEffect(() => {
    if (districtName) {
      getMunicipality(districtName);
    }

    if (districtLoaded) {
      form.setValue(mName, "");
      setMunicipalityList([]);
    } else {
      setDistrictLoaded(true);
    }
  }, [districtName]);



	return (
		<>
			<div className="space-y-2">
				<FormCombo
					form={formTyped}
					name={pName}
					language={locale}
					options={kycRequiredFields?.provinceList}
					label={locale === "ne" ? "प्रान्त " : "Province "}
					required={true}
				/>
			</div>

			<div className="space-y-2">
				<FormCombo
					form={formTyped}
					language={locale}
					name={dName}
					options={districtList}
					label={locale === "ne" ? "जिल्ला " : "District "}
					required={true}
				/>
			</div>

			<div className="space-y-2">
				<FormCombo
					form={formTyped}
					language={locale}
					name={mName}
					options={municipalityList}
					label={locale === "ne" ? "नगरपालिका " : "Municipality "}
					required={true}
				/>
			</div>
		</>
	);
}

export default AddressSelect;
