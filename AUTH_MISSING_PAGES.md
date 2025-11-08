# 📋 Các Màn Hình Auth Còn Thiếu

## Tổng Quan

Backend đã có **9 API Auth**, nhưng frontend chỉ mới sử dụng **3 API** (Login, Refresh Token, Logout). Còn thiếu **6 màn hình** để sử dụng đầy đủ các API còn lại.

---

## 🎯 Danh Sách Màn Hình Cần Tạo

### 1. **Forgot Password (Quên Mật Khẩu)** ⭐ QUAN TRỌNG
**Route:** `/forgot-password`  
**Access:** Public (không cần đăng nhập)  
**APIs sử dụng:**
- `POST /api/Auth/send-otp` - Gửi OTP qua email
- `POST /api/Auth/verify-otp` - Xác thực OTP
- `POST /api/Auth/reset-password-with-otp` - Reset mật khẩu với OTP

**Workflow:**
```
Step 1: User nhập email → Gọi sendOtp API (Purpose: "PasswordReset")
   ↓
Step 2: Hiển thị form nhập OTP (6 số) → Gọi verifyOtp API
   ↓
Step 3: Nếu OTP đúng → Hiển thị form nhập mật khẩu mới
   ↓
Step 4: User nhập NewPassword + ConfirmPassword → Gọi resetPasswordWithOtp API
   ↓
Step 5: Thành công → Redirect về /login với thông báo
```

**UI Components:**
- Form nhập Email
- Form nhập OTP (6 số, có countdown timer 60s)
- Form nhập mật khẩu mới (NewPassword, ConfirmPassword)
- Button "Gửi OTP", "Xác thực OTP", "Đặt lại mật khẩu"
- Link "Quay lại đăng nhập"

**Request/Response:**
```typescript
// Step 1: Send OTP
SendOtpRequest: { email: string, purpose: "PasswordReset" }
Response: { message: "OTP sent successfully to your email" }

// Step 2: Verify OTP
VerifyOtpRequest: { email: string, code: string, purpose: "PasswordReset" }
Response: { message: "OTP verified successfully" }

// Step 3: Reset Password
ResetPasswordWithOtpRequest: {
  email: string,
  otpCode: string,
  newPassword: string,
  confirmPassword: string
}
Response: { message: "Password reset successfully" }
```

---

### 2. **Change Password (Đổi Mật Khẩu)** ⭐ QUAN TRỌNG
**Route:** `/change-password` hoặc trong Profile Settings  
**Access:** Authenticated users (cần đăng nhập)  
**APIs sử dụng:**
- `PUT /api/Auth/change-password` - Đổi mật khẩu (cần current password)

**Workflow:**
```
Step 1: User nhập Current Password
   ↓
Step 2: User nhập New Password + Confirm Password
   ↓
Step 3: Validate (NewPassword === ConfirmPassword, min 6 chars)
   ↓
Step 4: Gọi changePassword API với Authorization header
   ↓
Step 5: Thành công → Hiển thị thông báo, có thể logout và yêu cầu đăng nhập lại
```

**UI Components:**
- Form với 3 fields:
  - Current Password (password input)
  - New Password (password input với strength indicator)
  - Confirm Password (password input)
- Button "Đổi mật khẩu"
- Password strength indicator (weak/medium/strong)
- Validation messages

**Request/Response:**
```typescript
ChangePasswordRequest: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}
ChangePasswordResponse: {
  success: boolean,
  message: string,
  errors: string[]
}
```

**Lưu ý:** API này cần `Authorization: Bearer {token}` header.

---

### 3. **Register User (Đăng Ký User - Admin Only)** 🔐
**Route:** `/admin/users/register` hoặc `/admin/register-user`  
**Access:** Chỉ Admin  
**APIs sử dụng:**
- `POST /api/Auth/register` - Đăng ký 1 user

**Workflow:**
```
Step 1: Admin chọn Role (Student hoặc Teacher)
   ↓
Step 2: Hiển thị form tương ứng:
   - Student: FullName, Email, Password, StudentCode, EnrollmentDate
   - Teacher: FullName, Email, Password, TeacherCode, HireDate, Specialization, PhoneNumber
   ↓
Step 3: Validate form
   ↓
Step 4: Gọi register API với Authorization header (Admin token)
   ↓
Step 5: Thành công → Hiển thị thông tin user mới tạo, có thể gửi email welcome
```

