import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
  			sans: [
  				'Lato',
  				'sans-serif'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  				dark: 'hsl(var(--destructive-dark))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))',
  				muted: 'hsl(var(--success-muted))',
  				dark: 'hsl(var(--success-dark))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))',
  				dark: 'hsl(var(--warning-dark))'
  			},
  			star: 'hsl(var(--star))',
  			caution: {
  				DEFAULT: 'hsl(var(--caution))',
  				foreground: 'hsl(var(--caution-foreground))'
  			},
  			info: 'hsl(var(--info))',
  			'figma-c1': 'hsl(var(--figma-c1))',
  			'figma-c3': 'hsl(var(--figma-c3))',
			chat: {
				DEFAULT: 'hsl(var(--chat))',
				foreground: 'hsl(var(--chat-foreground))',
			},
  			'ds-100': 'hsl(var(--ds-100))',
  			'ds-500': 'hsl(var(--ds-500))',
  			'dot-separator': 'hsl(var(--dot-separator))',
  			icon: {
  				DEFAULT: 'hsl(var(--icon))',
  				selected: 'hsl(var(--icon-selected))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			roleplay: {
				ink: 'hsl(var(--roleplay-ink))',
				'ink-soft': 'hsl(var(--roleplay-ink-soft))',
				muted: 'hsl(var(--roleplay-muted))',
				line: 'hsl(var(--roleplay-line))',
				'line-soft': 'hsl(var(--roleplay-line-soft))',
				accent: 'hsl(var(--roleplay-accent))',
				'accent-2': 'hsl(var(--roleplay-accent-2))',
				'accent-tint': 'hsl(var(--roleplay-accent-tint))'
			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  				hover: 'hsl(var(--card-hover))'
  			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			'foreground-destructive': 'hsl(var(--foreground-destructive))',
			'foreground-success': 'hsl(var(--foreground-success))',
			'foreground-warning': 'hsl(var(--foreground-warning))',
			'elevate-l1': 'hsl(var(--elevate-l1))',
			'elevate-l1-fg': 'hsl(var(--elevate-l1-fg))',
			'elevate-l2': 'hsl(var(--elevate-l2))',
			'elevate-l2-fg': 'hsl(var(--elevate-l2-fg))',
			'elevate-l3': 'hsl(var(--elevate-l3))',
			'elevate-l3-fg': 'hsl(var(--elevate-l3-fg))',
			'status-success': 'hsl(var(--status-success))',
			'status-success-fg': 'hsl(var(--status-success-fg))',
			'status-success-outline': 'hsl(var(--status-success-outline))',
			'status-warning': 'hsl(var(--status-warning))',
			'status-warning-fg': 'hsl(var(--status-warning-fg))',
			'status-warning-outline': 'hsl(var(--status-warning-outline))',
			'status-critical': 'hsl(var(--status-critical))',
			'status-critical-fg': 'hsl(var(--status-critical-fg))',
			'status-critical-outline': 'hsl(var(--status-critical-outline))',
			'status-info': 'hsl(var(--status-info))',
			'status-info-fg': 'hsl(var(--status-info-fg))',
			'status-info-outline': 'hsl(var(--status-info-outline))',
			'status-neutral': 'hsl(var(--status-neutral))',
			'status-neutral-fg': 'hsl(var(--status-neutral-fg))',
			'status-neutral-outline': 'hsl(var(--status-neutral-outline))',
			'status-ai': 'hsl(var(--status-ai))',
			'status-ai-fg': 'hsl(var(--status-ai-fg))',
			'status-ai-outline': 'hsl(var(--status-ai-outline))',
			'avatar-bg': 'hsl(var(--avatar-bg))',
			'avatar-text': 'hsl(var(--avatar-text))',
			'sidebar-background': 'hsl(var(--sidebar-background))',
			'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				'primary-border': 'hsl(var(--sidebar-primary-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			peri: {
  				'50': '#F7F5FC',
  				'100': '#EBE6FA',
  				'200': '#D6CFF2',
  				'300': '#BBAFEA',
  				'400': '#9F8EE1',
  				'500': '#8A75DB',
  				'600': '#7160B4',
  				'700': '#56498B',
  				'800': '#3B325E',
  				'900': '#241E39',
  				'950': '#13101F'
  			},
  			lilac: {
  				'50': '#FDFBFE',
  				'100': '#F9F5FD',
  				'200': '#F4ECFC',
  				'300': '#EDE0FA',
  				'400': '#E6D3F8',
  				'500': '#D2BBE7',
  				'600': '#BA92DC',
  				'700': '#9858CE',
  				'800': '#6E35A0',
  				'900': '#492767',
  				'950': '#291839'
  			},
  			corange: {
  				'50': '#FFF7F5',
  				'100': '#FEDED5',
  				'200': '#FDBEA0',
  				'300': '#FC9478',
  				'400': '#FB6740',
  				'500': '#FA4616',
  				'600': '#CD3912',
  				'700': '#9B2B0E',
  				'800': '#6C1E09',
  				'900': '#411206',
  				'950': '#230A03'
  			},
  			zinc: {
  				'50': '#FAFAFA',
  				'100': '#F4F4F5',
  				'200': '#E4E4E7',
  				'300': '#D4D4D8',
  				'400': '#A1A1AA',
  				'500': '#71717A',
  				'600': '#52525B',
  				'700': '#3F3F46',
  				'800': '#27272A',
  				'900': '#18181B',
  				'950': '#09090B'
  			},
  			red: {
  				'50': '#FEF2F2',
  				'100': '#FEE2E2',
  				'200': '#FECACA',
  				'300': '#FCA5A5',
  				'400': '#F87171',
  				'500': '#EF4444',
  				'600': '#DC2626',
  				'700': '#B91C1C',
  				'800': '#991B1B',
  				'900': '#7F1D1D',
  				'950': '#450A0A'
  			},
  			yellow: {
  				'50': '#FEFCE8',
  				'100': '#FEF9C3',
  				'200': '#FEF08A',
  				'300': '#FDE047',
  				'400': '#FACC15',
  				'500': '#EAB308',
  				'600': '#CA8A04',
  				'700': '#A16207',
  				'800': '#854D0E',
  				'900': '#713F12',
  				'950': '#422006'
  			},
  			green: {
  				'50': '#F0FDF4',
  				'100': '#DCFCE7',
  				'200': '#BBF7D0',
  				'300': '#86EFAC',
  				'400': '#4ADE80',
  				'500': '#22C55E',
  				'600': '#16A34A',
  				'700': '#15803D',
  				'800': '#166534',
  				'900': '#14532D',
  				'950': '#052E16'
  			},
  			blue: {
  				'50': '#EFF6FF',
  				'100': '#DBEAFE',
  				'200': '#BFDBFE',
  				'300': '#93C5FD',
  				'400': '#60A5FA',
  				'500': '#3B82F6',
  				'600': '#2563EB',
  				'700': '#1D4ED8',
  				'800': '#1E40AF',
  				'900': '#1E3A8A',
  				'950': '#172554'
  			}
  		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
			card: 'var(--radius-card)',
			sidebar: 'var(--radius-sidebar)',
			pill: 'var(--radius-pill)',
			roleplay: 'var(--roleplay-radius)'
		},
		fontSize: {
			'roleplay-hero': ['var(--roleplay-t-hero)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }]
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
			},
			'shimmer-border': {
				'0%': {
					backgroundPosition: '200% 0'
				},
				'100%': {
					backgroundPosition: '-200% 0'
				}
			},
			'roleplay-eq': {
				'0%, 100%': { height: '25%' },
				'50%': { height: '100%' }
			},
			'roleplay-dot': {
				'0%, 100%': { opacity: '0.35' },
				'50%': { opacity: '1' }
			},
			'ai-thinking-diamond-breathe': {
				'0%, 100%': { opacity: '0.55', transform: 'scale(0.94)' },
				'50%': { opacity: '1', transform: 'scale(1.06)' }
			},
			'ai-thinking-label-shimmer': {
				'0%': { backgroundPosition: '200% center' },
				'100%': { backgroundPosition: '-200% center' }
			},
			'ai-thinking-message-out': {
				from: { opacity: '1' },
				to: { opacity: '0' }
			},
			'ai-thinking-message-in': {
				from: { opacity: '0' },
				to: { opacity: '1' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'shimmer-border': 'shimmer-border 3s linear infinite',
			'roleplay-eq': 'roleplay-eq 1s infinite ease-in-out',
			'roleplay-dot': 'roleplay-dot 1.3s infinite',
			'ai-thinking-diamond-breathe': 'ai-thinking-diamond-breathe 2.8s ease-in-out infinite',
			'ai-thinking-label-shimmer': 'ai-thinking-label-shimmer 3.2s linear infinite',
			'ai-thinking-message-out': 'ai-thinking-message-out 220ms ease-out forwards',
			'ai-thinking-message-in': 'ai-thinking-message-in 220ms ease-out forwards'
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
