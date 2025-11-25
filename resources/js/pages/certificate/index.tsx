import { MapModal } from '@/components/map-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Download,
    Eye,
    Filter,
    MapPin,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props {
    certificates: PaginatedData<Certificate>;
    filters: {
        nomor_sertifikat?: string;
        nomor_hak?: string;
        surat_ukur?: string;
        pemilik?: string;
        tahun?: string;
    };
    [key: string]: unknown;
}

export default function CertificateIndex() {
    const { certificates, filters } = usePage<Props>().props;
    const [showFilters, setShowFilters] = useState(false);
    const [mapOpen, setMapOpen] = useState(false);
    const [selectedLand, setSelectedLand] = useState<Land | null>(null);

    const [filterForm, setFilterForm] = useState({
        nomor_sertifikat: filters.nomor_sertifikat || '',
        nomor_hak: filters.nomor_hak || '',
        surat_ukur: filters.surat_ukur || '',
        pemilik: filters.pemilik || '',
        tahun: filters.tahun || '',
    });

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
            router.delete(`/certificate/${id}`);
        }
    };

    const handleView = (id: number) => {
        window.open(`/certificate/${id}`, '_blank');
    };

    const handleDownload = (id: number, fileName: string) => {
        window.open(`/certificate/${id}/download`, '_blank');
    };

    const handleViewMap = (land: Land) => {
        setSelectedLand(land);
        setMapOpen(true);
    };

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get('/certificate', filterForm, { preserveState: true });
    };

    const handleReset = () => {
        setFilterForm({
            nomor_sertifikat: '',
            nomor_hak: '',
            surat_ukur: '',
            pemilik: '',
            tahun: '',
        });
        router.get('/certificate');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Manajemen Sertifikat', href: '/certificate' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Manajemen Sertifikat
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Kelola sertifikat tanah
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={() => router.visit('/certificate/create')}
                            className="w-full md:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Sertifikat
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:w-auto"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <form
                        onSubmit={handleFilter}
                        className="rounded-lg border bg-card p-4"
                    >
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <Input
                                placeholder="Nomor Sertifikat"
                                value={filterForm.nomor_sertifikat}
                                onChange={(e) =>
                                    setFilterForm({
                                        ...filterForm,
                                        nomor_sertifikat: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Nomor Hak"
                                value={filterForm.nomor_hak}
                                onChange={(e) =>
                                    setFilterForm({
                                        ...filterForm,
                                        nomor_hak: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Surat Ukur"
                                value={filterForm.surat_ukur}
                                onChange={(e) =>
                                    setFilterForm({
                                        ...filterForm,
                                        surat_ukur: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Pemilik"
                                value={filterForm.pemilik}
                                onChange={(e) =>
                                    setFilterForm({
                                        ...filterForm,
                                        pemilik: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Tahun"
                                type="number"
                                value={filterForm.tahun}
                                onChange={(e) =>
                                    setFilterForm({
                                        ...filterForm,
                                        tahun: e.target.value,
                                    })
                                }
                            />
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    Terapkan
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="flex-1"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-x">
                                    Nomor Sertifikat
                                </TableHead>
                                <TableHead className="border-x">
                                    Nomor Hak
                                </TableHead>
                                <TableHead className="border-x">
                                    Surat Ukur
                                </TableHead>
                                <TableHead className="border-x">
                                    Pemilik
                                </TableHead>
                                <TableHead className="border-x">
                                    Tahun
                                </TableHead>
                                <TableHead className="border-x">
                                    Tipe Hak
                                </TableHead>
                                <TableHead className="border-x">
                                    Kode Wilayah
                                </TableHead>
                                <TableHead className="border-x">
                                    Penggunaan
                                </TableHead>
                                <TableHead className="border-x">File</TableHead>
                                <TableHead className="border-x">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        className="border-x text-center text-muted-foreground"
                                    >
                                        Tidak ada sertifikat ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                certificates.data.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="border-x font-medium">
                                            {cert.nomor_sertifikat}
                                        </TableCell>
                                        <TableCell className="border-x font-medium">
                                            {cert.land?.nomor_hak || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.land?.surat_ukur || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.land?.pemilik_pe || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.land?.tahun || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.land?.tipe_hak || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.land?.kode_wilayah || '-'}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {cert.land?.penggunaan || '-'}
                                        </TableCell>
                                        <TableCell className="border-x text-sm">
                                            {cert.file_name}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            <div className="flex">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleView(cert.id)
                                                    }
                                                    title="Lihat Sertifikat"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleDownload(
                                                            cert.id,
                                                            cert.file_name,
                                                        )
                                                    }
                                                    title="Download Sertifikat"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        cert.land &&
                                                        handleViewMap(cert.land)
                                                    }
                                                    title="Lihat di Peta"
                                                    disabled={!cert.land}
                                                >
                                                    <MapPin className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        const queryParams = new URLSearchParams();
                                                        Object.entries(filters).forEach(([key, value]) => {
                                                            if (value) queryParams.set(key, String(value));
                                                        });
                                                        const queryString = queryParams.toString();
                                                        router.visit(
                                                            `/certificate/${cert.id}/edit${queryString ? `?${queryString}` : ''}`,
                                                        );
                                                    }}
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

            {/* Map Modal */}
            {selectedLand && (
                <MapModal
                    open={mapOpen}
                    onOpenChange={setMapOpen}
                    coordinates={selectedLand.coordinates as [number, number][]}
                    center={selectedLand.coordinate as [number, number]}
                    title={`Peta - ${selectedLand.nomor_hak}`}
                />
            )}
        </AppLayout>
    );
}
