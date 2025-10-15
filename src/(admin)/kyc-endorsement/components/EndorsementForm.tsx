"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import AddressDetails from "@/app/(admin)/kyc/components/KycTab/AddressDetails";
import DocumentDetails from "@/app/(admin)/kyc/components/KycTab/DocumentDetails";
import FamilyDetails from "@/app/(admin)/kyc/components/KycTab/FamilyDetails";
import GeneralDetails from "@/app/(admin)/kyc/components/KycTab/GeneralDetails";
import IdentificationDetails from "@/app/(admin)/kyc/components/KycTab/IdentificationDetails";
import LandlordDetails from "@/app/(admin)/kyc/components/KycTab/LandlordDetails";
import PersonalDetails from "@/app/(admin)/kyc/components/KycTab/PersonalDetails";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import {
  type AddEditKycDTO,
  AddEditKycSchema,
  type AddKycDTO,
  emptyKyc,
} from "../../kyc/schemas/kycSchema";
import { EndorsementProps } from "./EndorsementProps";
// Define field groups for each step
const stepFieldGroups: Record<number, (keyof AddEditKycDTO)[]> = {
  0: [
    // Personal Details
    "age",
    "firstName",
    "lastName",
    "middleName",
    "dateOfBirth",
    "dateOfBirthLocal",
    "gender",
    "mobileNumber",
  ],
  1: [
    // Personal Details
    "branchCode",
    "age",
    "firstName",
    "lastName",
    "middleName",
    "nameLocal",
    "salutation",
    "dateOfBirth",
    "dateOfBirthLocal",
    "gender",
    "birthPlace",
    "maritalStatus",
    "nationality",
    "residenceStatus",
    "religion",
    "mobileNumber",
    "email",
    "landLineNumber",
    "foreignPhone",
  ],
  2: [
    // Address Details
    "permanentProvince",
    "permanentDistrict",
    "permanentMunicipality",
    "permanentStreetName",
    "permanentStreetNameLocal",
    "permanentHouseNumber",
    "permanentWardNumber",
    "permanentLocation",
    "temporaryProvince",
    "temporaryDistrict",
    "temporaryMunicipality",
    "temporaryStreetName",
    "temporaryStreetNameLocal",
    "temporaryHouseNumber",
    "temporaryWardNumber",
    "temporaryLocation",
    "samePermanentandTemporaryAddress",
    "foreignAddress",
  ],
  3: [
    // Identification Details
    "citizenShipNumber",
    "citizenShipNumberIssuedDistrict",
    "citizenShipNumberIssuedDate",
    "citizenShipNumberIssuedDateLocal",
    "identityDocumentType",
    "identityDocumentNumber",
    "identityDocumentIssuedDate",
    "identityDocumentIssuedDateLocal",
    "identityDocumentIssuedDistrict",
    "nationalIdentityNumber",
    "panNumber",
    "citNumber",
    "pfNumber",
    "ssfNumber",
    "qualification",
    "profession",
    "companyName",
    "companyAddress",
    "incomeAmount",
    "incomeMode",
    "bankName",
    "bankAccountName",
    "bankBranchCode",
    "bankAccountNumber",
  ],
  4: [
    // Family Details
    "fatherName",
    "fatherNameLocal",
    "motherName",
    "motherNameLocal",
    "grandFatherName",
    "grandFatherNameLocal",
    "spouseName",
    "spouseNameLocal",
  ],
  5: [
    // Landlord Details
    "landLordName",
    "landLordAddress",
    "landLordContactNumber",
  ],
  6: [
    // Documents
    "photoFile",
    "photoFileName",
    "citizenshipFrontFile",
    "citizenshipFrontFileName",
    "citizenshipBackFile",
    "citizenshipBackFileName",
    "passportFile",
    "passportFileName",
    "providentFundFile",
    "providentFundFileName",
  ],
};

