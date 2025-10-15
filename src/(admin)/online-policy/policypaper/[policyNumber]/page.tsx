'use client';
import { Button } from '@/components/ui/button';
import convertToWords from '@/components/utils/convertToWords';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { type PostCallData, apiPostCall } from '@/helper/apiService';
import { Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { PolicySchemaType } from '../../schemas/policySchema';
import cssStyle from '../policypaper.module.css';

export default function Page() {
    const [policyData, setPolicyData] = useState<PolicySchemaType>();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const policyNumber = params.policyNumber;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					policyNumberEncrypted: policyNumber || null,
					endpoint: "policy_paper",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setPolicyData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Policy Paper data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (policyNumber) {
			fetchData();
		}
	}, [policyNumber]);

	const displayData = (field: keyof PolicySchemaType): string => {
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
            <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
                <Button
                    onClick={handlePrint}
                    className="cursor-pointer flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
                >
                    <Printer color="#fff" size={18} />
                    <span>Print</span>
                </Button>
            </div>
            <div className="print-content ">
                <div className="flex justify-center items-center mb-2 d-print-none">
                    <div></div>
                    <div className="flex items-center">
                        <img
                            className="mr-2"
                            src="/images/logo-sun.png"
                            style={{ height: '70px' }}
                            alt="Sun Life Insurance"
                        />
                        <div>
                            <h1 className="text-center font-bold">सन नेपाल</h1>
                            <h1 className="text-center font-bold">
                                लाइफ इन्स्योरेन्स कं. लि.
                            </h1>
                        </div>
                    </div>
                    <img
                        className="mr-2"
                        src={displayData('qrCodeImage')}
                        style={{ height: '100px', width: '100px' }}
                        alt="QR Code"
                    />
                </div>
                <div className="policy-paper--small text-center">
                    कम्पनी ऐन २०६३ दर्ता नं १०३०/०६४/०६५ स्थायी लेखा नं. ६०६१४२८२१,
                    बीमक दर्ता नं. १३/०७४
                </div>
                <div className="policy-paper--small text-center mb-3">
                    कर्पोरेट कार्यालय: पुतलीसड़क, न्यू प्लाजा काठमाण्डौ, पो. ब. नं ५७७
                </div>
                <h6 className="text-center font-bold mb-4">
                    नविकरण म्यादी जीवन बीमालेख
                </h6>
                <p className="mb-0">
                    अनुसूचिमा उल्लेख भएको प्रस्ताव उद्घोषण तथा व्यक्तिगत स्वास्थ्य सम्बन्धी
                    विवरणलाई यस करारको आधार मान्ने गरी सन नेपाल लाइफ इन्स्योरेन्स कम्पनी
                    लिमिटेड (यसपछि बीमक भनिएको) ले प्राप्त गरेको र यस अनुसूचीमा उल्लेख गरे
                    बमोजिम पहिलो बीमाशुल्क रकम प्राप्त भएकोले,
                </p>
                <p className="mb-2">
                    अनुसूचीबमोजिम बीमाशुल्क भुक्तानी गरेवापत जुन घटना घटेमा भुक्तानी दिने
                    मनिएको हो सो घटना घटेमा बीमालेखमा उल्लेख भए बमोजिमको रकम बीमकले
                    आफ्नो कार्यालयमा भुक्तानी दिनेछ भन्ने कुरा यस बीमालेखद्वारा पुष्टि गरिन्छ
                    । यस बीमालेखमा संलग्न अनुसुची शर्तहरु, पूरक करारहरु र सम्पुष्टिहरु यस
                    करारको अंग मानिने छ ।
                </p>
                <p className="text-center font-semibold mt-0 mb-3">अनुसूची</p>
                <table className={cssStyle.policyPaper}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%' }}>
                                <div>
                                    बीमालेख जारी गर्ने कार्यालय : कर्पोरेट कार्यालय{' '}
                                </div>
                            </td>
                            <td style={{ width: '50%' }}>
                                <div>बीमा अभिकर्ताको</div>
                                <div>
                                    इजाजत पत्र नं :{' '}
                                    {displayData('agentLicenseNumber')}
                                </div>
                                <div>
                                    बीमा अभिकर्ता कोड नं :{' '}
                                    {displayData('agentCode')}
                                </div>
                                <div>नाम, थर : {displayData('agentName')}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>बीमा अवधि : {displayData('term')} वर्ष</div>
                            </td>
                            <td>
                                <div>
                                    बीमालेख नम्बर : {displayData('policyNumber')}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>बीमितको</div>
                                <div>नाम, थार : {displayData('fullName')}</div>
                                <div>
                                    स्थायी ठेगाना : {displayData('address')}
                                </div>
                            </td>
                            <td>
                                <div>बीमाङ्क रकम :</div>
                                <div>अंकमा : {displayData('sumAssured')}</div>
                                <div>
                                    अक्षरमा :{' '}
                                    {convertToWords(displayData('sumAssured'))}{' '}
                                    only
                                </div>
                                <div>
                                    बीमाशुल्क रकम रु. : {displayData('premium')}
                                </div>
                                <div>
                                    बीमा प्रारम्भ मिति :{' '}
                                    {displayData('dateOfCommencement')}
                                </div>
                                <div>
                                    बीमा समाप्ति हुने मिति :{' '}
                                    {displayData('maturityDate')}
                                </div>
                                <div>
                                    बीमाशुल्क भुक्तानीको तरिका :{' '}
                                    {displayData('modeOfPayment')}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>इच्छाइएको व्यक्तिको</div>
                                <div>
                                    नाम, थार : {policyData?.nomineeList[0].name}
                                </div>
                                <div>
                                    ठेगाना : {policyData?.nomineeList[0].address}
                                </div>
                                <div>इच्छाइएको व्यक्तिको माता / पिताको नाम : </div>
                                <div>
                                    बीमित र इच्छाइएको व्यक्ति विचको नाता :{' '}
                                    {policyData?.nomineeList[0].relation}
                                </div>
                            </td>
                            <td>
                                <div>
                                    नवीकरण बीमाशुल्क भुक्तानी गर्नुपर्ने मितिहरु :{' '}
                                    {displayData('nextDueDate')}
                                </div>
                                <div>
                                    अन्तिम बीमाशुल्क रकम भुक्तानी गर्नुपर्ने मिति :{' '}
                                    {displayData('finalPayDate')}
                                </div>
                                <div>
                                    बीमितको जन्म मिति :{' '}
                                    {displayData('dateOfBirth')}
                                </div>
                                <div>
                                    उमेर खुल्ने प्रमाण :{' '}
                                    {displayData('identityDocumentType')}
                                </div>
                                <div>
                                    प्रस्ताव मिति :{' '}
                                    {displayData('dateOfCommencement')}
                                </div>
                                <div>
                                    व्यक्तिगत स्वास्थ्य विवरण घोषणा मिति :{' '}
                                    {displayData('dateOfCommencement')}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="font-bold">
                                    बीमाङ्क रकम भुक्तानी दिइने अवस्था :
                                </div>
                                <div>
                                    चालु बीमालेखको बीमा समाप्त हुने मिति अगावै बीमितको
                                    मृत्यु भएमा बीमालेखको शर्तहरुको अधिनमा रही बीमाङ्क
                                    रकम भुक्तानी दिइनेछ ।
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="font-bold">
                                    भुक्तानी पाउने व्यक्ति :
                                </div>
                                <div>
                                    बीमितले इच्छाएको व्यक्ति वा बीमा ऐन २०७९ को दफा
                                    १२७ बमोजिमको हकवाला भुक्तानी पाउने व्यक्ति हुनेछ ।
                                    तर यस बीमालेख उपर कानूनी अधिकार भएको प्रमाणित
                                    गर्न सक्ने अरु कुनै व्यक्ति रहेको अवस्थामा निजले आफ्नो
                                    अधिकारसम्मको रकम भुक्तानी पाउनेछ ।
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="font-bold">
                                    बीमाशुल्क भुक्तानी :
                                </div>
                                <div>
                                    बीमाशुल्कको पहिलो भुक्तानी बीमा प्रारम्भ मितिमा
                                    दिनुपर्नेछ । नवीकरण बीमाशुल्क प्रत्येक वर्षको बीमाशुल्क
                                    भुक्तानी गर्नुपर्ने मितिमा दिनुपर्नेछ । अन्तिम बीमाशुल्क
                                    भुक्तानी गर्नुपर्ने मिति वा बीमितको मृत्यु भन्दा पहिले
                                    आखिरी बीमाशुल्क भुक्तानी गर्नुपर्ने मिति मध्ये जुनचाहिँ
                                    घटना पहिले घट्छ सो बीमाशुल्कको आखिरी भुक्तानी
                                    गर्नुपर्ने मिति हुनेछ ।
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="float-right page-break">
                    <p>अधिकार प्राप्त अधिकारीको :</p>
                    <p className="flex">
                        हस्ताक्षर :
                        <span>
                            <img
                                src="/images/sign.png"
                                alt="sign"
                                width="100"
                                className="ml-2"
                            ></img>
                        </span>
                    </p>
                    <p>मिति : {displayData('createdDate')}</p>
                </div>
                <img
                    src="/images/stamp.png"
                    alt="sign"
                    width="110"
                    className="float-right"
                ></img>
                <div
                    className="float-clear"
                    style={{ pageBreakAfter: 'always' }}
                ></div>
                <br />
                <br />
                <br />
                <h5 className="font-semibold text-center mb-5">सामान्य शर्तहरु</h5>
                <h5 className="font-semibold">१. समर्पण मूल्य तथा कर्जा :</h5>
                <p className="mb-3 ml-3">
                    यस बीमालेख अन्तर्गत कुनै प्रकारको समर्पण मूल्य तथा कर्जा प्रदान गरिने छैन
                    ।
                </p>
                <h4 className="font-semibold">२. चुक्ता बीमालेख :</h4>
                <p className="mb-3 ml-3">
                    यस बीमालेख अन्तर्गत कुनै प्रकारको चुक्ता मूल्य तथा कर्जा प्रदान गरिने छैन
                    ।
                </p>
                <h5 className="font-semibold">३. इच्छाएको व्यक्ति :</h5>
                <p className="mb-3 ml-3">
                    बीमितको मृत्यु भएको खण्डमा यस बीमालेख अन्तर्गत भुक्तानी गरिने रकम
                    प्राप्त गर्ने व्यक्ति बीमितले इच्छाएको छ भने निजको नाम तथा ठेगानालाई
                    बीमालेखको अनुसूचीमा उल्लेख गरिने छ । यदि बीमितले इच्छाएको व्यक्ति बदल्ने
                    निर्णय गरेमा नयाँ इच्छाएको व्यक्तिको नाम र ठेगानालाई बीमालेखमा
                    सम्पुष्टी जनाउनको लागी बीमालेख सहित लिखित अनुरोध यस बीमकको
                    कार्यालयमा पठाउनु पर्नेछ । बीमकले यस बीमालेखमा परिवर्तन नगरेसम्म
                    इच्छाएको व्यक्तिको परिवर्तनले कुनै कानुनी मान्यता पाउने छैन। बीमितको
                    मृत्यु हुँदा इच्छाएको व्यक्ति जिवित भएमा मात्र निजले बीमालेख अन्तर्गतको
                    रकम पाउनेछ ।
                </p>
                <p className="mb-3 ml-3">
                    रीतपूर्वकको इच्छाएको व्यक्ति नभएमा बीमकले उक्त रकम बीमा ऐन २०७९ को
                    दफा १२७ बमोजिम बीमितका हकवालालाई दिनेछ ।
                </p>
                <h5 className="font-semibold">
                    ४. बीमालेख अन्तर्गत नपर्ने जोखिमहरु :
                </h5>
                <p className="mb-3 ml-3">
                    यदि बीमितको मृत्यु प्रत्यक्ष वा अप्रत्यक्ष रूपमा निम्न लिखित जुन सुकै
                    कारणबाट भएपनि बीमालेख अन्तर्गत कुनैपनि रकम भुक्तानी गरिने छैन ।
                </p>
                <ul className="mb-3 ms-10">
                    <li>
                        (क) मान्यता प्राप्त हवाई सेवाद्धारा संचालित मार्गमा यात्रु भई
                        उडान गर्दा बाहेक अन्य उडान गरेमा,
                    </li>
                    <li>
                        (ख) कुनै युद्ध जस्ता कार्यमा संलग्न भएमा (युद्ध घोषित होस् वा
                        नहोस्),
                    </li>
                    <li>(ग) नागरिक वा जंगी ऐन भंग गरेमा,</li>
                    <li>
                        (घ) मगज बिग्रेको होस् वा नहोस्, बीमालेख चालू रहेको अवस्थामा बीमा
                        प्रारम्भ मितिले २ वर्षभित्रमा आत्महत्या गरेमा वा आत्मघात गरेमा ।
                        उपरोक्त जोखिमहरु बाहेक यस बीमालेखले विदेशमा प्रवास यात्रा वा पेशा
                        गर्न कुनै बाधा पुन्याउने छैन ।
                    </li>
                </ul>
                <p className="mb-3">
                    ५. अनुसूचीमा कुनै त्रुटी पाइएमा बीमकलाई लिखित जानकारी गराउनु होला ।
                </p>
                <p className="mb-3" style={{ pageBreakAfter: 'always' }}>
                    ६. यस बीमालेख अन्तर्गत कुनै विवाद उत्पन्न भएमा बीमा ऐन, २०७९ बमोजिम
                    हुनेछ ।
                </p>
            </div>
            <div className="policy-paper-wrapper">
                <div className="flex justify-center items-center mb-2">
                    <div></div>
                    <div className="flex items-center">
                        <img
                            className="mr-2"
                            src="/images/logo-sun.png"
                            alt="Sun Life Insurance"
                            style={{ height: '70px' }}
                        />
                        <div>
                            <h1 className="text-center font-bold">सन नेपाल</h1>
                            <h1 className="text-center font-bold">
                                लाइफ इन्स्योरेन्स कं. लि.
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="policy-paper--small text-center">
                    कम्पनी ऐन २०६३ दर्ता नं १०३०/०६४/०६५ स्थायी लेखा नं. ६०६१४२८२१,
                    बीमक दर्ता नं. १३/०७४
                </div>
                <div className="policy-paper--small text-center mb-3">
                    कर्पोरेट कार्यालय: पुतलीसड़क, न्यू प्लाजा काठमाण्डौ, पो. ब. नं ५७७
                </div>
                <h6 className="text-center font-bold mb-5">
                    बीमालेख अन्तर्गत बीमितको मृत्यु भएमा किरिया खर्च बापत थप रकम भुक्तानी
                    दिने बारेको पूरक करार
                </h6>
                <p className="text-center mb-3">
                    बीमालेख नं.: {displayData('policyNumber')}{' '}
                    &nbsp;&nbsp;&nbsp;&nbsp; पूरक करारको क्रमाङ्क: FE
                    {displayData('policyNumber')} &nbsp;&nbsp;&nbsp;&nbsp; पूरक
                    करारको बीमाङ्क: 50,000
                </p>
                <p className="tx-1 mb-3">
                    बीमित बीमा प्रस्ताव फारममा उल्लेख भएको पेशामा नै लागेको भएमा वा
                    बीमितको पेशा परिवर्तनलाई बीमकले स्वीकार गरी यस पूरक करारको
                    सम्पुष्टीमा जनाएको र यस पूरक करार बापतको बीमाशुल्क बीमकलाई भुक्तानी
                    भई यो पूरक करारनामा लागू भएको अवस्थामा बीमितको मृत्यु भएमा बीमालेख
                    र यस पूरक करारको विशेष शर्त तथा सम्पुष्टीको परिधि भित्र रही
                    बीमालेखको अनुसूचीमा उल्लेखित भुक्तानी पाउने व्यक्तिलाई यस पूरक करारमा
                    उल्लेखित किरिया खर्च बापत बीमाङ्कको २५ प्रतिशत अथवा बढीमा
                    रु.५०,००० थप भुक्तानी गरिनेछ ।
                </p>
                <p className="mb-5">
                    बीमालेखमा संलग्न गरिएको यो पूरक करार बीमालेखको अभिन्न अङ्ग मानिने छ
                    र बीमालेखको अनुसूचीमा यसको क्रमाङ्क उल्लेख भएमा वा बीमालेखको सम्पुष्टी
                    खण्डमा जनाइएमा मात्र यो पूरक करारको कानूनी मान्यता हुनेछ ।
                </p>
                <h5 className="text-center font-semibold mb-5">विशेष शर्तहरु</h5>
                <h5 className="font-semibold">
                    १. पूरक करार क्रियाशिल हुने अवस्था :
                </h5>
                <p className="mb-3 ml-3">
                    यो पूरक करार बीमालेखको शर्तहरुको अधिनमा रहने छ र बीमाशुल्क भुक्तानी
                    भई बीमालेख चालु नभएसम्म वा बीमालेख व्यतित भएको भए पुनर्जागरण नभएसम्म
                    यो पूरक करार लागु हुने छैन ।
                </p>
                <h5 className="font-semibold">२. रद्द</h5>
                <p className="mb-3 ml-3">
                    बीमितले लिखित सुचना गरेमा बीमालेखको कुनै पनि वार्षिकोत्सव मिति (बीमा
                    शुरु भएको) मा यो पूरक करार रद्द गर्न सकिनेछ । यसरी रद्द गर्दा सम्पुष्टि
                    (Endorsement) को लागि पूरक करार बीमक समक्ष पेश गर्नुपर्ने छ ।
                </p>
                <h5 className="font-semibold ml-3">२.१. स्वतः रद्द</h5>
                <p className="ms-10">देहाय अवस्थामा यो पूरक करार स्वतः रद्द हुनेछ</p>
                <ul className="mb-3 ms-10">
                    <li>
                        (क) बीमालेख वा पूरक करार अन्तर्गत तिर्नुपर्ने बीमाशुल्क नतिरेमा,
                    </li>
                    <li>
                        (ख) बीमालेख चालु नरही चुक्ता मूल्यमा परिणत भएमा वा खारेज भएमा,
                    </li>
                    <li>
                        (ग) बीमालेखको वार्षिकोत्सवमा बीमितको उमेर ७० वर्ष पुरा भएमा,
                    </li>
                </ul>
                <h5 className="font-semibold ml-3">२.२ बीमाशुल्क</h5>
                <p className="mb-3 ms-10">
                    यो पूरक करार रद्द वा खारेज भएमा यसको लागि लाग्ने थप बीमाशुल्क तिर्नु
                    पर्दैन । बीमालेख रद्द वा खारेजीको बेलामा भुक्तानी दिएको थप बीमाशुल्क
                    बीमकले आर्जन नगरेको हो भने सो रकमको साथै रद्द भएपछि प्राप्त हुन आएको
                    पूरक करार अन्तर्गतको थप बीमाशुल्क बीमकले फिर्ता दिनेछ । यसपछिको
                    भुक्तानी भएमा यस्तो बीमाशुल्क फिर्ता गर्नु बाहेक बीमकको अरु कुनै दायित्व
                    रहने छैन ।
                </p>
                <h5 className="font-semibold">३. सुरक्षण नहुने जोखिमहरु :</h5>
                <p className="ml-3">
                    देहायको अवस्थामा बीमितको मृत्यु भएमा यो पूरक करार लागु हुने छैन
                </p>
                <ul className="mb-3 ms-3">
                    <li>
                        (क) मान्यता प्राप्त हवाई सेवाद्वारा संचालित मार्गमा यात्रु भई
                        उडान गर्दा बाहेक अन्य उडान गर्दा,
                    </li>
                    <li>(ख) मगज बिग्रेको होस् वा नहोस् आत्महत्या वा आत्मघात गरेमा,</li>
                    <li>
                        (ग) कुनै घोषित वा अघोषित युद्ध जस्ता कार्यहरु हुलदङ्गा हुलदङ्गश,
                        नागरिक अशान्ति वा आक्रमणमा सक्रिय संलग्न भएमा,
                    </li>
                    <li>(घ) ज्यान मार्ने वा जङ्गी वा निजामती कानून उल्लंघन गरेमा,</li>
                    <li>
                        (ङ) बीमित कुनै पनि युद्धरत (घोषित वा अघोषित) मुलुकको स्थल सेना,
                        जल सेना वा वायु सेना सदस्य भए‌मा,
                    </li>
                    <li>
                        (च) बीमित कुनै पनि युद्धरत (घोषित वा अघोषित) मुलुकको स्थल सेना,
                        जल सेना वा बायुसेनासंग काम गरिरहेको कुनै सहायक वा युद्धमा भाग
                        नलिने निजामती इकाईको सदस्य भएमा,
                    </li>
                    <li>
                        (छ) दौड, होडबाजी, बाजी वा हांक प्रतियोगितमा भाग लिंदा ।
                    </li>
                </ul>
                <h5 className="font-semibold">४. पेशा परिवर्तन</h5>
                <p className="mb-3 ml-3">
                    यदि बीमितले प्रस्ताव फाराममा उल्लेख गरेको पेशा परिवर्तन गरेमा वा
                    प्रस्ताव फाराममा उल्लेख गरेको भन्दा अन्य थप जोखिमपूर्ण उद्यम सुचारु गरेमा
                    सो कुराको जानकारी बीमकलाई अविलम्ब दिनु पर्नेछ र सो को आधारमा यस
                    पूरक करार अन्तर्गत लाग्ने बीमाशुल्क पुनः निर्धारण गरिनेछ।
                </p>
                <h5 className="font-semibold">५. दावी सुचना :</h5>
                <p className="mb-10 ml-3">
                    दाबीको सूचना अविलम्ब बीमकलाई दिनु पर्नेछ । तत्कालै सुचना दिन नसकेमा
                    कारण जनाई लिखित रुपमा ९० दिन भित्र दिन सकिनेछ ।
                </p>
                <div className="flex justify-end">
                    <img
                        src="/images/stamp.png"
                        alt="sign"
                        width="110"
                        className=""
                    />
                    <div className="text-end">
                        <img
                            src="/images/sign.png"
                            alt="sign"
                            width="100"
                            className="ml-auto"
                        />
                        <p>(आधिकारीक हस्ताक्षर)</p>
                        <p>मिति : {displayData('createdDate')}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
