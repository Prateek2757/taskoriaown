import { api } from "@/lib/api-client";
import type {
  AbnLookupResult,
  OnboardingFormData,
} from "@/features/onboarding/schema";

type ReferralValidationResponse = {
  valid: boolean;
  message?: string;
};

type AbnLookupResponse = {
  result: AbnLookupResult;
};

type SubmitProviderOnboardingParams = {
  data: OnboardingFormData;
  userId: string;
  categoryId: string;
  referralIsValid: boolean;
};

export function validateReferralCode(code: string) {
  return api.post<ReferralValidationResponse>("/api/signup/referral-validate", {
    code: code.trim(),
  });
}

export function lookupAbn(abn: string) {
  return api.get<AbnLookupResponse>(
    `/api/abn/lookup?abn=${encodeURIComponent(abn)}`
  );
}

export function submitProviderOnboarding({
  data,
  userId,
  categoryId,
  referralIsValid,
}: SubmitProviderOnboardingParams) {
  const payload = {
    public_id: userId,
    categoryPublic_id: categoryId,
    ...data,
    phone: data.phone || null,
    referralCode: referralIsValid ? data.referralCode : null,
    location_id: data.is_nationwide
      ? undefined
      : data.city_id
        ? Number(data.city_id)
        : null,
  };

  return api.post<void>("/api/signup/final-submit", payload);
}