export default function EndorsementForm({ data }: EndorsementProps) {
  const { showToast } = useToast();
  const form = useForm<AddEditKycDTO>({
    resolver: zodResolver(AddEditKycSchema),
    mode: "onChange",
    defaultValues: emptyKyc,
  });

  useEffect(() => {
    if (data?.kycNumber) form.reset(data);
    console.log("pandey", data?.kycNumber);
  }, [form, data]);

  const [currentStep, setCurrentStep] = useState(0);
  const [enabledTabs, setEnabledTabs] = useState([0]);
  const [kycRequiredFields, setKycRequiredFields] = useState<
    KycRequiredFields | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [clientVerification, setClientVerification] = useState(false);
  const [mobileVerification, setMobileVerification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: PostCallData = {
          endpoint: "kyc_required_fields",
        };
        const response = await apiPostCall(data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setKycRequiredFields(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    fetchData();
  }, []);

  const router = useRouter();

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const fieldsToValidate = stepFieldGroups[stepIndex] || [];

    setValidationErrors([]);

    try {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) {
        const errors = fieldsToValidate
          .map(
            (field: keyof AddEditKycDTO) =>
              form.formState.errors[field]?.message
          )
          .filter(Boolean);
        setValidationErrors(errors as string[]);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const tabs = [
    {
      id: 0,
      name: "General Details",
      component: (
        <GeneralDetails
          setClientVerification={setClientVerification}
          setMobileVerification={setMobileVerification}
          form={form}
          kycRequiredFields={kycRequiredFields}
        />
      ),
    },
    {
      id: 1,
      name: "Personal Details",
      component: (
        <PersonalDetails form={form} kycRequiredFields={kycRequiredFields} />
      ),
    },
    {
      id: 2,
      name: "Address Details",
      component: (
        <AddressDetails
          form={form}
          isLoggedIn={true}
          kycRequiredFields={kycRequiredFields}
        />
      ),
    },
    {
      id: 3,
      name: "Identification Details",
      component: (
        <IdentificationDetails
          form={form}
          kycRequiredFields={kycRequiredFields}
        />
      ),
    },
    {
      id: 4,
      name: "Family Details",
      component: <FamilyDetails form={form} />,
    },
    {
      id: 5,
      name: "Landlord Details",
      component: <LandlordDetails form={form} />,
    },
    {
      id: 6,
      name: "Documents",
      component: <DocumentDetails form={form} data={data} />,
    },
  ];

  const handleContinue = async () => {
    const isStepValid = await validateStep(currentStep);
    // window scroll top
    if (!isStepValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep < tabs.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (!enabledTabs.includes(nextStep)) {
        setEnabledTabs([...enabledTabs, nextStep]);
      }
      setValidationErrors([]);
    } else {
      const isFormValid = await form.trigger();
      if (isFormValid) {
        if (data?.endorsementId) {
          form.handleSubmit(onUpdate)();
        } else {
          form.handleSubmit(onSubmit)();
        }
      } else {
        const allErrors = Object.values(form.formState.errors)
          .map((error) => error?.message)
          .filter(Boolean);
        setValidationErrors(allErrors as string[]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationErrors([]);
    }
  };

  const handleTabClick = (tabIndex: number) => {
    if (enabledTabs.includes(tabIndex)) {
      setCurrentStep(tabIndex);
      setValidationErrors([]);
    }
  };

  // On Sumbit
  const onSubmit: SubmitHandler<AddKycDTO> = async (formData) => {
    try {
      setIsSubmitting(true);

      const submitData: PostCallData = {
        ...formData,
        ...(data?.endorsementId && { EndorsementId: data.endorsementId }),
        ...(data?.endorsementIdEncrypted && {
          EndorsementIdEncrypted: data.endorsementIdEncrypted,
        }),
        endpoint: "endorsement_update",
      };

      const response = await apiPostCall(submitData);
      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(response.data.code, response.data.message, "Add KYC");
        router.push("/kyc-endorsement");
      } else {
        showToast(response.data.code, response.data.message, "Add KYC");
      }
    } catch (error) {
      console.error("Error submitting KYC form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save KYC details"}`,
        "Add KYC"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate: SubmitHandler<AddKycDTO> = async (formData) => {
    try {
      setIsSubmitting(true);

      if (!data?.endorsementId) {
        throw new Error("Missing endorsementId for update.");
      }

      const submitData: PostCallData = {
        ...formData,
        EndorsementId: data.endorsementId,
        endorsementId: data.endorsementId,
        ...(data.encryptedID && { EncryptedID: data.encryptedID }),
        ...(data.endorsementIdEncrypted && {
          EndorsementIdEncrypted: data.endorsementIdEncrypted,
        }),
        endpoint: "endorsement_add",
      };

      const response = await apiPostCall(submitData);

      if (response?.data?.code === SYSTEM_CONSTANTS.success_code) {
        const id = response.data.EndorsementIdEncrypted;
        router.push(id ? `/kyc-endorsement/preview/${id}` : "/kyc-endorsement");

        showToast(response.data.code, response.data.message, "Update KYC");
      } else {
        showToast(response?.data?.code, response?.data?.message, "Update KYC");
      }
    } catch (error) {
      console.error("Error submitting KYC form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to update KYC details"}`,
        "Update KYC"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="bg-white border-b-1 overflow-hidden mb-2">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(tab.id);
                }}
                className={`px-4 py-2 font-medium whitespace-nowrap ${
                  currentStep === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : enabledTabs.includes(tab.id)
                    ? "text-gray-700 hover:text-gray-900 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Validation Errors Display */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Title</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={`${index * 1}-errors`}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border-1 mb-6 mt-4">
          <div className="p-6">
            <div className="tab-content">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {tabs[currentStep].component}
                </form>
              </Form>
            </div>

            <hr className="border-gray-200 my-5" />

            <div className="flex justify-between">
              {currentStep > 0 && (
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleBack}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
                >
                  <ArrowLeft size={14} className="mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                disabled={
                  !clientVerification || !mobileVerification || isSubmitting
                }
                onClick={handleContinue}
                className={`cursor-pointer text-white text-sm py-2 px-6 rounded-md flex items-center ${
                  !clientVerification || !mobileVerification
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    {currentStep === tabs.length - 1
                      ? data?.endorsementId
                        ? "Update"
                        : "Submit"
                      : "Continue"}

                    {currentStep !== tabs.length - 1 && (
                      <ArrowRight size={14} className="ml-2" />
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
