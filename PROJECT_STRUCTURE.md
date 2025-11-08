# 📁 Cấu trúc Dự án FAP Frontend

## 🎯 Tổng quan
Dự án sử dụng **React + TypeScript + Vite + Redux Toolkit + Ant Design**

## 📂 Cấu trúc Thư mục Chi tiết

```
fap_frontend/
├── src/
│   ├── pages/              # 🎨 Các trang/views của ứng dụng
│   │   ├── admin/          # Trang quản trị viên
│   │   │   ├── classes/
│   │   │   ├── credentials/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── reports/
│   │   │   ├── roles/
│   │   │   ├── security/
│   │   │   ├── students/
│   │   │   └── teachers/
│   │   ├── Login/          # Trang đăng nhập
│   │   ├── PublicPortal/  # Portal công khai (xác thực chứng chỉ)
│   │   │   ├── AboutHelp/
│   │   │   ├── Home/
│   │   │   ├── VerificationHistory/
│   │   │   ├── VerificationPortal/
│   │   │   └── VerificationResults/
│   │   ├── StudentPortal/  # Portal học sinh
│   │   │   ├── ActivityDetail/
│   │   │   ├── AttendanceReport/
│   │   │   ├── ClassStudentList/
│   │   │   ├── CredentialDetail/
│   │   │   ├── Dashboard/
│   │   │   ├── GradeReport/
│   │   │   ├── InstructorDetail/
│   │   │   ├── MyCredentials/
│   │   │   ├── Profile/
│   │   │   ├── SharePortal/
│   │   │   └── WeeklyTimetable/
│   │   └── teacher/        # Trang giáo viên
│   │       ├── attendance/
│   │       ├── classList/
│   │       ├── dashboard/
│   │       ├── grading/
│   │       ├── results/
│   │       └── schedule/
│   │
│   ├── components/         # 🧩 Các component tái sử dụng
│   │   ├── Ctable/         # Component bảng tùy chỉnh
│   │   ├── footer/         # Footer component
│   │   ├── header/         # Header component
│   │   ├── Product/        # Components liên quan đến sản phẩm
│   │   │   ├── ProductCard/
│   │   │   └── ProductListToCategory/
│   │   └── RoleGuard/      # Component bảo vệ route theo role
│   │
│   ├── layout/             # 🎨 Layout components
│   │   ├── index.tsx       # AdminLayout chính
│   │   ├── header.tsx      # Header layout
│   │   └── siderAdmin.tsx  # Sidebar navigation
│   │
│   ├── config/             # ⚙️ Cấu hình
│   │   ├── appRoutes.tsx   # Định nghĩa routes và menu
│   │   ├── axios.ts        # Cấu hình axios
│   │   └── routes.ts       # Constants cho routes
│   │
│   ├── services/           # 🌐 API services
│   │   ├── auth/
│   │   │   └── api.service.ts
│   │   └── customer/
│   │       └── home/
│   │           └── api.ts
│   │
│   ├── redux/              # 🔄 State management
│   │   ├── features/       # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   └── cartSlice.ts
│   │   ├── RootReducer.ts
│   │   └── store.ts
│   │
│   ├── hooks/              # 🪝 Custom React hooks
│   │   ├── useBroadcastChannel.ts
│   │   ├── useRoleAccess.ts
│   │   └── useSocket.ts
│   │
│   ├── utils/               # 🛠️ Utility functions
│   │   ├── cookie.ts
│   │   ├── formatPrice.ts
│   │   └── menuUtils.ts
│   │
│   ├── constants/           # 📋 Constants
│   │   └── roles.ts         # Định nghĩa roles và permissions
│   │
│   ├── Types/               # 📝 TypeScript type definitions
│   │   ├── ActivityLog.ts
│   │   ├── CartItem.ts
│   │   ├── Class.ts
│   │   ├── Credential.ts
│   │   ├── Product.ts
│   │   ├── Role.ts
│   │   ├── Security.ts
│   │   ├── Student.ts
│   │   └── Teacher.ts
│   │
│   ├── styles/              # 🎨 Global styles
│   │   ├── _index.scss
│   │   ├── _theme-variables.scss
│   │   ├── globals.css
│   │   ├── theme.ts
│   │   └── variables.scss
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── global.scss          # Global SCSS
│   └── vite-env.d.ts         # Vite type definitions
│
├── public/                  # 📁 Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 📋 Quy tắc Đặt Tên và Tổ chức

### 1. **Pages (Trang)**
- Mỗi trang có folder riêng với tên viết thường, có dấu gạch ngang nếu cần
- Mỗi folder chứa:
  - `index.tsx` - Component chính
  - `index.scss` hoặc `[ComponentName].scss` - Styles

**Ví dụ:**
```
pages/admin/students/
  ├── index.tsx
  └── index.scss
