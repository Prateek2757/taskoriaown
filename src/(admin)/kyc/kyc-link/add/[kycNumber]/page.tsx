"use client";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import KycLinkForm from "../../components/KycLinkForm";

export default function Page() {
  const params = useParams();
  const kycNumber = params.kycNumber;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KycLinkForm kycNumber={kycNumber} />
    </Suspense>
  );
}
