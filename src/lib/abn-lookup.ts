import { type AbnLookupResult } from "@/features/onboarding/schema";

type AbrAbnDetailsResponse = {
  Abn?: string;
  AbnStatus?: string;
  AbnStatusEffectiveFrom?: string;
  AddressPostcode?: string;
  AddressState?: string;
  BusinessName?: string[];
  EntityName?: string;
  EntityTypeName?: string;
  Gst?: string;
  Message?: string;
};

const ABR_JSON_URL = "https://abr.business.gov.au/json/AbnDetails.aspx";

function parseJsonpResponse(text: string): AbrAbnDetailsResponse {
  const match = text.match(/^[^(]*\(([\s\S]*)\)\s*;?$/);

  if (!match?.[1]) {
    throw new Error("Invalid ABR response");
  }

  return JSON.parse(match[1]) as AbrAbnDetailsResponse;
}

function mapAbrResponse(data: AbrAbnDetailsResponse): AbnLookupResult {
  const status = data.AbnStatus ?? "";

  return {
    abn: data.Abn ?? "",
    entityName: data.EntityName ?? "",
    businessNames: data.BusinessName ?? [],
    abnStatus: status,
    abnStatusEffectiveFrom: data.AbnStatusEffectiveFrom ?? "",
    addressState: data.AddressState ?? "",
    addressPostcode: data.AddressPostcode ?? "",
    entityTypeName: data.EntityTypeName ?? "",
    gst: data.Gst ?? "",
    message: data.Message ?? "",
    isActive: status.toLowerCase() === "active",
  };
}

export async function lookupAbnRegistration(abn: string) {
  const guid = process.env.ABR_GUID;

  if (!guid) {
    throw new Error("ABN lookup is not configured.");
  }

  const url = new URL(ABR_JSON_URL);
  url.searchParams.set("abn", abn);
  url.searchParams.set("callback", "callback");
  url.searchParams.set("guid", guid);

  const response = await fetch(url, {
    headers: { Accept: "application/javascript, application/json, text/plain" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error("Unable to verify ABN right now.");
  }

  return mapAbrResponse(parseJsonpResponse(await response.text()));
}
