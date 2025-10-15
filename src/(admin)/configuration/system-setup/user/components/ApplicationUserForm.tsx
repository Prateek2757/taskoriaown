"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler, Form } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  FileUser,
  Home,
  Lock,
  User,
} from "lucide-react";
import UserDetails from "./userTab/UserDetails";
import AddressDetailsForm from "./userTab/AddressDetails";
import CorporateDetailsForm from "./userTab/CorporateDetails";
import LoginCredentialsForm from "./userTab/LoginCredintals";
import UploadPictureForm from "./userTab/DocumentUpload";
import { Button } from "@/components/ui/button";
import { apiGetCall, apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import {
  AddApplicationUserDTO,
  emptyUser,
  AddEditApplicationUserDTO,
  AddEditUserSchemas,
} from "../schemas/ApplicationUserSchemas";
import Link from "next/link";
import ScrollToTop from "@/app/(admin)/kyc/components/ScrollToTop";

export type ApplicationUserFormProps = {
  data?: AddEditApplicationUserDTO;
};

type UserRequiredDetails = {
  genderList: { label: string; value: string }[];
  branchList: { label: string; value: string }[];
  departmentList: { label: string; value: string }[];
  designationList: { label: string; value: string }[];
  roleList: { label: string; value: string }[];
};

const stepFieldGroups: Record<number, (keyof AddApplicationUserDTO)[]> = {
  0: [
    "firstName",
    "middleName",
    "lastName",
    "gender",
    "fullNameLocal",
    "contactNumber",
  ],
  1: ["permanentAddress", "temporaryAddress"],
  2: ["branchCode", "departmentId", "designationCode", "isAdmin"],
  3: ["email", "userName", "password", "role", "allowLogin"],
  4: ["profilePicture"],
};

export const emptyUpdateUser: AddEditApplicationUserDTO = {
  ...emptyUser,
};

export default function ApplicationUserForm({
  data,
}: ApplicationUserFormProps) {
  const { showToast } = useToast();

  const form = useForm<AddEditApplicationUserDTO>({
    resolver: zodResolver(AddEditUserSchemas),
    defaultValues: emptyUpdateUser,
  });

  useEffect(() => {
    if (data?.id) form.reset(data);
  }, [form, data]);

  const [currentStep, setCurrentStep] = useState(0);
  const [enabledTabs, setEnabledTabs] = useState([0]);
  const [userRequiredFields, setUserRequiredFields] = useState<
    UserRequiredDetails | undefined
  >();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: PostCallData = {
          endpoint: "application_user_required_fields",
        };

        const response = await apiGetCall(data);

        console.log("Get Data", response.data);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setUserRequiredFields(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching KYC Details Data:", error);
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
            (field: keyof AddEditApplicationUserDTO) =>
              form.formState.errors[field]?.message
          )
          .filter(Boolean);
        setValidationErrors(errors as string[]);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Validation error :", error);
      return false;
    }
  };

  const tabs = [
    {
      id: 0,
      name: "User Details",
      component: (
        <UserDetails
          form={form}
          genderList={userRequiredFields?.genderList ?? []}
        />
      ),
      icon: <User size={18} />,
    },
    {
      id: 1,
      name: "Address",
      component: <AddressDetailsForm form={form} />,
      icon: <Home size={18} />,
    },
    {
      id: 2,
      name: "Corporate",
      component: (
        <CorporateDetailsForm
          form={form}
          branchList={userRequiredFields?.branchList ?? []}
          departmentList={userRequiredFields?.departmentList ?? []}
          designationList={userRequiredFields?.designationList ?? []}
        />
      ),
      icon: <Briefcase size={18} />,
    },
    {
      id: 3,
      name: "Credentials",
      component: (
        <LoginCredentialsForm
          form={form}
          roleList={userRequiredFields?.roleList ?? []}
        />
      ),
      icon: <Lock size={18} />,
    },
    {
      id: 4,
      name: "profilePicture",
      component: <UploadPictureForm form={form} />,
      icon: <FileUser size={18} />,
    },
  ];

  const handleContinue = async () => {
    const isStepValid = await validateStep(currentStep);

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
      console.log("formData", form.getValues());
    } else {
      const isFormValid = await form.trigger();

      if (isFormValid) {
        if (data?.id) {
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

  const onSubmit: SubmitHandler<AddEditApplicationUserDTO> = async (
    formData
  ) => {
    try {
      setIsSubmitting(true);

      console.log("Submitting form data:", formData);

      const submitData: PostCallData = {
        ...formData,
        endpoint: "application_user_add",
      };

      const response = await apiPostCall(submitData);
      console.log("Submit response:", response);

      if (response?.data?.code === SYSTEM_CONSTANTS.success_code) {
        showToast(response.data.code, response.data.message, "Add User");
        router.push("/configuration/system-setup/user");
      } else {
        showToast(response?.data?.code, response?.data?.message, "Add User");
      }
    } catch (error) {
      console.error("Error submitting add user form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Add User details"}`,
        "Add User"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate: SubmitHandler<AddEditApplicationUserDTO> = async (
    formData
  ) => {
    console.log("formData", formData);
    try {
      setIsSubmitting(true);

      console.log("this is form data", formData);

      const submitData: PostCallData = {
        ...formData,
        endpoint: "application_user_update",
      };

      const response = await apiPostCall(submitData);
      console.log("this is form data respons", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(response?.data.code, response?.data.message, "Update User");
        router.push("/configuration/system-setup/user");
      } else {
        showToast(response?.data.code, response?.data.message, "Update User");
      }
    } catch (error) {
      console.error("Error updating user form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to update user details"}`,
        "Update User"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="bg-white overflow-hidden mb-2 pb-2 mt-2">
          <nav className="flex overflow-x-auto max-sm:justify-start sm:justify-start justify-center md:justify-center mt-2 sm:gap-8 gap-4 relative">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="relative max-w-screen  flex items-center"
              >
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab.id);
                  }}
                  className={`py-2 font-medium whitespace-nowrap flex items-center ${
                    currentStep === tab.id
                      ? "text-blue-600"
                      : enabledTabs.includes(tab.id)
                      ? "text-green-600 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-full me-3 flex flex-shrink-0 items-center justify-center relative z-10 ${
                      currentStep === tab.id
                        ? "bg-blue-600 text-white"
                        : enabledTabs.includes(tab.id)
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep === tab.id ? (
                      tab.icon
                    ) : enabledTabs.includes(tab.id) ? (
                      <Check className="text-white max-sm:text-xs text-xl" />
                    ) : (
                      tab.icon
                    )}
                  </span>
                  <span className="max-sm:hidden">{tab.name}</span>
                </Link>
                {index < tabs.length - 1 && (
                  <div className="absolute top-1/2 left-10 transform -translate-y-1/2 max-sm:flex hidden">
                    <div className="w-40 @max-xs:w-20  h-0.5 bg-gray-200">
                      <div
                        className={`h-full w-full transition-all duration-300 ${
                          enabledTabs.includes(tabs[index + 1].id)
                            ? "bg-green-600 w-full"
                            : currentStep === tab.id
                            ? "bg-blue-600 w-full"
                            : "bg-gray-200 w-0"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>{"Title"}</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please correct the following errors
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={`${index}-${error}`}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <FormProvider {...form}>
          <div className="bg-white rounded-lg border-1 mb-6 mt-4">
            <div className="p-6">
              <div className="tab-content">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    {tabs[currentStep].component}
                  </form>
                </Form>
                <hr className="border-gray-200 my-5" />
                <div className="flex justify-between">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
                      onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-2" /> Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleContinue}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700
                        text-white text-sm py-2 px-6 rounded-md flex
                        items-center"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        {currentStep === tabs.length - 1
                          ? data?.id
                            ? "Update"
                            : "Submit"
                          : "Continue"}
                      </>
                    )}
                    <ArrowRight className="4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
