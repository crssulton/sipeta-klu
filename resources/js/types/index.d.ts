import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export type RoleEnum = 'super_admin' | 'admin';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: RoleEnum;
    is_verified: boolean;
    is_active: boolean;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Land {
    id: number;
    kode_wilayah?: string | null;
    kecamatan?: string | null;
    kelurahan?: string | null;
    tipe_hak?: string | null;
    tahun?: number | null;
    nib?: string | null;
    penggunaan?: string | null;
    nomor_hak?: string | null;
    surat_ukur?: string | null;
    luas?: number | string | null;
    produk?: string | null;
    luas_peta?: number | string | null;
    kw?: string | null;
    pemilik_pe?: string | null;
    pemilik_ak?: string | null;
    coordinates?: string | [number, number][] | null;
    coordinate?: string | [number, number] | null;
    additional_data?: Record<string, unknown> | null;
    certificates?: Certificate[];
    created_at?: string;
    updated_at?: string;
}

export interface CustomFieldDefinition {
    id: number;
    field_key: string;
    field_label: string;
    field_type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date';
    field_options?: string[] | null;
    is_visible_in_list: boolean;
    is_visible_in_detail: boolean;
    is_required: boolean;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Certificate {
    id: number;
    land_id: number;
    nomor_sertifikat: string;
    description?: string;
    file_path: string;
    file_name: string;
    file_type: string;
    file_size: number;
    land?: Land;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
