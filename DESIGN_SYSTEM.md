# KẾ HOẠCH THIẾT KẾ GIAO DIỆN TOÀN DIỆN - PIN CORP

## Design System Documentation v1.0

---

## 🎨 1. PHÂN TÍCH MÀU SẮC THƯƠNG HIỆU

### Logo hiện tại: "PIN Corp"

- **Tên:** PIN Corp (có thể là viết tắt của điều gì đó liên quan đến Pin/Battery)
- **Ngành:** Sản xuất và kinh doanh linh kiện điện tử, pin

### Màu sắc chủ đạo được đề xuất:

#### **Primary Colors (Màu chính)**

```css
--pin-blue-50: #eff6ff; /* Background light */
--pin-blue-100: #dbeafe; /* Background hover */
--pin-blue-200: #bfdbfe; /* Border light */
--pin-blue-300: #93c5fd; /* Border */
--pin-blue-400: #60a5fa; /* Interactive light */
--pin-blue-500: #3b82f6; /* PRIMARY - Electric Blue */
--pin-blue-600: #2563eb; /* PRIMARY HOVER */
--pin-blue-700: #1d4ed8; /* PRIMARY ACTIVE */
--pin-blue-800: #1e40af; /* Text on light */
--pin-blue-900: #1e3a8a; /* Text dark */
--pin-blue-950: #172554; /* Text darkest */
```

#### **Secondary Colors (Màu phụ - Energy/Power theme)**

```css
--pin-orange-400: #fb923c; /* Warning light */
--pin-orange-500: #f97316; /* SECONDARY - Energy Orange */
--pin-orange-600: #ea580c; /* SECONDARY HOVER */
--pin-orange-700: #c2410c; /* SECONDARY ACTIVE */
```

#### **Success/Status Colors**

```css
--pin-green-500: #10b981; /* Success */
--pin-green-600: #059669; /* Success hover */
--pin-red-500: #ef4444; /* Error */
--pin-red-600: #dc2626; /* Error hover */
--pin-yellow-500: #eab308; /* Warning */
--pin-amber-600: #d97706; /* Warning hover */
```

#### **Neutral Colors (Light Mode)**

```css
--pin-gray-50: #f9fafb; /* Background */
--pin-gray-100: #f3f4f6; /* Background secondary */
--pin-gray-200: #e5e7eb; /* Border */
--pin-gray-300: #d1d5db; /* Border hover */
--pin-gray-400: #9ca3af; /* Text disabled */
--pin-gray-500: #6b7280; /* Text secondary */
--pin-gray-600: #4b5563; /* Text primary */
--pin-gray-700: #374151; /* Text heading */
--pin-gray-800: #1f2937; /* Text strong */
--pin-gray-900: #111827; /* Text strongest */
```

#### **Dark Mode Colors**

```css
--pin-dark-50: #0f172a; /* Background darkest */
--pin-dark-100: #1e293b; /* Background dark */
--pin-dark-200: #334155; /* Background card */
--pin-dark-300: #475569; /* Border */
--pin-dark-400: #64748b; /* Border hover */
--pin-dark-500: #94a3b8; /* Text secondary */
--pin-dark-600: #cbd5e1; /* Text primary */
--pin-dark-700: #e2e8f0; /* Text heading */
--pin-dark-800: #f1f5f9; /* Text strong */
--pin-dark-900: #f8fafc; /* Text strongest */
```

---

## 📐 2. TYPOGRAPHY SYSTEM (Hệ thống chữ)

### Font Family

```css
--font-primary: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI",
  system-ui, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
--font-display: "Inter", sans-serif;
```

### Font Sizes & Line Heights

