/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-surface": "var(--bg-surface)",
        "accent-amber": "var(--accent-amber)",
        "accent-teal": "var(--accent-teal)",
        "danger": "var(--danger)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "border-color": "var(--border)",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      keyframes: {
        slideRight: {
          "0%": { transform: "translateX(40px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(-40px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        pulseAmber: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 166, 35, 0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(245, 166, 35, 0)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawArc: {
          "0%": { strokeDashoffset: "var(--arc-length)" },
          "100%": { strokeDashoffset: "var(--arc-final)" },
        },
      },
      animation: {
        "slide-right": "slideRight 0.4s ease-out",
        "slide-left": "slideLeft 0.4s ease-out",
        "pulse-amber": "pulseAmber 1.6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
