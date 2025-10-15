/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	theme: {
		extend: {
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},
			colors:{
				"primary": "#1E40AF",
				"secondary": "#F3F4F6",
				"accent": "#F59E0B",
			},
			animation: {
				"caret-blink": "caret-blink 1.25s ease-out infinite",
			},
		},
	},
};
