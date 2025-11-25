# SIPETA Land Management System - Quick Start

## System Overview
A role-based land and certificate management system built with Laravel 12, React 19, and Inertia.js 2.0.

## Roles & Permissions

### Super Admin
- ✅ Manage administrator accounts (CRUD)
- ✅ Verify newly registered admins
- ✅ Activate/deactivate admins
- ✅ Change passwords
- ✅ Access land management
- ✅ Access certificate management

### Admin
- ✅ Access land management
- ✅ Access certificate management
- ✅ Change own password
- ❌ Cannot access admin management

## Quick Setup

### 1. Database Setup
```bash
# Configure .env file
DB_DATABASE=sipeta_klu
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Create super admin account
php artisan db:seed --class=SuperAdminSeeder
```

**Default Super Admin Credentials:**
- Email: `superadmin@sipeta.com`
- Password: `password`

### 2. Storage Setup
```bash
php artisan storage:link
```

### 3. Start Development Server
```bash
composer dev
```

This runs:
- Laravel server (localhost:8000)
- Queue worker
- Log viewer (pail)
- Vite dev server (HMR)

## User Flows

### New Admin Registration
1. User registers at `/register`
2. Account created with `is_verified = false`
3. User cannot login (blocked by middleware)
4. Super admin goes to "Pending Verification"
5. Super admin clicks "Verify"
6. Admin can now login and access system

### Super Admin Workflow
1. Login → Dashboard
2. **Manajemen Akun** menu appears in sidebar
   - Admin List → CRUD operations
   - Pending Verification → Verify new admins
   - Change Password
3. **Manajemen Tanah** → Manage land data
4. **Manajemen Sertifikat** → Manage certificates

### Admin Workflow
1. Login → Dashboard
2. **Manajemen Tanah** menu available
   - View all lands
   - Add/Edit/Delete land
   - Add certificates to land
   - View on map
3. **Manajemen Sertifikat** menu available
   - View all certificates
   - Upload new certificates
   - Edit/Delete certificates
4. **Change Password** link in profile menu

## Key Features

### Land Management
- Store comprehensive land data
- GeoJSON coordinate support
- View land boundaries on map
- Multiple certificates per land

### Certificate Management
- Upload PDF, JPG, PNG files (max 5MB)
- Link certificates to land parcels
- View certificates in browser
- Track certificate metadata

### Security
- Role-based access control
- Account verification system
- Active/inactive status
- Secure file storage
- CSRF protection

## File Storage
Certificates stored in: `storage/app/public/certificates/`
Accessible via: `/storage/certificates/{filename}`

## Routes Overview

### Public Routes
- `/` - Welcome page
- `/register` - Registration (creates unverified admin)
- `/login` - Login

### Authenticated Routes (Verified Users Only)
- `/dashboard` - Dashboard
- `/land` - Land management (all CRUD routes)
- `/certificate` - Certificate management (all CRUD routes)
- `/admin/change-password` - Change password

### Super Admin Only Routes
- `/admin` - Admin list
- `/admin/create` - Create admin
- `/admin/{id}/edit` - Edit admin
- `/admin/{id}` - Delete admin (DELETE)
- `/admin/pending` - Pending verifications
- `/admin/{id}/verify` - Verify admin (POST)
- `/admin/{id}/toggle-active` - Toggle active status (POST)

## Database Schema

### users
- `id`, `name`, `email`, `password`
- `role` (super_admin|admin)
- `is_verified` (boolean)
- `is_active` (boolean)
- `email_verified_at`, `created_at`, `updated_at`

### lands
- `id`
- `kode_wilayah`, `kecamatan`, `kelurahan`
- `tipe_hak`, `tahun`, `nib`, `penggunaan`
- `nomor_hak` (unique), `surat_ukur`
- `luas`, `produk`, `luas_peta`, `kw`
- `pemilik_pe`, `pemilik_ak`
- `coordinates` (JSON array of [lng, lat] pairs)
- `coordinate` (JSON single [lng, lat])
- `created_at`, `updated_at`

### certificates
- `id`, `land_id` (foreign key)
- `file_path`, `file_name`, `file_type`, `file_size`
- `created_at`, `updated_at`

## Remaining Tasks

See `IMPLEMENTATION_GUIDE.md` for detailed implementation steps:
1. ⏳ Create land form pages (create/edit)
2. ⏳ Create land map view (show)
3. ⏳ Create certificate upload forms
4. ⏳ Update sidebar navigation with role-based menus
5. ⏳ Integrate map library (Leaflet/Google Maps)
6. ⏳ Fix TypeScript import errors
7. ⏳ Add toast notifications for success/error messages
8. ⏳ Implement file preview for certificates

## Development Notes

### TypeScript
All types defined in `resources/js/types/index.d.ts`

### Forms
Use Inertia Form component with Wayfinder helpers:
```tsx
<Form {...route.store.form()}>
  {({ processing, errors }) => (
    // form fields
  )}
</Form>
```

### Styling
- Tailwind CSS v4
- shadcn/ui components (New York style)
- Use `cn()` utility for conditional classes

### Route Generation
Routes auto-generate from Laravel routes via Wayfinder.
Import from `@/routes`.

## Testing

### Test Super Admin Flow
```bash
# Login as super admin
Email: superadmin@sipeta.com
Password: password

# Navigate to:
- /admin (should see admin list)
- /admin/pending (should see pending registrations)
- /land (should see land list)
- /certificate (should see certificate list)
```

### Test Admin Flow
```bash
# Register new admin
- Go to /register
- Fill form
- Try to login (should fail - not verified)

# As super admin:
- Go to /admin/pending
- Click "Verify" on new admin

# Login as new admin:
- Should successfully login
- Should NOT see /admin routes (403)
- Should see /land and /certificate routes
```

## Troubleshooting

### Cannot Login After Registration
- Admin accounts require super admin verification
- Check `is_verified` field in database
- Use super admin to verify from "Pending Verification" page

### File Upload Errors
- Ensure storage link exists: `php artisan storage:link`
- Check file permissions on `storage/app/public`
- Verify max upload size in `php.ini` (upload_max_filesize, post_max_size)

### Routes Not Found
- Routes auto-generate via Wayfinder on Vite reload
- Clear route cache: `php artisan route:clear`
- Restart Vite dev server

### Database Errors
- Ensure MySQL is running
- Check `.env` database credentials
- Run migrations: `php artisan migrate`

## Support
For detailed implementation steps, see `IMPLEMENTATION_GUIDE.md`.

## License
Proprietary - SIPETA KLU Project