```css
--text-xs: 0.75rem; /* 12px - Labels, captions */
--text-sm: 0.875rem; /* 14px - Body small */
--text-base: 1rem; /* 16px - Body */
--text-lg: 1.125rem; /* 18px - Lead text */
--text-xl: 1.25rem; /* 20px - H4 */
--text-2xl: 1.5rem; /* 24px - H3 */
--text-3xl: 1.875rem; /* 30px - H2 */
--text-4xl: 2.25rem; /* 36px - H1 */
--text-5xl: 3rem; /* 48px - Hero */

--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

---

## 🎯 3. SPACING SYSTEM (Hệ thống khoảng cách)

### Scale (4px base)

```css
--space-0: 0;
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### Component-specific spacing

```css
--padding-card: var(--space-6);
--padding-modal: var(--space-8);
--padding-section: var(--space-12);
--gap-items: var(--space-4);
--gap-sections: var(--space-8);
```

---

## 🔲 4. LAYOUT SYSTEM

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
--container-full: 100%;
```

### Grid System

```css
--grid-cols-1: repeat(1, minmax(0, 1fr));
--grid-cols-2: repeat(2, minmax(0, 1fr));
--grid-cols-3: repeat(3, minmax(0, 1fr));
--grid-cols-4: repeat(4, minmax(0, 1fr));
--grid-cols-6: repeat(6, minmax(0, 1fr));
--grid-cols-12: repeat(12, minmax(0, 1fr));
```

### Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

---

## 🎨 5. COMPONENT DESIGN PATTERNS

### A. Button Styles

#### Primary Button

```tsx
className="
  px-6 py-3
  bg-pin-blue-500 hover:bg-pin-blue-600 active:bg-pin-blue-700
  text-white font-medium
  rounded-lg
  shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-pin-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
"
```

#### Secondary Button

```tsx
className="
  px-6 py-3
  bg-white hover:bg-pin-gray-50 dark:bg-pin-dark-200 dark:hover:bg-pin-dark-300
  text-pin-gray-700 dark:text-pin-dark-700
  border border-pin-gray-300 dark:border-pin-dark-400
  font-medium rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-pin-blue-500
"
```

#### Danger Button

```tsx
className="
  px-6 py-3
  bg-pin-red-500 hover:bg-pin-red-600
  text-white font-medium
  rounded-lg shadow-sm
  transition-all duration-200
"
```

### B. Card Styles

#### Standard Card

```tsx
className="
  bg-white dark:bg-pin-dark-200
  rounded-xl
  shadow-sm hover:shadow-md
  border border-pin-gray-200 dark:border-pin-dark-300
  transition-all duration-200
  overflow-hidden
"
```

#### Stats Card

```tsx
className="
  bg-gradient-to-br from-pin-blue-500 to-pin-blue-600
  text-white
  rounded-xl p-6
  shadow-lg
  relative overflow-hidden
"
// Add decorative element:
<div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
```

### C. Input Fields

```tsx
className="
  w-full px-4 py-2.5
  bg-white dark:bg-pin-dark-200
  border border-pin-gray-300 dark:border-pin-dark-400
  rounded-lg
  text-pin-gray-900 dark:text-pin-dark-900
  placeholder:text-pin-gray-400 dark:placeholder:text-pin-dark-500
  focus:outline-none focus:ring-2 focus:ring-pin-blue-500 focus:border-transparent
  transition-all duration-200
  disabled:bg-pin-gray-100 disabled:cursor-not-allowed
"
```

### D. Modal/Dialog

```tsx
// Backdrop
className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal-backdrop"

// Modal Container
className="
  fixed inset-0 z-modal
  flex items-center justify-center p-4
  overflow-y-auto
"

// Modal Content
className="
  bg-white dark:bg-pin-dark-200
  rounded-2xl
  shadow-2xl
  max-w-2xl w-full
  max-h-[90vh]
  overflow-hidden
  transform transition-all
"
```

### E. Table Styles

```tsx
// Table Container
className="overflow-x-auto rounded-lg border border-pin-gray-200 dark:border-pin-dark-300"

// Table
className="w-full"

// Table Header
className="
  bg-pin-gray-50 dark:bg-pin-dark-100
  border-b border-pin-gray-200 dark:border-pin-dark-300
"

