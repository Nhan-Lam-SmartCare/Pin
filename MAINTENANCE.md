# PIN Corp - Hướng dẫn Bảo trì

## 📁 Cấu trúc Thư mục

```
Pin/
├── components/              # React components
│   ├── MaterialManager/     # Modular MaterialManager
│   │   ├── index.ts         # Public exports
│   │   ├── types.ts         # Local types
│   │   ├── utils.ts         # Utility functions
│   │   ├── useMaterialData.ts    # Data hook
│   │   └── useMaterialModals.ts  # Modal state hook
│   ├── common/              # Shared components
│   └── *.tsx                # Feature components
├── contexts/                # React contexts
├── lib/
│   ├── hooks/               # Custom hooks
│   ├── services/            # Business logic services
│   └── utils/               # Utility functions
├── types/                   # TypeScript types (modular)
│   ├── index.ts             # Re-exports all
│   ├── user.ts              # User/Permission types
│   ├── pin.ts               # PIN Corp types
│   ├── financial.ts         # Financial types
│   ├── audit.ts             # Audit types
│   ├── analytics.ts         # Analytics types
│   └── common.ts            # Common types
└── types.ts                 # Legacy types (backward compat)
```

## 🛠️ Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

## 📝 Coding Standards

### TypeScript
- Tránh sử dụng `any` - dùng proper types
- Sử dụng interface cho object shapes
- Export types từ `types/` folder

### Components
- Mỗi component < 300 dòng
- Tách logic vào custom hooks
- Đặt trong folder nếu có nhiều sub-components

### Naming Conventions
- Components: PascalCase (`MaterialManager.tsx`)
- Hooks: camelCase với prefix `use` (`useMaterialData.ts`)
- Utils: camelCase (`formatCurrency.ts`)
- Types: PascalCase (`PinMaterial`)

## 🔧 Maintenance Tasks

### Thêm Component Mới
1. Tạo file trong `components/`
2. Nếu lớn, tạo folder với `index.ts`
3. Export từ `index.ts`

### Thêm Type Mới
1. Thêm vào file phù hợp trong `types/`
2. Re-export từ `types/index.ts`
3. Backward compat: cũng thêm vào `types.ts` nếu cần

### Refactor Large Component
1. Tách state logic vào custom hooks
2. Tách UI sections thành sub-components
3. Đặt trong folder riêng

## ⚠️ Technical Debt

### Cần Cải Thiện
- [ ] MaterialManager.tsx vẫn lớn (~4000 dòng) - cần tách tiếp
- [ ] Còn nhiều `any` types trong services
- [ ] Chưa có unit tests

### Đã Hoàn Thành
- [x] Tách types thành modules
- [x] Xóa duplicate files (*New.tsx)
- [x] Setup ESLint + Prettier
- [x] Tạo hooks cho MaterialManager
