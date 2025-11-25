# SIPETA Land Management System - Implementation Guide

## Overview
This system implements a role-based land and certificate management system with:
- **Super Admin**: Full access to all features including admin management
- **Admin**: Access to land and certificate management only
- User registration requires super admin verification before access

## ✅ Completed Backend Setup

### 1. Database Schema
Created migrations for:
- **users table** additions: `role`, `is_verified`, `is_active`
- **lands table**: All land data fields including coordinates
- **certificates table**: File management with land relationship

Run migrations:
```bash
php artisan migrate
```

### 2. Models
- **User**: Added role enum, verification, and helper methods
- **Land**: Fillable fields, JSON casting for coordinates, relationships
- **Certificate**: File attributes, land relationship

### 3. Enums
- **RoleEnum**: `super_admin`, `admin` with label methods

### 4. Middleware
- **EnsureUserIsVerified**: Checks if user is verified and active
- **EnsureUserIsSuperAdmin**: Restricts super admin routes
- Registered as `verified` and `super_admin` aliases

### 5. Controllers

#### AdminController
- `index()`: List all admins
- `create()`, `store()`: Create new admin (super admin only)
- `edit()`, `update()`: Edit admin
- `destroy()`: Delete admin
- `pending()`: List unverified admins
- `verify()`: Verify pending admin
- `toggleActive()`: Activate/deactivate admin
- `changePassword()`, `updatePassword()`: Change password (all users)

#### LandController (Resource)
- Full CRUD for land data
- Validation for all fields including coordinates
- Relationship loading for certificates

#### CertificateController (Resource)
- Full CRUD for certificates
- File upload handling (jpg, jpeg, png, pdf, max 5MB)
- Storage in `storage/app/public/certificates`
- File deletion on update/destroy

### 6. Routes
All routes in `routes/web.php`:
- `/admin/*` - Super admin only (admin management)
- `/admin/change-password` - All authenticated users
- `/land/*` - All verified users (resource routes)
- `/certificate/*` - All verified users (resource routes)

### 7. Authentication
Updated `CreateNewUser` action:
- Default role: `admin`
- `is_verified`: `false` (requires super admin approval)
- `is_active`: `true`

## ✅ Completed Frontend Setup

### 1. TypeScript Types
Updated `resources/js/types/index.d.ts`:
- `RoleEnum` type
- `User` interface with role fields
- `Land` interface with all fields
- `Certificate` interface
- `PaginatedData<T>` generic type

### 2. Admin Management Pages
Created in `resources/js/pages/admin/`:
- **index.tsx**: Admin list with role badges, status indicators, edit/delete actions
- **create.tsx**: Create admin form with role selection
- **edit.tsx**: Edit admin form
- **pending.tsx**: Pending verification list with verify action
- **change-password.tsx**: Change password form

### 3. Land Management Pages
Created in `resources/js/pages/land/`:
- **index.tsx**: Land list with pagination, add certificate button, view on map, edit/delete

### 4. Certificate Management Pages
Created in `resources/js/pages/certificate/`:
- **index.tsx**: Certificate list showing land details, view/map/edit/delete actions

## 🚧 Remaining Implementation Tasks

### 1. Fix Import Issues
Update import statements in created pages:
```tsx
// Change from:
import { InputError } from '@/components/input-error';
// To:
import InputError from '@/components/input-error';
```

### 2. Generate Routes
After fixing TypeScript errors, routes will auto-generate. Currently using hardcoded paths, which should be replaced with:
```tsx
import { admin, land, certificate } from '@/routes';
```

### 3. Create Missing Frontend Pages

#### Land Pages
- **create.tsx**: Form with all land fields
  - Text inputs for basic info
  - Coordinate array input (JSON or map picker)
  - Validation for all required fields
  
- **edit.tsx**: Similar to create with pre-filled data
  
