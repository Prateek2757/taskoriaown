"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import type { AddEditOnlineProposalWithFileDTO } from "../../onlineProposalSchema";

export default function Page() {
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyData, setPolicyData] =
    useState<AddEditOnlineProposalWithFileDTO>();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const kycNumber = params.kycNumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = {
          KYCNumber: kycNumber || null,
          endpoint: "kyc_view",
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
    if (kycNumber) {
      fetchData();
    }
  }, [kycNumber]);

  // const displayData = (field: keyof AddEditPolicyWithFileDTO): string => {
  //     if (!policyData) return 'Loading...';
  //     const value = policyData[field];
  //     return value?.toString() || 'N/A';
  // };

  // const verifyKyc = async () => {
  //     try {
  //         // setIsSubmitting(true);
  //         if (!kycNumber) {
  //             return;
  //         }

  //         const submitData: PostCallData = {
  //             kycNumber: kycNumber,
  //             endpoint: 'kyc_verify',
  //         } as PostCallData;

  //         console.log('Kyc Number Verification Form data', submitData);
  //         const response = await apiPostCall(submitData);

  //         console.log('Kyc Number Verification response', response);
  //         if (response && response.status === API_CONSTANTS.success) {
  //             alert('Kyc Number Verified Successfully');
  //             console.log('Kyc Number Verified Successfully');
  //             window.location.reload();
  //         } else {
  //             alert(
  //                 `Failed to Verify KYC: ${response?.data.message || 'Unknown error'}`,
  //             );
  //         }
  //     } catch (error) {
  //         console.error('Error getting age', error);
  //         alert(`Error: ${error || 'Failed to Verify KYC'}`);
  //     } finally {
  //         // setIsSubmitting(false);
  //         console.log('false');
  //     }
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 py-6">
        <div className="flex justify-start">
          <Link
            href="/kyc"
            type="submit"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <ChevronLeft color="#fff" size={18} />
            <span>Back</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border-1 p-6 text-center">
            <p>Loading KYC details...</p>
          </div>
        ) : policyData ? (
          <>
            <div className="bg-white rounded-lg border-1 mb-6 mt-4">
              {/* <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                                        Personal Information
                                    </h2>

                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Branch:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'branchCode',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Residence Status:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'residenceStatus',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Nationality:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'nationality',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Religion:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'religion',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Salutation:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'salutation',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    First Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'firstName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Middle Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'middleName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Last Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'lastName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Full Name in Nepali:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'nameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    DOB in BS:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'dateOfBirthLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    DOB in AD:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'dateOfBirth',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Gender:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'gender',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Place of Birth:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'birthPlace',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Marital Status:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'maritalStatus',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Contact Information
                                    </h2>

                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Mobile Number:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'mobileNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Email:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'email',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Land Line Phone:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'landLineNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Foreign Phone:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'foreignPhone',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Foreign Address:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'foreignAddress',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Permanent Address Information
                                    </h2>
                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Province (Permanent):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentProvince',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    District (Permanent):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentDistrict',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Municipality (Permanent):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentMunicipality',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Permanent Street Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentStreetName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Permanent Street Name
                                                    (Nepali):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentStreetNameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Permanent House No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentHouseNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Permanent Ward No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentWardNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Permanent Location:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'permanentLocation',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Temporary Address Information
                                    </h2>
                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Province (Temporary):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryProvince',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    District (Temporary):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryDistrict',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Municipality (Temporary):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryMunicipality',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Temporary Street Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryStreetName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Temporary Street Name
                                                    (Nepali):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryStreetNameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Temporary House No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryHouseNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Temporary Ward No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryWardNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Temporary Location:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'temporaryLocation',
                                                            )}
                                                        </b>
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
                                                    Citizenship No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'citizenShipNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Issued District:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'citizenShipNumberIssuedDistrict',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Citizenship Issued Date
                                                    (BS):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'citizenShipNumberIssuedDateLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Citizenship Issued Date
                                                    (AD):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'citizenShipNumberIssuedDate',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Identification Type:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'identityDocumentType',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Identification No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'identityDocumentNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Issued District:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'identityDocumentIssuedDistrict',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Identification Issued Date
                                                    (BS):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'identityDocumentIssuedDateLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Identification Issued Date
                                                    (AD):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'identityDocumentIssuedDate',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    National Identity Number:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'identityDocumentNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Associated Profession / Business
                                        Information
                                    </h2>
                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Profession:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'profession',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Company Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'companyName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Company Address:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'companyAddress',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Income Mode:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'incomeMode',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Income Amount:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'incomeAmount',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    PAN No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'panNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    PF No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'pfNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    CIT No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'citNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    SSF No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'ssfNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Bank Details
                                    </h2>
                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Bank Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'bankName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Bank Account No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'bankAccountNumber',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Bank Account Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'bankAccountName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Bank Branch:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'bankBranchCode',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Qualification Details
                                    </h2>
                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Qualification:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'qualification',
                                                            )}
                                                        </b>
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
                                                        <b>
                                                            {displayData(
                                                                'fatherName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Father Name (Nepali):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'fatherNameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Mother Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'motherName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Mother Name (Nepali):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'motherNameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Grand Father Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'grandFatherName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Grand Father Name (Nepali):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'grandFatherNameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Spouse Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'spouseName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Spouse Name (Nepali):
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'spouseNameLocal',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
                                        Information of Landlord
                                    </h2>
                                    <div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Landlord&apos;s Name:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'landLordName',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Landlord&apos;s Address:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'landLordAddress',
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Landlord&apos;s Contact No.:
                                                    <span className="ml-1">
                                                        <b>
                                                            {displayData(
                                                                'landLordContactNumber',
                                                            )}
                                                        </b>
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
                                                    Photo
                                                </div>
                                                <img
                                                    alt={
                                                        displayData(
                                                            'photoFileUrl',
                                                        )
                                                            ? 'Document'
                                                            : 'No Document Uploaded'
                                                    }
                                                    className="border border-stone-200 rounded-lg p-2"
                                                    src={`${displayData(
                                                        'photoFileUrl',
                                                    )}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Citizenship Front
                                                </div>
                                                <img
                                                    alt={
                                                        displayData(
                                                            'citizenshipFrontFileUrl',
                                                        )
                                                            ? 'Document'
                                                            : 'No Document Uploaded'
                                                    }
                                                    className="border border-stone-200 rounded-lg p-2"
                                                    src={`${displayData(
                                                        'citizenshipFrontFileUrl',
                                                    )}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Citizenship Back
                                                </div>
                                                <img
                                                    alt={
                                                        displayData(
                                                            'citizenshipBackFileUrl',
                                                        )
                                                            ? 'Document'
                                                            : 'No Document Uploaded'
                                                    }
                                                    className="border border-stone-200 rounded-lg p-2"
                                                    src={`${displayData(
                                                        'citizenshipBackFileUrl',
                                                    )}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Passport
                                                </div>
                                                <img
                                                    alt={
                                                        displayData(
                                                            'passportFileUrl',
                                                        )
                                                            ? 'Document'
                                                            : 'No Document Uploaded'
                                                    }
                                                    className="border border-stone-200 rounded-lg p-2"
                                                    src={`${displayData(
                                                        'passportFileUrl',
                                                    )}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700 text-sm">
                                                    Provident Fund
                                                </div>
                                                <img
                                                    alt={
                                                        displayData(
                                                            'providentFundFileUrl',
                                                        )
                                                            ? 'Document'
                                                            : 'No Document Uploaded'
                                                    }
                                                    className="border border-stone-200 rounded-lg p-2"
                                                    src={`${displayData(
                                                        'providentFundFileUrl',
                                                    )}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
            </div>
            {/* {policyData.verifiedDate === null && (
                                <Button
                                    disabled={isSubmitting}
                                    onClick={verifyKyc}
                                    className={`${
                                        isSubmitting
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'cursor-pointer'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <Loader2Icon className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                    Verify
                                </Button>
                            )} */}
          </>
        ) : (
          <div className="bg-white rounded-lg border-1 p-6 text-center">
            <p>No KYC details found for number: {kycNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
