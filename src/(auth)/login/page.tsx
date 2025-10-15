"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomAlert, {
  type AlertMessage,
} from "@/components/uiComponents/custom-alert/custom-alert";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useLanguage } from "@/hooks/use-changeLanguage";
import { type LoginDTO, LoginFormSchema } from "../authSchema";
import { useOnlyNumbers } from "@/hooks/useInputValidation";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const { locale } = useLanguage();

  if (session.data && session.data.accessToken !== null) {
    router.push("/dashboard");
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    type: null,
    message: "",
  });

  const form = useForm<LoginDTO>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      mobileNumber: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginDTO> = async (data) => {
    setIsSubmitting(true);
    setAlertMessage({ type: null, message: "" });

    try {
      const payload: PostCallData = {
        ...data,
        endpoint: "login",
      };
      const apiResponse = await apiPostCall(payload, false);

      if (apiResponse && apiResponse.status === API_CONSTANTS.success) {
        if (
          apiResponse.data.menuLists &&
          apiResponse.data.menuLists.length > 0
        ) {
          const activeMenus = apiResponse.data.menuLists.filter(
            (item: { isActive: boolean }) => item.isActive === true
          );
          console.log("Menu lists stored in Zustand:", activeMenus);
          localStorage.setItem("menu-list", JSON.stringify(activeMenus));
        }

        const response = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        console.log("this is api response of login", data);
        if (response?.error === null) {
          const successMessage = "User Login Success";
          setAlertMessage({
            type: "success",
            message: successMessage,
          });
          router.push("/dashboard");
          showToast(SYSTEM_CONSTANTS.success_code, successMessage, "Success");
        } else {
          let errorMessage =
            "Invalid credentials. Please check your mobile number and password.";
          let message = null;
          if (response?.error && response.error !== "CredentialsSignin") {
            try {
              const errorData = JSON.parse(response.error);
              message = errorData.message;
              errorMessage = message || errorMessage;
            } catch {
              errorMessage = response.error;
            }
          }
          setAlertMessage({
            type: "error",
            message: errorMessage,
          });
          showToast(SYSTEM_CONSTANTS.error_code, errorMessage, "Login Failed");
        }
      } else {
        const errorMessage =
          apiResponse.data.message || "Invalid credentials. Please try again.";

        showToast(SYSTEM_CONSTANTS.error_code, errorMessage, "Login Failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      showToast(SYSTEM_CONSTANTS.error_code, errorMessage, "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense>
      <div className="z-2 w-full md:w-1/2 p-8 md:p-12 md:border-l-1 border-gray-200">
        <div className="flex flex-col justify-center h-full max-w-md mx-auto">
          <h2
            className="text-2xl font-bold text-gray-600 dark:text-white mb-0 leading-[60px]"
            suppressHydrationWarning
          >
            {locale === "ne" ? "लगइन" : "Login"}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <CustomAlert alertMessage={alertMessage} />
                <div>
                  <FormInput
                    form={form}
                    name="mobileNumber"
                    type="text"
                    placeholder={`${
                      locale === "ne" ? "९XXXXXXXXX" : "9XXXXXXXXX"
                    }`}
                    required={true}
                    label={`${
                      locale === "ne" ? "मोबाइल नम्बर" : "Mobile Number"
                    }`}
                    onKeyDown={useOnlyNumbers()}
                  />
                </div>

                <div>
                  <div className="relative">
                    <FormInput
                      form={form}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={`${
                        locale === "ne"
                          ? "पासवर्ड लेख्नुहोस्"
                          : "Enter Password"
                      }`}
                      label={`${locale === "ne" ? "पासवर्ड" : "Password"}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-0 top-7 flex items-center cursor-pointer hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium ${
                    isSubmitting
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  type="submit"
                >
                  {isSubmitting && (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  )}
                  {locale === "ne" ? "लगइन गर्नुहोस्" : "Login"}
                </Button>
                <div className="flex justify-between text-sm mt-4">
                  <Link
                    href={`/en/register`}
                    className="text-gray-600 dark:text-white hover:text-blue-500"
                  >
                    {locale === "ne" ? "सदस्य बन्नुहोस्" : "Become a Member"}
                  </Link>
                  <Link
                    href={`/en/forgot-password`}
                    className="text-gray-600 dark:text-white hover:text-blue-500"
                  >
                    {locale === "ne"
                      ? "पासवर्ड बिर्सनुभयो?"
                      : "Forgot Password?"}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Suspense>
  );
}
