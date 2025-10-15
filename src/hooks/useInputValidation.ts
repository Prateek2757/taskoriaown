import { useCallback } from "react";

export const useOnlyAlphabets = () => {
	return useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			!/^[a-zA-Z]$/.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== " " &&
			e.key !== "Tab" &&
			e.key !== "ArrowLeft" &&
			e.key !== "ArrowRight"
		) {
			e.preventDefault();
		}
	}, []);
};

export function useOnlyNumbers() {
	return useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			!/^\d+$/.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== "Tab" &&
			e.key !== "ArrowLeft" &&
			e.key !== "ArrowRight"
		) {
			e.preventDefault();
		}
	}, []);
}
