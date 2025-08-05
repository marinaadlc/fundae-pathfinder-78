import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				// Background colors
				'background-100': 'hsl(var(--background-100))',
				'background-200': 'hsl(var(--background-200))',
				'background-300': 'hsl(var(--background-300))',
				'background-400': 'hsl(var(--background-400))',
				'background-500': 'hsl(var(--background-500))',
				
				// Primary colors
				'primary-100': 'hsl(var(--primary-100))',
				'primary-200': 'hsl(var(--primary-200))',
				'primary-300': 'hsl(var(--primary-300))',
				'primary-400': 'hsl(var(--primary-400))',
				'primary-500': 'hsl(var(--primary-500))',
				'primary-600': 'hsl(var(--primary-600))',
				'primary-700': 'hsl(var(--primary-700))',
				
				// Accent colors
				'accent-100': 'hsl(var(--accent-100))',
				'accent-200': 'hsl(var(--accent-200))',
				'accent-300': 'hsl(var(--accent-300))',
				'accent-400': 'hsl(var(--accent-400))',
				'accent-500': 'hsl(var(--accent-500))',
				'accent-600': 'hsl(var(--accent-600))',
				'accent-700': 'hsl(var(--accent-700))',
				
				// Neutral colors
				'white-100': 'hsl(var(--white-100))',
				'black-100': 'hsl(var(--black-100))',
				
				// Gray colors
				'gray-100': 'hsl(var(--gray-100))',
				'gray-200': 'hsl(var(--gray-200))',
				'gray-300': 'hsl(var(--gray-300))',
				'gray-400': 'hsl(var(--gray-400))',
				'gray-500': 'hsl(var(--gray-500))',
				'gray-600': 'hsl(var(--gray-600))',
				'gray-700': 'hsl(var(--gray-700))',
				
				// Status colors
				'error-100': 'hsl(var(--error-100))',
				'warning-100': 'hsl(var(--warning-100))',
				'success-100': 'hsl(var(--success-100))',
				
				// Semantic colors (existing)
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))'
				},
				'selected-state': 'hsl(var(--selected-state))',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