// Table Header Cell
className="
  px-6 py-4
  text-left text-xs font-semibold
  text-pin-gray-600 dark:text-pin-dark-600
  uppercase tracking-wider
"

// Table Row
className="
  border-b border-pin-gray-200 dark:border-pin-dark-300
  hover:bg-pin-gray-50 dark:hover:bg-pin-dark-100
  transition-colors duration-150
"

// Table Cell
className="px-6 py-4 text-sm text-pin-gray-900 dark:text-pin-dark-900"
```

---

## 🎭 6. ANIMATION & TRANSITIONS

### Transition Utilities

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
--transition-slower: 500ms ease-in-out;
```

### Common Animations

```tsx
// Fade in
className = "animate-in fade-in duration-200";

// Slide in from top
className = "animate-in slide-in-from-top-4 duration-300";

// Scale in
className = "animate-in zoom-in-95 duration-200";

// Spin (loading)
className = "animate-spin";
```

---

## 📱 7. RESPONSIVE BREAKPOINTS

```css
--breakpoint-sm: 640px; /* Mobile landscape */
--breakpoint-md: 768px; /* Tablet */
--breakpoint-lg: 1024px; /* Desktop */
--breakpoint-xl: 1280px; /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Usage Example

```tsx
className="
  grid grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
"
```

---

## 🎨 8. ICON SYSTEM

### Icon Sizes

```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-base: 24px;
--icon-lg: 32px;
--icon-xl: 48px;
```

### Icon Colors

```tsx
// Primary action
className = "w-5 h-5 text-pin-blue-500";

// Secondary/Muted
className = "w-5 h-5 text-pin-gray-400 dark:text-pin-dark-500";

// Success
className = "w-5 h-5 text-pin-green-500";

// Error
className = "w-5 h-5 text-pin-red-500";
```

---

## 🎯 9. STATUS & BADGE SYSTEM

### Status Colors

```tsx
// Active/Success
className =
  "bg-pin-green-100 text-pin-green-800 dark:bg-pin-green-900/30 dark:text-pin-green-400";

// Warning
className =
  "bg-pin-yellow-100 text-pin-yellow-800 dark:bg-pin-yellow-900/30 dark:text-pin-yellow-400";

// Error/Danger
className =
  "bg-pin-red-100 text-pin-red-800 dark:bg-pin-red-900/30 dark:text-pin-red-400";

// Info
className =
  "bg-pin-blue-100 text-pin-blue-800 dark:bg-pin-blue-900/30 dark:text-pin-blue-400";

// Neutral
className =
  "bg-pin-gray-100 text-pin-gray-800 dark:bg-pin-dark-300 dark:text-pin-dark-700";
```

### Badge Component

```tsx
className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-xs font-medium
  [status-color-classes]
"
```

---

## 📊 10. DASHBOARD LAYOUT STRUCTURE

### Sidebar Navigation (Desktop)

```tsx
<aside
  className="
  w-64 h-screen
  bg-white dark:bg-pin-dark-200
  border-r border-pin-gray-200 dark:border-pin-dark-300
  fixed left-0 top-0
  overflow-y-auto
"
>
  {/* Logo */}
  <div className="h-16 flex items-center px-6 border-b border-pin-gray-200 dark:border-pin-dark-300">
    <Logo />
  </div>

  {/* Navigation */}
  <nav className="p-4 space-y-1">{/* Nav items */}</nav>
</aside>
```

### Top Header

```tsx
<header
  className="
  h-16
  bg-white dark:bg-pin-dark-200
  border-b border-pin-gray-200 dark:border-pin-dark-300
  fixed top-0 right-0 left-64
  z-fixed
  px-6
  flex items-center justify-between
"
>
  {/* Search, notifications, profile */}
</header>
```

### Main Content Area

```tsx
<main
  className="
  ml-64 mt-16
  min-h-screen
  bg-pin-gray-50 dark:bg-pin-dark-50
  p-6
"
>
  {/* Page content */}