- **show.tsx**: View land on map
  - Display land details
  - Show boundary polygon from coordinates
  - List certificates
  - Use Leaflet or Google Maps

#### Certificate Pages
- **create.tsx**: Upload certificate form
  - Land selection dropdown
  - File upload input (jpg, jpeg, png, pdf max 5MB)
  - Preview selected land info
  
- **edit.tsx**: Update certificate
  - Change land association
  - Replace file (optional)
  - Show current file info

### 4. Update Navigation/Sidebar
Modify `resources/js/components/app-shell.tsx` or navigation component:
```tsx
const navigation = useMemo(() => {
    const items = [];
    
    // All verified users see these
    items.push(
        {
            title: 'Manajemen Tanah',
            href: '/land',
            icon: MapIcon,
        },
        {
            title: 'Manajemen Sertifikat',
            href: '/certificate',
            icon: FileTextIcon,
        }
    );
    
    // Super admin only
    if (user.role === 'super_admin') {
        items.unshift({
            title: 'Manajemen Akun',
            items: [
                { title: 'Admin List', href: '/admin' },
                { title: 'Pending Verification', href: '/admin/pending' },
                { title: 'Change Password', href: '/admin/change-password' },
            ],
        });
    } else {
        items.push({
            title: 'Change Password',
            href: '/admin/change-password',
            icon: KeyIcon,
        });
    }
    
    return items;
}, [user.role]);
```

### 5. Add Table Component
If not exists, install/generate shadcn table:
```bash
npx shadcn@latest add table
```

### 6. Create Initial Super Admin
Create a seeder or artisan command:
```php
// database/seeders/SuperAdminSeeder.php
<?php
namespace Database\Seeders;

use App\Models\User;
use App\RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@sipeta.com',
            'password' => Hash::make('password'),
            'role' => RoleEnum::SUPER_ADMIN,
            'is_verified' => true,
            'is_active' => true,
        ]);
    }
}
```

Run:
```bash
php artisan db:seed --class=SuperAdminSeeder
```

### 7. Configure Storage Link
For certificate file access:
```bash
php artisan storage:link
```

### 8. Update .env
Ensure database is configured:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sipeta_klu
DB_USERNAME=root
DB_PASSWORD=
```

### 9. Map Integration
For land visualization, install a map library:
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

Example usage in `land/show.tsx`:
```tsx
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';

