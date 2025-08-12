/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220 60% 50%)',
        accent: 'hsl(180 70% 45%)',
        bg: 'hsl(225 20% 15%)',
        surface: 'hsl(220 20% 20%)',
        text: 'hsl(0 0% 95%)',
        muted: 'hsl(0 0% 70%)',
      },
      spacing: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0,0%,0%,0.1)',
        modal: '0 8px 28px hsla(0,0%,0%,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 200ms ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'card-flip': 'cardFlip 600ms ease-in-out',
        'bounce-in': 'bounceIn 400ms ease-out',
      },
    },
  },
  plugins: [],
}