**UI Components:**
- Radio/Select để chọn Role (Student/Teacher)
- Dynamic form fields dựa trên Role:
  - **Student fields:** StudentCode, EnrollmentDate
  - **Teacher fields:** TeacherCode, HireDate, Specialization, PhoneNumber
- Common fields: FullName, Email, Password
- Button "Đăng ký"
- Success message với thông tin user

**Request/Response:**
```typescript
RegisterUserRequest: {
  fullName: string,
  email: string,
  password: string,
  roleName: "Student" | "Teacher",
  // Student fields (optional)
  studentCode?: string,
  enrollmentDate?: Date,
  // Teacher fields (optional)
  teacherCode?: string,
  hireDate?: Date,
  specialization?: string,
  phoneNumber?: string
}
RegisterUserResponse: {
  success: boolean,
  message: string,
  userId?: Guid,
  email: string,
  roleName: string,
  errors: string[]
}
```

**Lưu ý:** 
- API này cần `Authorization: Bearer {adminToken}` header.
- Backend sẽ tự động gửi welcome email.

---

### 4. **Bulk Register (Đăng Ký Nhiều User - Admin Only)** 🔐
**Route:** `/admin/users/bulk-register` hoặc `/admin/bulk-register`  
**Access:** Chỉ Admin  
**APIs sử dụng:**
- `POST /api/Auth/register/bulk` - Đăng ký nhiều user cùng lúc

**Workflow:**
```
Step 1: Admin chọn phương thức nhập:
   - Option A: Upload CSV/Excel file
   - Option B: Nhập thủ công (thêm từng user vào list)
   ↓
Step 2: Hiển thị preview danh sách users sẽ được đăng ký
   ↓
Step 3: Validate tất cả users (email unique, required fields, etc.)
   ↓
Step 4: Gọi bulkRegister API với Authorization header
   ↓
Step 5: Hiển thị kết quả:
   - Tổng số: X users
   - Thành công: Y users
   - Thất bại: Z users
   - Chi tiết từng user (success/error message)
```

**UI Components:**
- Tab/Radio: "Upload File" hoặc "Nhập thủ công"
- **Upload File:**
  - File input (CSV/Excel)
  - Download template file
  - Preview table sau khi upload
- **Nhập thủ công:**
  - Form để thêm user (giống Register User)
  - Button "Thêm vào danh sách"
  - Table hiển thị danh sách users đã thêm
  - Button "Xóa" cho mỗi user
- Button "Đăng ký tất cả"
- Result table với columns:
  - Email
  - FullName
  - Role
  - Status (Success/Error)
  - Message

**Request/Response:**
```typescript
BulkRegisterRequest: {
  users: RegisterUserRequest[]  // Array of RegisterUserRequest
}
BulkRegisterResponse: {
  totalRequested: number,
  successCount: number,
  failureCount: number,
  results: RegisterUserResponse[]  // Array of results
}
```

**Lưu ý:**
- API này cần `Authorization: Bearer {adminToken}` header.
- Backend sẽ gửi welcome email cho từng user thành công.

---

### 5. **OTP Verification Component (Reusable)** 🔄
**Component:** Có thể tái sử dụng cho nhiều màn hình  
**APIs sử dụng:**
- `POST /api/Auth/send-otp`
- `POST /api/Auth/verify-otp`

**Use Cases:**
- Forgot Password (Purpose: "PasswordReset")
- Email Verification (Purpose: "Registration") - nếu có tính năng này
- Two-Factor Authentication (2FA) - nếu có tính năng này

**UI Components:**
- Input field cho OTP (6 số)
- Countdown timer (60 giây)
- Button "Gửi lại OTP"
- Button "Xác thực"

---

### 6. **Profile Settings Page (Cập nhật)** 📝
**Route:** `/profile/settings` hoặc trong Profile page hiện tại  
**Access:** Authenticated users  
**APIs sử dụng:**
- `PUT /api/Auth/change-password` - Đổi mật khẩu

