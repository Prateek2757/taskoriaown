"use client";
import type { AddEditKycDTO } from "../schemas/endorsementSchema";

export type EndorsementProps = {
  data?: AddEditKycDTO & {
    EndorsementId?: string | null;
    EndorsementIdEncrypted?: string | null;
    kycNumber: string;
  };
};