</main>
```

---

## 🎨 11. GRADIENT SYSTEM

### Background Gradients

```tsx
// Primary gradient
className = "bg-gradient-to-br from-pin-blue-500 to-pin-blue-600";

// Secondary gradient
className = "bg-gradient-to-br from-pin-orange-500 to-pin-orange-600";

// Success gradient
className = "bg-gradient-to-br from-pin-green-500 to-pin-green-600";

// Subtle gradient (cards)
className =
  "bg-gradient-to-br from-white to-pin-gray-50 dark:from-pin-dark-200 dark:to-pin-dark-100";
```

---

## 📋 12. FORM PATTERNS

### Form Group

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-pin-gray-700 dark:text-pin-dark-700">
    Label Text
  </label>
  <input className="[input-classes]" />
  <p className="text-xs text-pin-gray-500 dark:text-pin-dark-500">
    Helper text
  </p>
</div>
```

### Error State

```tsx
<input className="
  border-pin-red-500
  focus:ring-pin-red-500
" />
<p className="text-xs text-pin-red-600 dark:text-pin-red-400 mt-1">
  Error message
</p>
```

---

## 🎯 13. IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1)

1. Update Tailwind config với color system mới
2. Tạo CSS variables file
3. Update typography system
4. Tạo base component library (Button, Input, Card)

### Phase 2: Core Components (Week 2)

1. Redesign Navigation/Sidebar
2. Update Header/TopBar
3. Redesign Modal/Dialog components
4. Update Table components

### Phase 3: Feature Pages (Week 2-3)

1. Dashboard/Reports
2. Sales (Bán hàng)
3. Materials/Products (Vật liệu/Sản phẩm)
4. Production (Sản xuất)
5. Financial (Tài chính)

### Phase 4: Polish & Optimization (Week 3-4)

1. Dark mode refinements
2. Animation polish
3. Responsive optimization
4. Performance optimization
5. Accessibility improvements

---

## 📚 14. COMPONENT LIBRARY STRUCTURE

```
components/
├── ui/               # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── Select.tsx
│   └── ...
├── layout/          # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Container.tsx
│   └── ...
├── feature/         # Feature-specific
│   ├── SalesCard.tsx
│   ├── ProductCard.tsx
│   └── ...
└── common/          # Shared components
    ├── Logo.tsx
    ├── Icons.tsx
    └── ...
```

---

## 🎨 15. DARK MODE STRATEGY

### Toggle Implementation

```tsx
// In app root or theme provider
const [theme, setTheme] = useState<"light" | "dark">("light");

useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [theme]);
```

### Component Pattern

```tsx
// Always include dark mode classes
className="
  bg-white dark:bg-pin-dark-200
  text-pin-gray-900 dark:text-pin-dark-900
  border-pin-gray-200 dark:border-pin-dark-300
"
```

---

## ✅ KẾT LUẬN

Design system này cung cấp:

- ✅ Màu sắc nhất quán dựa trên thương hiệu PIN Corp (Electric Blue + Energy Orange)
- ✅ Typography rõ ràng, dễ đọc
- ✅ Spacing system khoa học (4px base)
- ✅ Component patterns có thể tái sử dụng
- ✅ Dark mode hoàn chỉnh
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Animation & transitions mượt mà

**Màu chủ đạo:**

- **Primary:** Electric Blue (#3b82f6) - Tượng trưng cho công nghệ, điện năng
- **Secondary:** Energy Orange (#f97316) - Tượng trưng cho năng lượng, sức mạnh
- **Success:** Green (#10b981)
- **Background:** Clean white/gray với dark mode slate

Hệ thống này đảm bảo:

1. **Nhất quán** - Tất cả components sử dụng cùng design tokens
2. **Khoa học** - Spacing/typography theo quy tắc rõ ràng
3. **Modern** - Gradients, shadows, transitions mượt mà
4. **Professional** - Phù hợp với doanh nghiệp sản xuất/kinh doanh
