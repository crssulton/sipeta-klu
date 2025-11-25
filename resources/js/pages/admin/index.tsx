import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Edit,
    Key,
    Plus,
    Power,
    PowerOff,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
}

interface Props {
    admins: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
    [key: string]: unknown;
}

export default function AdminIndex() {
    const { admins, filters } = usePage<Props>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        description: string;
        action: () => void;
        variant?: 'default' | 'destructive';
    }>({
        open: false,
        title: '',
        description: '',
        action: () => {},
        variant: 'default',
    });

    const handleFilter = () => {
        router.get(
            '/admin',
            { search, status: status === 'all' ? '' : status },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleVerify = (userId: number) => {
        setConfirmDialog({
            open: true,
            title: 'Verifikasi User',
            description:
                'Apakah Anda yakin ingin memverifikasi dan mengaktifkan user ini?',
            action: () => {
                router.post(
                    `/admin/${userId}/verify`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            router.reload();
                        },
                    },
                );
            },
        });
    };

    const handleToggleActive = (userId: number, isActive: boolean) => {
        const action = isActive ? 'nonaktifkan' : 'aktifkan';
        setConfirmDialog({
            open: true,
            title: isActive ? 'Nonaktifkan User' : 'Aktifkan User',
            description: `Apakah Anda yakin ingin ${action} user ini?`,
            action: () => {
                router.post(
                    `/admin/${userId}/toggle-active`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            router.reload();
                        },
                    },
                );
            },
        });
    };

    const handleDelete = (userId: number) => {
        setConfirmDialog({
            open: true,
            title: 'Hapus User',
            description:
                'Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.',
            action: () => {
                router.delete(`/admin/${userId}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.reload();
                    },
                });
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Manajemen Admin', href: '/admin' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Admin</h1>
                        <p className="mt-2 text-muted-foreground">
                            Kelola verifikasi dan status akun user
                        </p>
                    </div>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => router.get('/admin/create')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Admin
                    </Button>
                </div>

                {/* Filter Section */}
                <div className="rounded-lg border bg-card p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Input
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFilter();
                                }}
                            />
                        </div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Status
                                </SelectItem>
                                <SelectItem value="pending">
                                    Menunggu Verifikasi
                                </SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">
                                    Tidak Aktif
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleFilter}>Filter</Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="border-x p-3 text-left">Nama</th>
                                <th className="border-x p-3 text-left">
                                    Email
                                </th>
                                <th className="border-x p-3 text-left">Role</th>
                                <th className="border-x p-3 text-left">
                                    Status
                                </th>
                                <th className="border-x p-3 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                admins.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t hover:bg-muted/30"
                                    >
                                        <td className="border-x p-3">
                                            {user.name}
                                        </td>
                                        <td className="border-x p-3">
                                            {user.email}
                                        </td>
                                        <td className="border-x p-3">
                                            <Badge variant="outline">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="border-x p-3">
                                            <div className="flex flex-col gap-1">
                                                {!user.is_verified ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-fit"
                                                    >
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Menunggu Verifikasi
                                                    </Badge>
                                                ) : user.is_active ? (
                                                    <Badge
                                                        variant="default"
                                                        className="w-fit bg-green-600"
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Aktif
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="destructive"
                                                        className="w-fit"
                                                    >
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Tidak Aktif
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border-x p-3">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {!user.is_verified && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                            handleVerify(
                                                                user.id,
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Verifikasi
                                                    </Button>
                                                )}
                                                {user.is_verified && (
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            user.is_active
                                                                ? 'outline'
                                                                : 'default'
                                                        }
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                user.id,
                                                                user.is_active,
                                                            )
                                                        }
                                                    >
                                                        {user.is_active ? (
                                                            <>
                                                                <PowerOff className="mr-1 h-3 w-3" />
                                                                Nonaktifkan
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Power className="mr-1 h-3 w-3" />
                                                                Aktifkan
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        const queryParams = new URLSearchParams();
                                                        Object.entries(filters).forEach(([key, value]) => {
                                                            if (value) queryParams.set(key, String(value));
                                                        });
                                                        const queryString = queryParams.toString();
                                                        router.get(
                                                            `/admin/${user.id}/edit${queryString ? `?${queryString}` : ''}`,
                                                        );
                                                    }}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        router.get(
                                                            `/admin/${user.id}/change-password`,
                                                        )
                                                    }
                                                >
                                                    <Key className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {admins.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {admins.links.map((link: any, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url);
                                    }
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={confirmDialog.open}
                onOpenChange={(open) =>
                    setConfirmDialog({ ...confirmDialog, open })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className={
                                confirmDialog.variant === 'destructive'
                                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    : ''
                            }
                            onClick={() => {
                                confirmDialog.action();
                                setConfirmDialog({
                                    ...confirmDialog,
                                    open: false,
                                });
                            }}
                        >
                            Ya, Lanjutkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
