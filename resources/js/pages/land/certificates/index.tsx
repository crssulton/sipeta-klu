import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Certificate, Land, PaginatedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Download, Pencil, Plus, Trash2 } from 'lucide-react';

interface Props {
    land: Land;
    certificates: PaginatedData<Certificate>;
    [key: string]: unknown;
}

export default function LandCertificatesIndex() {
    const { land, certificates } = usePage<Props>().props;

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
            router.delete(`/land/${land.id}/certificates/${id}`);
        }
    };

    const handleDownload = (cert: Certificate) => {
        window.open(`/certificate/${cert.id}/download`, '_blank');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Manajemen Tanah', href: '/land' },
                {
                    title: land.nomor_hak ?? '',
                    href: `/land/${land.id}/certificates`,
                },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Sertifikat untuk {land.nomor_hak}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {land.kelurahan}, {land.kecamatan} •{' '}
                            {land.pemilik_pe}
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            router.visit(`/land/${land.id}/certificates/create`)
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Sertifikat
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-x">
                                    Nomor Sertifikat
                                </TableHead>
                                <TableHead className="border-x">
                                    Deskripsi
                                </TableHead>
                                <TableHead className="border-x">
                                    Nama File
                                </TableHead>
                                <TableHead className="border-x">
                                    Tipe File
                                </TableHead>
                                <TableHead className="border-x">
                                    Ukuran File
                                </TableHead>
                                <TableHead className="border-x">
                                    Dibuat Pada
                                </TableHead>
                                <TableHead className="border-x">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="border-x text-center text-muted-foreground"
                                    >
                                        Tidak ada sertifikat untuk tanah ini
                                    </TableCell>
                                </TableRow>
                            ) : (
                                certificates.data.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="border-x font-medium">
                                            {cert.nomor_sertifikat}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.description || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.file_name}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.file_type}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {(cert.file_size / 1024).toFixed(2)}{' '}
                                            KB
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {new Date(
                                                cert.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="w-[120px] border-x">
                                            <div className="flex">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleDownload(cert)
                                                    }
                                                    title="Download"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/land/${land.id}/certificates/${cert.id}/edit`,
                                                        )
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleDelete(cert.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {certificates.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {certificates.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