<MapContainer center={land.coordinate} zoom={15}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Polygon positions={land.coordinates} />
</MapContainer>
```

### 10. File Upload Preview
Add file size and type validation feedback in certificate forms.

## Testing Checklist

### Super Admin Flow
- [ ] Login as super admin
- [ ] View all admins in admin list
- [ ] Create new admin account
- [ ] Edit existing admin
- [ ] View pending verifications
- [ ] Verify pending admin
- [ ] Deactivate/activate admin
- [ ] Delete admin
- [ ] Access land management
- [ ] Access certificate management
- [ ] Change own password

### Admin Flow
- [ ] Register new account (becomes unverified admin)
- [ ] Login fails (not verified)
- [ ] Super admin verifies account
- [ ] Login successful
- [ ] Cannot access admin management routes
- [ ] Access land management
- [ ] Create/edit/delete land
- [ ] Access certificate management
- [ ] Upload/edit/delete certificates
- [ ] View certificate files
- [ ] View land on map
- [ ] Change own password

### Security Tests
- [ ] Unverified user cannot login
- [ ] Admin cannot access super admin routes
- [ ] Certificate file storage is secure
- [ ] File upload validates type and size
- [ ] CSRF protection on all forms
- [ ] Password confirmation required

## Database Example Data

Example land data entry:
```json
{
    "kode_wilayah": "23100305",
    "kecamatan": "GANGGA",
    "kelurahan": "SAMBIK BANGKOL",
    "tipe_hak": "Hak Pakai",
    "tahun": 2021,
    "nib": "01830",
    "penggunaan": "Kosong",
    "nomor_hak": "23.10.03.05.4.00012",
    "surat_ukur": "SU.01815/SAMBIK BANGKOL/2021",
    "luas": 2479,
    "produk": "BMN",
    "luas_peta": 2989,
    "kw": "KW1",
    "pemilik_pe": "BAMBANG WIJAYA PUTRA",
    "pemilik_ak": "BAMBANG WIJAYA PUTRA",
    "coordinates": [
        [116.243100355734, -8.27804586699235],
        [116.243755280032, -8.27763318680566],
        // ... more coordinates
    ],
    "coordinate": [116.243100355734, -8.27804586699235]
}
```

## File Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AdminController.php
│   │   ├── LandController.php
│   │   └── CertificateController.php
│   └── Middleware/
│       ├── EnsureUserIsVerified.php
│       └── EnsureUserIsSuperAdmin.php
├── Models/
│   ├── User.php (updated)
│   ├── Land.php
│   └── Certificate.php
└── RoleEnum.php

database/
└── migrations/
    ├── 2025_11_18_162608_add_role_and_verification_to_users_table.php
    ├── 2025_11_18_162622_create_lands_table.php
    └── 2025_11_18_162633_create_certificates_table.php

resources/js/
├── pages/
│   ├── admin/
│   │   ├── index.tsx ✅
│   │   ├── create.tsx ✅
│   │   ├── edit.tsx ✅
│   │   ├── pending.tsx ✅
│   │   └── change-password.tsx ✅
│   ├── land/
│   │   ├── index.tsx ✅
│   │   ├── create.tsx ⏳
│   │   ├── edit.tsx ⏳
│   │   └── show.tsx ⏳ (map view)
│   └── certificate/
│       ├── index.tsx ✅
│       ├── create.tsx ⏳
│       └── edit.tsx ⏳
└── types/
    └── index.d.ts (updated) ✅
```

## Next Steps Priority

1. **Setup database** and run migrations
2. **Create super admin seeder** and run it
3. **Fix TypeScript import errors** in created pages
4. **Create missing form pages** (land/certificate create/edit)
5. **Implement map view** for land visualization
6. **Update navigation/sidebar** with role-based menu
7. **Test complete user flows** for both roles
8. **Add file preview** for certificates
9. **Implement error handling** and user feedback
10. **Security audit** and testing

## API Endpoints Reference

### Admin Management (Super Admin Only)
- `GET /admin` - List admins
- `GET /admin/create` - Create form
- `POST /admin` - Store admin
- `GET /admin/{id}/edit` - Edit form
- `PUT /admin/{id}` - Update admin
- `DELETE /admin/{id}` - Delete admin
- `GET /admin/pending` - Pending verifications
- `POST /admin/{id}/verify` - Verify admin
- `POST /admin/{id}/toggle-active` - Toggle active status

### Password (All Users)
- `GET /admin/change-password` - Change password form
- `PUT /admin/change-password` - Update password

### Land Management (All Verified Users)
- `GET /land` - List lands (paginated)
- `GET /land/create` - Create form
- `POST /land` - Store land
- `GET /land/{id}` - Show land (map view)
- `GET /land/{id}/edit` - Edit form
- `PUT /land/{id}` - Update land
- `DELETE /land/{id}` - Delete land

### Certificate Management (All Verified Users)
- `GET /certificate` - List certificates (paginated)
- `GET /certificate/create` - Upload form
- `POST /certificate` - Upload certificate (multipart/form-data)
- `GET /certificate/{id}` - View certificate file
- `GET /certificate/{id}/edit` - Edit form
- `PUT /certificate/{id}` - Update certificate
- `DELETE /certificate/{id}` - Delete certificate

## Notes
- All forms use Inertia.js Form component with CSRF protection
- File uploads are stored in `storage/app/public/certificates`
- Coordinates stored as JSON arrays in database
- Pagination set to 20 items per page
- Status messages handled via Inertia flash messages
