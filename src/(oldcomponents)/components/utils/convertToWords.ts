const ones = [
	"",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen",
];

const tens = [
	"",
	"",
	"Twenty",
	"Thirty",
	"Forty",
	"Fifty",
	"Sixty",
	"Seventy",
	"Eighty",
	"Ninety",
];

function convertToWords(num: string): string {
	const recNumber = Number.parseInt(num);
	if (recNumber === 0 || Number.isNaN(recNumber)) return "Zero Rupees";

	const getWords = (n: number): string => {
		if (n < 20) return ones[n];
		if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
		if (n < 1000)
			return `${ones[Math.floor(n / 100)]} Hundred ${getWords(n % 100)}`.trim();
		if (n < 100000)
			return `${getWords(Math.floor(n / 1000))} Thousand ${getWords(n % 1000)}`.trim();
		if (n < 10000000)
			return `${getWords(Math.floor(n / 100000))} Lakh ${getWords(n % 100000)}`.trim();
		return `${getWords(Math.floor(n / 10000000))} Crore ${getWords(n % 10000000)}`.trim();
	};

	return `${getWords(recNumber)} Rupees`.replace(/\s+/g, " ").trim();
}

export default convertToWords;
