import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { FileText, MapPin, Users } from 'lucide-react';

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
    [key: string]: unknown;
}

export default function Dashboard() {
    const { totalLands, totalCertificates, totalAdmins, auth } = usePage<
        DashboardProps & SharedData
    >().props;
    const isSuperAdmin = auth.user?.role === 'super_admin';

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
