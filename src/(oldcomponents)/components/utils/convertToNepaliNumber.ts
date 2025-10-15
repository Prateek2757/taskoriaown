const nums: Record<number, string> = {
	0: "०",
	1: "१",
	2: "२",
	3: "३",
	4: "४",
	5: "५",
	6: "६",
	7: "७",
	8: "८",
	9: "९",
};

type NumberFormatType = "num" | "eng" | "nep";

const convertToNepaliNumber = (
	strNum: string | number,
	type: NumberFormatType = "nep",
): string => {
	let cleaned = strNum.toString().replace(/,/g, "");

	if (type === "eng") {
		cleaned = new Intl.NumberFormat("en-EN").format(Number(cleaned));
	} else if (type === "nep") {
		cleaned = new Intl.NumberFormat("en-IN", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		}).format(Number(cleaned));
	}

	const converted = cleaned.split("").map((ch) => {
		if (ch === "." || ch === "," || ch === "-") return ch;
		const digit = Number(ch);
		return Number.isNaN(digit) ? ch : (nums[digit] ?? ch);
	});

	return converted.join("");
};

export default convertToNepaliNumber;