**Workflow:**
```
User vào Profile Settings
   ↓
Có tab/section "Security" hoặc "Change Password"
   ↓
Click vào → Hiển thị form Change Password (giống màn hình #2)
   ↓
User đổi mật khẩu → Gọi API
```

**Lưu ý:** Có thể tích hợp Change Password vào Profile page hiện có thay vì tạo màn hình riêng.

---

## 📊 Tổng Kết

| # | Màn Hình | Route | Access | APIs | Priority |
|---|----------|-------|--------|------|----------|
| 1 | Forgot Password | `/forgot-password` | Public | sendOtp, verifyOtp, resetPasswordWithOtp | ⭐⭐⭐ HIGH |
| 2 | Change Password | `/change-password` hoặc trong Profile | Authenticated | changePassword | ⭐⭐⭐ HIGH |
| 3 | Register User | `/admin/users/register` | Admin | register | ⭐⭐ MEDIUM |
| 4 | Bulk Register | `/admin/users/bulk-register` | Admin | bulkRegister | ⭐⭐ MEDIUM |
| 5 | OTP Component | Reusable | - | sendOtp, verifyOtp | ⭐ LOW |
| 6 | Profile Settings | `/profile/settings` | Authenticated | changePassword | ⭐ LOW |

---

## 🎨 UI/UX Recommendations

### Forgot Password Flow:
1. **Step 1 - Email Input:**
   - Clean form với email input
   - Button "Gửi mã OTP"
   - Link "Quay lại đăng nhập"

2. **Step 2 - OTP Verification:**
   - 6 input boxes cho OTP code
   - Auto-focus next box khi nhập
   - Countdown timer: "Gửi lại mã sau 60s"
   - Button "Xác thực"

3. **Step 3 - New Password:**
   - Password input với strength indicator
   - Confirm password input
   - Button "Đặt lại mật khẩu"
   - Success message → Auto redirect to login

### Change Password:
- Modal hoặc Page với form
- Show password strength
- Confirm before submit
- Success toast → Option to logout

### Register User (Admin):
- Wizard-style hoặc Single form với conditional fields
- Role selector → Show/hide fields
- Validation real-time
- Success message với user info

### Bulk Register:
- Upload file với drag & drop
- Preview table với validation status
- Progress bar khi processing
- Result table với expandable rows for errors

---

## 🔗 Links & Navigation

### Thêm vào Login Page:
- Link "Quên mật khẩu?" dưới form login

### Thêm vào Admin Menu:
- "Quản lý Users" → "Đăng ký User"
- "Quản lý Users" → "Đăng ký hàng loạt"

### Thêm vào Profile/Header:
- Dropdown menu → "Đổi mật khẩu"
- Hoặc trong Profile page → Tab "Security"

---

## ✅ Checklist Implementation

### Phase 1 (High Priority):
- [ ] Forgot Password page
- [ ] Change Password page/component
- [ ] Update Login page với link "Quên mật khẩu"
- [ ] Update Profile page với "Đổi mật khẩu"

### Phase 2 (Medium Priority):
- [ ] Register User page (Admin)
- [ ] Bulk Register page (Admin)
- [ ] Update Admin menu

### Phase 3 (Nice to have):
- [ ] Reusable OTP Component
- [ ] Email verification flow (nếu cần)
- [ ] 2FA flow (nếu cần)

---

## 📝 Notes

1. **OTP Purpose Values:**
   - `"PasswordReset"` - Cho forgot password
   - `"Registration"` - Cho email verification (nếu có)

2. **Password Requirements:**
   - Minimum 6 characters (theo backend validation)

3. **Role Names:**
   - Backend sử dụng: `"Student"`, `"Teacher"`, `"Admin"`
   - Frontend cần map đúng với backend

4. **Error Handling:**
   - Tất cả APIs đều trả về `message` trong response
   - Hiển thị error messages rõ ràng cho user

5. **Security:**
   - Change Password và Register APIs cần Authorization header
   - OTP có thời gian hết hạn (check backend config)

