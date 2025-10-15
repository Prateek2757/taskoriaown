"use client";
import { Button } from "@/components/ui/button";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditProposalWithFileDTO } from "../../../proposal/schemas/proposalSchema";

export default function Page() {
  const [policyData, setPolicyData] = useState<AddEditProposalWithFileDTO>();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const proposalNumber = params.proposalNumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = {
          proposalNumber: proposalNumber || null,
          endpoint: "policy_detail",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is form response", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setPolicyData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (proposalNumber) {
      fetchData();
    }
  }, [proposalNumber]);

  const displayData = (field: keyof AddEditProposalWithFileDTO): string => {
    if (!policyData) return "Loading...";
    const value = policyData[field];
    return value?.toString() || "N/A";
  };

  const handlePrint = () => {
    const printStyles = `
            <style>
                @media print {
                    @page {
                        margin: 0.5in;
                    }
                    
                    body * {
                        visibility: hidden;
                    }
                    
                    .print-content, .print-content * {
                        visibility: visible;
                    }
                    
                    .print-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .p-6{
                        padding:0;
                    }
                        .text-sidebar-foreground{
                        display:none;
                        }
                }
            </style>
        `;

    const styleElement = document.createElement("div");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    window.print();

    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="">
          <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
            <Button
              onClick={handlePrint}
              className="cursor-pointer flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
            >
              <Printer color="#fff" size={18} />
              <span>Print</span>
            </Button>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border-1 p-6 text-center">
              <p>Loading Proposal details...</p>
            </div>
          ) : policyData ? (
            <>
              <div className="bg-white rounded-lg border-1 mb-6 mt-4">
                <div className="print-content">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Personal Information
                    </h2>

                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Product Name:
                            <span className="ml-1">
                              <b>{displayData("productCode")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Mode of payment:
                            <span className="ml-1">
                              <b>{displayData("modeOfPayment")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Policy Term:
                            <span className="ml-1">
                              <b>{displayData("term")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Province:
                            <span className="ml-1">
                              <b>{displayData("provinceId")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            District:
                            <span className="ml-1">
                              <b>{displayData("districtId")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Municipality:
                            <span className="ml-1">
                              <b>{displayData("municipalityId")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Ward No:
                            <span className="ml-1">
                              <b>{displayData("wardNumber")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Mobile Number:
                            <span className="ml-1">
                              <b>{displayData("mobileNumber")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            DOB in BS:
                            <span className="ml-1">
                              <b>{displayData("dateOfBirthLocal")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            DOB in AD:
                            <span className="ml-1">
                              <b>{displayData("dateOfBirth")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Age:
                            <span className="ml-1">
                              <b>{displayData("age")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            First Name:
                            <span className="ml-1">
                              <b>{displayData("firstName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Middle name:
                            <span className="ml-1">
                              <b>{displayData("middleName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Last Name:
                            <span className="ml-1">
                              <b>{displayData("lastName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Gender:
                            <span className="ml-1">
                              <b>{displayData("gender")}</b>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Marital Status:
                            <span className="ml-1">
                              <b>{displayData("maritalStatus")}</b>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Qualification:
                            <span className="ml-1">
                              <b>{displayData("qualification")}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                      Identification Details
                    </h2>
                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Identification Type:
                            <span className="ml-1">
                              <b>{displayData("identityDocumentType")}</b>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Issued District:
                            <span className="ml-1">
                              <b>
                                {displayData("identityDocumentIssuedDistrict")}
                              </b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Identification Issued Date (BS):
                            <span className="ml-1">
                              <b>{displayData("identityDocumentIssuedDate")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Identification Issued Date (AD):
                            <span className="ml-1">
                              <b>{displayData("identityDocumentIssuedDate")}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                      Family Details
                    </h2>
                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Father Name:
                            <span className="ml-1">
                              <b>{displayData("fatherName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Mother Name:
                            <span className="ml-1">
                              <b>{displayData("motherName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Grand Father Name:
                            <span className="ml-1">
                              <b>{displayData("grandFatherName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Spouse Name:
                            <span className="ml-1">
                              <b>{displayData("spouseName")}</b>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Son Name:
                            <span className="ml-1">
                              <b>{displayData("sonName")}</b>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Daughter Name:
                            <span className="ml-1">
                              <b>{displayData("daughterName")}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                      Information of Document
                    </h2>
                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Issuer Photo
                          </div>
                          <img
                            alt={
                              displayData("insuredImageUrl")
                                ? "Document"
                                : "No Document Uploaded"
                            }
                            className="border border-stone-200 rounded-lg p-2"
                            src={`${displayData("insuredImageUrl")}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Citizenship Front
                          </div>
                          <img
                            alt={
                              displayData("citizenshipFrontUrl")
                                ? "Document"
                                : "No Document Uploaded"
                            }
                            className="border border-stone-200 rounded-lg p-2"
                            src={`${displayData("citizenshipFrontUrl")}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            Citizenship Back
                          </div>
                          <img
                            alt={
                              displayData("citizenshipBackUrl")
                                ? "Document"
                                : "No Document Uploaded"
                            }
                            className="border border-stone-200 rounded-lg p-2"
                            src={`${displayData("citizenshipBackUrl")}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg border-1 p-6 text-center">
              <p>No KYC details found for number: {proposalNumber}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
