import React from "react";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";

interface ConnectIpsProps {
	proposalNumber: string;
	premiumAmount: string;
}

import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";

const ConnectIps = ({ premiumAmount, proposalNumber }: ConnectIpsProps) => {
	const [ipsloading, setLoading] = React.useState(false);
	const handleIPSCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		checkout();
	};

	const { showToast } = useToast();

	const checkout = async () => {
		try {
			setLoading(true);
			const id = `${proposalNumber}|${premiumAmount}` || null;
            console.log("this is id of the data", id);
			const data = {
				params: { Id: id },
				endpoint: "connectips_checkout",
			};
			const response = await apiPostCall(data as PostCallData);
			console.log("this is checkout response", response.data.code);
			if (
				response?.data &&
				response.data.code === SYSTEM_CONSTANTS.success_code
			) {
				showToast(
					SYSTEM_CONSTANTS.success_code,
					response.data.message,
					"Success",
				);
				generateAndSubmitConnectIpsForm(response.data);
			} else {
				showToast(SYSTEM_CONSTANTS.error_code, response.data.message, "Failed");
			}
		} catch (error) {
			console.error("Error fetching Payment Detail data:", error);
		} finally {
			setLoading(false);
		}
	};

	const generateAndSubmitConnectIpsForm = (paymentData: any) => {
		const connectIpsUrl =
			"https://uat.connectips.com/connectipswebgw/loginpage";
		console.log("this is payment data", paymentData);

		const form = document.createElement("form");
		form.action = connectIpsUrl;
		form.method = "POST";
		form.style.display = "none";

		const formFields = {
			MERCHANTID: paymentData.merchantid,
			APPID: paymentData.appid,
			APPNAME: paymentData.appname,
			TXNID: paymentData.txnid,
			TXNDATE: paymentData.txndate,
			TXNCRNCY: paymentData.txncrncy || "NPR",
			TXNAMT: paymentData.txnamt,
			REFERENCEID: paymentData.referenceid,
			REMARKS: paymentData.remarks,
			PARTICULARS: paymentData.particulars,
			TOKEN: paymentData.token,
		};

		for (const [name, value] of Object.entries(formFields)) {
            if (!value) {
			console.error(`Missing value for ${name}`);
			continue;
		}

			const input = document.createElement("input");
			input.type = "hidden";
			input.name = name;
			input.value = value || "";
			input.required = true;
			form.appendChild(input);
		}
        console.log("this is form", form);
		document.body.appendChild(form);
		form.submit();

		setTimeout(() => {
			document.body.removeChild(form);
		}, 1000);
	};

	return {
		ipsloading,
		handleIPSCheckout,
	};
};

export default ConnectIps;
