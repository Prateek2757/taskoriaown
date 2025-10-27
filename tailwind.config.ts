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
			colors: {
			
				secondary: {
				  DEFAULT: "#F3F4F6",
				},
				accent: {
				  DEFAULT: "#F59E0B",
				},
			  },
			
		},
	},
};