```

### 2. **Components (Component tái sử dụng)**
- Tên folder viết hoa chữ cái đầu (PascalCase)
- Mỗi component có folder riêng
- File chính: `index.tsx`
- Styles: `[ComponentName].scss` hoặc `styles.scss`

**Ví dụ:**
```
components/Product/ProductCard/
  ├── index.tsx
  └── ProductCard.scss
```

### 3. **Services (API)**
- Tổ chức theo domain/feature
- File service: `api.service.ts` hoặc `api.ts`
- Đặt trong folder theo domain

**Ví dụ:**
```
services/auth/api.service.ts
services/customer/home/api.ts
```

### 4. **Redux**
- Slices đặt trong `redux/features/`
- Tên file: `[feature]Slice.ts`
- Store và reducer ở root của `redux/`

### 5. **Types**
- Folder: `Types/` (viết hoa chữ cái đầu)
- Mỗi entity có file riêng: `[Entity].ts`
- Tên type: PascalCase

### 6. **Hooks**
- Tên file: `use[Name].ts`
- Đặt trong `hooks/`

### 7. **Utils**
- Tên file: camelCase
- Đặt trong `utils/`

### 8. **Styles**
- SCSS variables: `styles/variables.scss`
- Theme variables: `styles/_theme-variables.scss`
- Global styles: `styles/globals.css` hoặc `global.scss`

## 🎯 Quy tắc Import

### Import từ styles:
- Từ `pages/[PageName]/[SubFolder]/[File].scss`:
  - `@use "../../../styles/variables" as *;` (3 cấp lên)

- Từ `pages/[PageName]/index.scss`:
  - `@use "../../styles/variables" as *;` (2 cấp lên)

### Import TypeScript:
- Từ `pages/[PageName]/[SubFolder]/index.tsx`:
  - Services: `../../services/...`
  - Redux: `../../redux/...`
  - Utils: `../../utils/...`
  - Types: `../../Types/...`

## 🔍 Patterns Được Sử dụng

1. **Feature-based organization** cho pages (admin, teacher, StudentPortal, PublicPortal)
2. **Component co-location**: Mỗi component có styles riêng trong cùng folder
3. **Barrel exports**: Sử dụng `index.tsx` làm entry point
4. **Type safety**: Tất cả types được định nghĩa trong `Types/`
5. **Centralized routing**: Routes được định nghĩa trong `config/appRoutes.tsx`
6. **Role-based access**: Sử dụng `RoleGuard` và `useRoleAccess` hook

## 📦 Dependencies Chính

- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.2** - Build tool
- **Ant Design 5.27.2** - UI components
- **Redux Toolkit 2.8.2** - State management
- **React Router 7.8.0** - Routing
- **Axios 1.11.0** - HTTP client
- **Sass 1.90.0** - CSS preprocessor

## 🚀 Khi Thêm Code Mới

### Thêm Page mới:
1. Tạo folder trong `pages/[role]/[page-name]/`
2. Tạo `index.tsx` và `index.scss`
3. Thêm route trong `config/appRoutes.tsx`
4. Import và sử dụng trong router

### Thêm Component mới:
1. Tạo folder trong `components/[ComponentName]/`
2. Tạo `index.tsx` và styles file
3. Export từ `index.tsx`

### Thêm Service mới:
1. Tạo folder trong `services/[domain]/`
2. Tạo `api.service.ts` hoặc `api.ts`
3. Export functions từ file

### Thêm Type mới:
1. Tạo file trong `Types/[Entity].ts`
2. Export interfaces/types

### Thêm Hook mới:
1. Tạo file trong `hooks/use[Name].ts`
2. Export hook function

---

**Lưu ý:** Tài liệu này được tạo tự động để tham khảo. Cấu trúc có thể thay đổi theo thời gian.

