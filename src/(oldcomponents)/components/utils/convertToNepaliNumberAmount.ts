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

const convertToNepaliNumberAmount = (strNum: string | number): string => {
	const cleaned = strNum.toString().replace(/,/g, "");

	const converted = cleaned.split("").map((ch) => {
		if (ch === "." || ch === "," || ch === "-") return ch;
		const digit = Number(ch);
		return Number.isNaN(digit) ? ch : (nums[digit] ?? ch);
	});

	return converted.join("");
};

export default convertToNepaliNumberAmount;
