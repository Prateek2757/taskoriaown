// import { useCallback } from "react";

export function commaSeparationNumber(value: number | string): string {
	const intValue = Math.trunc(Number(value));
	if (Number.isNaN(intValue)) return "";
	return Math.floor(intValue).toLocaleString("en-US");
}
