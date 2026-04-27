import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, FileText, MapPin, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    totalLands: number;
    totalCertificates: number;
    totalAdmins?: number;
    landCountsByDistrict: {
        district: string;
        total: number;
    }[];
    [key: string]: unknown;
}

export default function Dashboard() {
    const {
        totalLands,
        totalCertificates,
        totalAdmins,
        landCountsByDistrict,
        auth,
    } = usePage<DashboardProps & SharedData>().props;
    const isSuperAdmin = auth.user?.role === 'super_admin';
    const maxDistrictTotal = Math.max(
        ...landCountsByDistrict.map((item) => item.total),
        1,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Selamat datang di Sistem Informasi Pertanahan
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Data Tanah
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalLands}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Data tanah terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Data Sertifikat
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalCertificates}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Sertifikat terupload
                            </p>
                        </CardContent>
                    </Card>

                    {isSuperAdmin && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Admin
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalAdmins}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Admin terdaftar
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>
                                Jumlah Lahan Pemda per Kecamatan
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Pemenang, Bayan, Gangga, Kayangan, dan Tanjung
                            </p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {landCountsByDistrict.map((item) => {
                                const percentage =
                                    (item.total / maxDistrictTotal) * 100;

                                return (
                                    <div
                                        key={item.district}
                                        className="grid gap-2 sm:grid-cols-[120px_1fr_64px] sm:items-center"
                                    >
                                        <div className="text-sm font-medium text-foreground">
                                            {item.district}
                                        </div>
                                        <div className="h-8 overflow-hidden rounded-md bg-muted">
                                            <div
                                                className="flex h-full min-w-2 items-center rounded-md bg-cyan-600 px-3 text-xs font-medium text-white transition-[width]"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            >
                                                {item.total > 0 &&
                                                    `${item.total} lahan`}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-foreground sm:text-right">
                                            {item.total}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>Selamat Datang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Sistem Informasi Pertanahan SIPETA KLU. Gunakan
                                menu di sidebar untuk mengelola data tanah,
                                sertifikat, dan administrasi sistem.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
