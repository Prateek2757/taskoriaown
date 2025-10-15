"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { commaSeparationNumber } from "@/components/utils/commaSeparationNumber";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { AddEditKycWithFileDTO } from "../../kyc/schemas/kycSchema";
import { emptyPremium, type PremiumDTO, type RiderDTO } from "../premiumSchema";
import RiderList from "./RiderList";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PremiumFormProps {
  productList: SelectOption[];
  form: any; // UseFormReturn<PremiumDTO>;
  setRiderList: Dispatch<SetStateAction<RiderDTO[]>>;
  riderList?: RiderDTO[];
  kycData?: AddEditKycWithFileDTO;
  kycLoading?: boolean;
}

interface ProductDetail {
  minimumAgeAtEntry?: string;
  maximumAgeAtEntry?: string;
  minimumSumAssured?: string;
  maximumSumAssured?: string;
  maximiumAgeAtMaturity?: string;
}

export default function PremiumForm({
  productList,
  form,
  setRiderList,
  riderList,
  kycData,
  kycLoading,
}: PremiumFormProps) {
  const [modeOfPaymentList, setModeOfPaymentList] = useState<SelectOption[]>(
    []
  );
  const [termList, setTermList] = useState<SelectOption[]>([]);
  const [payTermList, setPayTermList] = useState<SelectOption[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );
  const onlyNumbersHandler = useOnlyNumbers();

  const dateOfBirth = form.watch("dateOfBirth");
  const productCode = form.watch("productCode");
  const age = form.watch("age");
  const termValue = form.watch("term");
  const modeOfPaymentValue = form.watch("modeOfPayment");
  const sumAssuredValue = form.watch("sumAssured");
  const payTermValue = form.watch("payTerm");

  // Debounced sum assured value for validation
  const debouncedSumAssured = useDebouncedValue(sumAssuredValue, 100);

  useEffect(() => {
    if (kycData === undefined) return;
    form.setValue("dateOfBirth", kycData.dateOfBirth || "");
    form.setValue("dateOfBirthLocal", kycData.dateOfBirthLocal);
  }, [form.setValue, kycData]);

  const getProductDetail = useCallback(
    async (productCode: string) => {
      try {
        const submitData: PostCallData & {
          ProductCode: string;
        } = {
          ProductCode: productCode,
          endpoint: "proposal_required_list",
        };

        const response = await apiPostCall(submitData);

        console.log("product detail response", response);

        if (response && response.status === API_CONSTANTS.success) {
          setProductDetail(response.data.productDetail);
          form.clearErrors("age");
          form.clearErrors("sumAssured");
        } else {
          console.log("Invalid response format or failed API call");
          setProductDetail({});
        }
      } catch (error) {
        console.error("Error getting age", error);
        setProductDetail({});
      }
    },
    [form]
  );

  useEffect(() => {
    if (!productCode) {
      setProductDetail({});
      return;
    }
    if (kycLoading) return;
    if (kycData === undefined) {
      console.log("Resetting because no KYC data", kycData);
      form.setValue("sumAssured", "");
      form.clearErrors("sumAssured");
      form.setValue("term", "");
      form.setValue("modeOfPayment", "");
      form.setValue("payTerm", "");
    }
    form.setValue("ridersList", []);
    setRiderList([]);
    getProductDetail(productCode);
  }, [productCode, getProductDetail, form, kycData, kycLoading]);

  const validateAge = useCallback(
    (ageValue: string) => {
      if (!productDetail || !ageValue) return;

      const age = parseInt(ageValue);
      if (Number.isNaN(age)) {
        form.setError("age", {
          type: "manual",
          message: "Please enter a valid age",
        });
        return;
      }

      const minAge = parseInt(productDetail.minimumAgeAtEntry || "0");
      const maxAge = parseInt(productDetail.maximumAgeAtEntry || "999");

      if (age < minAge || age > maxAge) {
        form.setError("age", {
          type: "manual",
          message: `Age must be between ${minAge} and ${maxAge}`,
        });
      } else {
        form.clearErrors("age");
      }
    },
    [productDetail, form]
  );

  const getAge = useCallback(
    async (value: string) => {
      try {
        const submitData: PostCallData & {
          flag: string;
          search: string;
          extras?: string;
        } = {
          flag: "CalculateAge",
          search: value,
          extras: productCode,
          endpoint: "get_utility_result",
        };

        const response = await apiPostCall(submitData);

        if (response && response.status === API_CONSTANTS.success) {
          const calculatedAge = response.data.data.toString();
          form.setValue("age", calculatedAge);
          validateAge(calculatedAge);
        } else {
          console.log(
            `Failed to convert Date: ${
              response?.data.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error getting age", error);
      } finally {
      }
    },
    [form, validateAge, productCode]
  );

  useEffect(() => {
    if (!dateOfBirth) {
      return;
    }
    getAge(dateOfBirth);
  }, [dateOfBirth, getAge]);

  const getProposalRequiredList = useCallback(
    async (productId: string, age: string) => {
      try {
        const data: PostCallData & {
          ProductCode: string;
          InsuredDetails: {
            Age: string;
          };
        } = {
          ProductCode: productId,
          InsuredDetails: {
            Age: age,
          },

          endpoint: "proposal_required_list",
        };
        const response = await apiPostCall(data as PostCallData);
        if (response?.data && response.status === API_CONSTANTS.success) {
          form.unregister("term");
          form.unregister("payTerm");
          setTermList(response.data.termList);
          setModeOfPaymentList(response.data.modeOfPaymentList);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    },
    [form.unregister]
  );

  useEffect(() => {
    if (!productCode || !age) {
      return;
    }
    getProposalRequiredList(productCode, age);
  }, [productCode, getProposalRequiredList, age]);

  const getPayTerm = useCallback(
    async (productCode: string, age: string, TermValue: string) => {
      try {
        const data: PostCallData & {
          ProductCode: string;
          InsuredDetails: {
            Age: string;
          };
          Term: string;
        } = {
          ProductCode: productCode,
          InsuredDetails: {
            Age: age,
          },
          Term: TermValue,
          endpoint: "proposal_required_list",
        };
        const response = await apiPostCall(data as PostCallData);
        if (response?.data && response.status === API_CONSTANTS.success) {
          form.unregister("payTerm");
          setPayTermList(response.data.payTermList);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    },
    [form.unregister]
  );

  useEffect(() => {
    if (!productCode || !age || !termValue) {
      return;
    }
    getPayTerm(productCode, age, termValue);
  }, [productCode, getPayTerm, age, termValue]);

  const getRider = useCallback(
    async (
      sumAssuredValue: string,
      productCode: string,
      age: string,
      termValue: string,
      payTermValue: string
    ) => {
      try {
        const submitData: PostCallData & {
          sumAssured: string;
          ProductCode: string;
          Age: string;
          Term: string;
          PayTerm: string;
        } = {
          sumAssured: sumAssuredValue,
          ProductCode: productCode,
          Age: age,
          Term: termValue,
          PayTerm: payTermValue,
          endpoint: "get_product_wise_detail",
        };

        const response = await apiPostCall(submitData);

        console.log("product wide detail response", response);

        if (response && response.status === API_CONSTANTS.success) {
          setRiderList(response.data.riderList);
        } else {
          alert(`Failed to Get District: ${response || "Unknown error"}`);
        }
      } catch (error) {
        alert(`Error: ${error || "Failed to Get District"}`);
      } finally {
        console.log("Rider List got successfully");
      }
    },
    [setRiderList]
  );

  useEffect(() => {
    if (
      !productCode ||
      !age ||
      !termValue ||
      !payTermValue ||
      !sumAssuredValue ||
      !modeOfPaymentValue
    ) {
      return setRiderList([]);
    }
    getRider(sumAssuredValue, productCode, age, termValue, payTermValue);
  }, [
    productCode,
    age,
    termValue,
    payTermValue,
    sumAssuredValue,
    modeOfPaymentValue,
    getRider,
  ]);

  const validateSumAssured = useCallback(
    (sumAssuredValue: string) => {
      console.log("validateSumAssured called with:", sumAssuredValue);
      console.log("productDetail:", productDetail);

      if (!productDetail || !sumAssuredValue) {
        console.log("Early return - no productDetail or sumAssuredValue");
        return;
      }

      // Remove commas and trim whitespace
      let cleanValue = sumAssuredValue.replace(/,/g, "").trim();
      // If the value is exactly '.00', treat as zero
      if (cleanValue === ".00") {
        cleanValue = "0";
      }
      // If value is like 30000.00, treat as 30000
      else if (/^\d+\.00$/.test(cleanValue)) {
        cleanValue = cleanValue.split(".")[0];
      }
      console.log("cleanValue:", cleanValue);

      // Must be numeric
      if (!/^\d+$/.test(cleanValue)) {
        console.log("Setting error - not numeric");
        form.setError("sumAssured", {
          type: "manual",
          message: "Sum Assured must contain only numbers",
        });
        return;
      }

      const sumAssured = parseInt(cleanValue, 10);
      if (Number.isNaN(sumAssured)) {
        console.log("Setting error - NaN");
        form.setError("sumAssured", {
          type: "manual",
          message: "Please enter a valid sum assured amount",
        });
        return;
      }

      // Clean min/max values from product detail
      const cleanMin = (productDetail.minimumSumAssured || "0")
        .replace(/,/g, "")
        .trim();
      const cleanMax = (productDetail.maximumSumAssured || "999999999999")
        .replace(/,/g, "")
        .trim();

      const minSum = parseInt(cleanMin, 10);
      const maxSum = parseInt(cleanMax, 10);

      console.log("Validation values:", { sumAssured, minSum, maxSum });

      if (sumAssured < minSum || sumAssured > maxSum) {
        console.log("Setting error - out of range");
        form.setError("sumAssured", {
          type: "manual",
          message: `Sum Assured must be between ${minSum.toLocaleString()} and ${maxSum.toLocaleString()}`,
        });
      } else if (sumAssured % 1000 !== 0) {
        console.log("Setting error - not multiple of 1000");
        form.setError("sumAssured", {
          type: "manual",
          message: "Sum Assured must be in multiples of 1000",
        });
      } else {
        console.log("Clearing errors - all validations passed");
        form.clearErrors("sumAssured");
      }
    },
    [productDetail, form]
  );

  // Trigger validation when debounced sum assured value changes
  useEffect(() => {
    console.log("Debounced validation triggered with:", debouncedSumAssured);
    console.log("productDetail exists:", !!productDetail);

    if (debouncedSumAssured && productDetail) {
      validateSumAssured(debouncedSumAssured);
    }
  }, [debouncedSumAssured, productDetail, validateSumAssured]);

  // Also add immediate validation for real-time feedback
  useEffect(() => {
    console.log("Immediate validation triggered with:", sumAssuredValue);

    if (sumAssuredValue && productDetail) {
      // Only do basic validation immediately, leave complex validation to debounced
      const cleanValue = sumAssuredValue
        .replace(/,/g, "")
        .trim()
        .toString().spl;

      // Clear errors if field is empty
      if (!cleanValue) {
        form.clearErrors("sumAssured");
        return;
      }

      // Immediate validation for obvious errors
      if (!/^\d+$/.test(cleanValue)) {
        form.setError("sumAssured", {
          type: "manual",
          message: "Sum Assured must contain only numbers",
        });
        return;
      }

      // Let debounced validation handle the rest
    }
  }, [sumAssuredValue, productDetail, form]);

  return (
    <CardContent>
      <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="space-y-2">
            <FormSelect
              options={productList}
              form={form}
              name="productCode"
              label="Product"
              required={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 max-[1369px]:lg:grid-cols-2 gap-4 mb-6 ">
          {productCode && (
            <>
              {kycData === undefined ? (
                <DateConverter
                  form={form}
                  name="dateOfBirth"
                  labelNep="DOB in BS"
                  labelEng="DOB in AD"
                />
              ) : (
                <div className="px-3 py-2 bg-blue-50 rounded-lg border-blue-100 border-1 absolute right-0 bottom-[calc(100%+8px)]">
                  <p className="text-sm">
                    <b>Date Of Birth (BS): </b>
                    {form.getValues("dateOfBirthLocal")}
                  </p>
                  <p className="text-sm">
                    <b>Date Of Birth (AD) : </b>
                    {form.getValues("dateOfBirth")}
                  </p>
                </div>
              )}
              <div className="space-y-2 relative">
                <FormInput
                  disabled={true}
                  form={form}
                  name="age"
                  type="text"
                  placeholder="Age"
                  label="Age"
                  required={true}
                />
                {productDetail?.minimumAgeAtEntry &&
                  productDetail?.maximumAgeAtEntry && (
                    <small className="bg-blue-50 rounded-lg px-2 py-1 border-1 border-blue-100 absolute right-0 -top-2 text-gray-500 text-right">
                      Age Range:{" "}
                      <b>
                        ({productDetail.minimumAgeAtEntry} -{" "}
                        {productDetail.maximumAgeAtEntry})
                      </b>
                    </small>
                  )}
              </div>
              <div
                className={cn(
                  "space-y-2",
                  age && !form.formState.errors.age ? "" : "hidden"
                )}
              >
                <FormInput
                  form={form}
                  name="sumAssured"
                  type="text"
                  placeholder="Sum Assured"
                  label="Sum Assured"
                  required={true}
                  onKeyDown={onlyNumbersHandler}
                />
                {productDetail?.minimumSumAssured &&
                  productDetail?.maximumSumAssured && (
                    <small>
                      Min:{" "}
                      {commaSeparationNumber(productDetail.minimumSumAssured)} -
                      Max:{" "}
                      {commaSeparationNumber(productDetail.maximumSumAssured)}
                    </small>
                  )}
              </div>
              <div
                className={cn(
                  "space-y-2",
                  age && !form.formState.errors.age ? "" : "hidden"
                )}
              >
                <FormSelect
                  options={modeOfPaymentList}
                  form={form}
                  name="modeOfPayment"
                  label="Mode Of Payment"
                  required={true}
                />
              </div>
              {/* <div className="grid grid-cols-2 gap-4 mb-6"> */}
              <div
                className={cn(
                  "space-y-2 relative",
                  sumAssuredValue && !form.formState.errors.sumAssured
                    ? ""
                    : "hidden",
                  age && !form.formState.errors.age ? "" : "hidden"
                )}
              >
                {productDetail?.minimumAgeAtEntry &&
                  productDetail?.maximumAgeAtEntry && (
                    <small className="bg-blue-50 rounded-lg px-2 py-0.5 border-1 border-blue-100 absolute right-0 -top-5 text-gray-500 text-right">
                      Max Age at Maturity :{" "}
                      <b>{productDetail.maximiumAgeAtMaturity}</b>
                      <br />
                      Max Term :{" "}
                      <b className="text-red-400">
                        {productDetail.maximiumAgeAtMaturity &&
                        form.getValues("age")
                          ? parseInt(productDetail.maximiumAgeAtMaturity) -
                            parseInt(form.getValues("age") || "0")
                          : "N/A"}
                      </b>
                    </small>
                  )}
                <FormSelect
                  options={termList}
                  form={form}
                  name="term"
                  label="Term"
                />
              </div>
              <div
                className={cn(
                  "space-y-2 ",
                  sumAssuredValue && !form.formState.errors.sumAssured
                    ? ""
                    : "hidden",
                  termValue && !form.formState.errors.term ? "" : "hidden"
                )}
              >
                <FormSelect
                  options={payTermList}
                  form={form}
                  name="payTerm"
                  label="Pay Term"
                />
              </div>
              {/* </div> */}
              <div className="space-y-2"></div>
            </>
          )}
        </div>
      </div>

      <RiderList riderList={riderList} form={form} />
    </CardContent>
  );
}
