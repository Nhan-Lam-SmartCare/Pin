module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // PIN Corp Brand Colors
        pin: {
          // Primary - Electric Blue
          blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6", // PRIMARY
            600: "#2563eb", // PRIMARY HOVER
            700: "#1d4ed8", // PRIMARY ACTIVE
            800: "#1e40af",
            900: "#1e3a8a",
            950: "#172554",
          },
          // Secondary - Energy Orange
          orange: {
            400: "#fb923c",
            500: "#f97316", // SECONDARY
            600: "#ea580c", // SECONDARY HOVER
            700: "#c2410c", // SECONDARY ACTIVE
          },
          // Status Colors
          green: {
            500: "#10b981",
            600: "#059669",
          },
          red: {
            500: "#ef4444",
            600: "#dc2626",
          },
          yellow: {
            500: "#eab308",
            600: "#d97706",
          },
          // Neutral (Light Mode)
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          },
          // Dark Mode
          dark: {
            50: "#0f172a",
            100: "#1e293b",
            200: "#334155",
            300: "#475569",
            400: "#64748b",
            500: "#94a3b8",
            600: "#cbd5e1",
            700: "#e2e8f0",
            800: "#f1f5f9",
            900: "#f8fafc",
          },
        },
        // Tết 2026 Theme Colors
        tet: {
          red: {
            400: "#F87171",
            500: "#DC2626", // Đỏ may mắn
            600: "#B91C1C",
            700: "#991B1B",
          },
          gold: {
            300: "#FDE047",
            400: "#FBBF24",
            500: "#F59E0B", // Vàng kim
            600: "#D97706",
          },
          mai: {
            300: "#FEF08A",
            400: "#FACC15", // Hoa mai vàng
            500: "#EAB308",
            600: "#CA8A04",
          },
          spring: {
            400: "#34D399",
            500: "#10B981", // Xanh mùa xuân
            600: "#059669",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
        display: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.25" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.75" }],
        xl: ["1.25rem", { lineHeight: "1.75" }],
        "2xl": ["1.5rem", { lineHeight: "1.75" }],
        "3xl": ["1.875rem", { lineHeight: "1.25" }],
        "4xl": ["2.25rem", { lineHeight: "1.25" }],
        "5xl": ["3rem", { lineHeight: "1.25" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 16px rgba(0, 0, 0, 0.08)",
        strong: "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-in-out",
        "slide-up": "slideUp 300ms ease-out",
        "slide-down": "slideDown 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        // Tết 2026 animations
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "petal-fall": "petalFall 8s linear infinite",
        "petal-fall-slow": "petalFall 12s linear infinite",
        "sway": "sway 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Tết 2026 keyframes
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        petalFall: {
          "0%": { transform: "translateY(-10%) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
        toast: "1080",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
