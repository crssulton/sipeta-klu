import { MapModal } from '@/components/map-modal';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { parseCoordinates } from '@/lib/map-utils';
import { CustomFieldDefinition, Land, PaginatedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { FileText, Filter, MapPin, Pencil, Plus, Settings, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props {
    lands: PaginatedData<Land>;
    filters: {
        nomor_hak?: string;
        surat_ukur?: string;
        pemilik?: string;
        kecamatan?: string;
        kelurahan?: string;
        tipe_hak?: string;
        tahun?: string;
    };
    kelurahanList: string[];
    customFields: CustomFieldDefinition[];
    [key: string]: unknown;
}

export default function LandIndex() {
    const { lands, filters, kelurahanList, customFields } = usePage<Props>().props;
    const [mapOpen, setMapOpen] = useState(false);
    const [selectedLand, setSelectedLand] = useState<Land | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const [filterForm, setFilterForm] = useState({
        nomor_hak: filters.nomor_hak || '',
        surat_ukur: filters.surat_ukur || '',
        pemilik: filters.pemilik || '',
        kecamatan: filters.kecamatan || '',
        kelurahan: filters.kelurahan || '',
        tipe_hak: filters.tipe_hak || '',
        tahun: filters.tahun || '',
    });

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data tanah ini?')) {
            router.delete(`/land/${id}`);
        }
    };

    const handleViewMap = (land: Land) => {
        setSelectedLand(land);
        setMapOpen(true);
    };

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get('/land', filterForm, { preserveState: true });
    };

    const handleReset = () => {
        setFilterForm({
            nomor_hak: '',
            surat_ukur: '',
            pemilik: '',
            kecamatan: '',
            kelurahan: '',
            tipe_hak: '',
            tahun: '',
        });
        router.get('/land');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Manajemen Tanah', href: '/land' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Tanah</h1>
                        <p className="mt-2 text-muted-foreground">
                            Kelola data tanah dan sertifikat
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={() => router.visit('/land/create')}
                            className="w-full md:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Tanah
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/custom-fields')}
                            className="w-full md:w-auto"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Custom Fields
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
                            <Select
                                value={filterForm.kecamatan}
                                onValueChange={(value) => {
                                    setFilterForm({
                                        ...filterForm,
                                        kecamatan: value,
                                        kelurahan: '', // Reset kelurahan when kecamatan changes
                                    });
                                    // Auto-submit to get kelurahan list
                                    router.get('/land', {
                                        ...filterForm,
                                        kecamatan: value,
                                        kelurahan: '',
                                    }, { preserveState: true });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gangga">Gangga</SelectItem>
                                    <SelectItem value="pemenang">Pemenang</SelectItem>
                                    <SelectItem value="tanjung">Tanjung</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterForm.kelurahan}
                                onValueChange={(value) =>
                                    setFilterForm({
                                        ...filterForm,
                                        kelurahan: value,
                                    })
                                }
                                disabled={!filterForm.kecamatan || kelurahanList.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelurahan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelurahanList.map((kelurahan) => (
                                        <SelectItem key={kelurahan} value={kelurahan}>
                                            {kelurahan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                placeholder="Tipe Hak"
                                value={filterForm.tipe_hak}
                                onChange={(e) =>
                                    setFilterForm({
                                        ...filterForm,
                                        tipe_hak: e.target.value,
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

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-x">
                                    Kecamatan
                                </TableHead>
                                <TableHead className="border-x">
                                    Kelurahan
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
                                    Tipe Hak
                                </TableHead>
                                <TableHead className="border-x">
                                    Luas (m²)
                                </TableHead>
                                {customFields.map((field) => (
                                    <TableHead key={field.id} className="border-x">
                                        {field.field_label}
                                    </TableHead>
                                ))}
                                <TableHead className="border-x">
                                    Sertifikat
                                </TableHead>
                                <TableHead className="border-x">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lands.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9 + customFields.length}
                                        className="border-x text-center text-muted-foreground"
                                    >
                                        Tidak ada data tanah ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lands.data.map((land) => (
                                    <TableRow key={land.id}>
                                        <TableCell className="border-x">
                                            {land.kecamatan}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {land.kelurahan}
                                        </TableCell>
                                        <TableCell className="border-x font-medium">
                                            {land.nomor_hak}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {land.surat_ukur}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {land.pemilik_pe}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {land.tipe_hak}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            {land.luas}
                                        </TableCell>
                                        {customFields.map((field) => (
                                            <TableCell key={field.id} className="border-x">
                                                {land.additional_data?.[field.field_key]
                                                    ? Array.isArray(
                                                          land.additional_data[field.field_key],
                                                      )
                                                        ? (
                                                              land.additional_data[
                                                                  field.field_key
                                                              ] as string[]
                                                          ).join(', ')
                                                        : String(
                                                              land.additional_data[field.field_key],
                                                          )
                                                    : '-'}
                                            </TableCell>
                                        ))}
                                        <TableCell className="border-x">
                                            <Badge variant="secondary">
                                                {land.certificates?.length || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="border-x">
                                            <div className="flex">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/land/${land.id}/certificates`,
                                                        )
                                                    }
                                                    title="Lihat Sertifikat"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleViewMap(land)
                                                    }
                                                    title="Lihat di Peta"
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
                                                            `/land/${land.id}/edit${queryString ? `?${queryString}` : ''}`,
                                                        );
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleDelete(land.id)
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
                {lands.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {lands.links.map((link, index) => (
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
                    coordinates={parseCoordinates(selectedLand.coordinates) as [number, number][]}
                    center={parseCoordinates(selectedLand.coordinate) as [number, number]}
                    title={`Peta ${selectedLand.nomor_hak}`}
                />
            )}
        </AppLayout>
    );
}
