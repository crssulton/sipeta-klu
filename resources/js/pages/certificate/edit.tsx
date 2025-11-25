import InputError from '@/components/input-error';
import { LandMapPreview } from '@/components/land-map-preview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Certificate, Land } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { FileText, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    certificate: Certificate;
    lands: Land[];
    returnFilters?: Record<string, string>;
    [key: string]: unknown;
}

export default function CertificateEdit() {
    const { certificate, lands, returnFilters } = usePage<Props>().props;
    const [selectedLand, setSelectedLand] = useState<Land | null>(null);
    const [selectedLandId, setSelectedLandId] = useState<string>(
        certificate.land_id.toString(),
    );

    // Set initial selected land
    useEffect(() => {
        const land = lands.find((l) => l.id === certificate.land_id);
        if (land) {
            setSelectedLand(land);
        }
    }, [lands, certificate.land_id]);

    const handleLandSelect = (landId: string) => {
        setSelectedLandId(landId);
        const land = lands.find((l) => l.id.toString() === landId);
        if (land) {
            setSelectedLand(land);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Manajemen Sertifikat', href: '/certificate' },
                {
                    title: 'Edit Sertifikat',
                    href: `/certificate/${certificate.id}/edit`,
                },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Sertifikat</h1>
                    <p className="mt-2 text-muted-foreground">
                        Update data sertifikat yang sudah ada
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form di kiri */}
                    <div className="rounded-lg border bg-card p-6">
                        <Form
                            action={`/certificate/${certificate.id}`}
                            method="post"
                            encType="multipart/form-data"
                        >
                            {({ processing, errors }) => (
                                <div className="space-y-6">
                                    {/* Method spoofing untuk PUT */}
                                    <input type="hidden" name="_method" value="PUT" />
                                    
                                    {/* Hidden inputs to preserve filter params for redirect */}
                                    {returnFilters && Object.entries(returnFilters).map(([key, value]) => 
                                        value ? <input key={key} type="hidden" name={`return_filter_${key}`} value={value} /> : null
                                    )}
                                    
                                    {/* Hidden input untuk land_id */}
                                    <input
                                        type="hidden"
                                        name="land_id"
                                        value={selectedLandId}
                                    />

                                    <div className="space-y-2">
                                        <Label htmlFor="land_id">
                                            Pilih Tanah *
                                        </Label>
                                        <Select
                                            defaultValue={certificate.land_id.toString()}
                                            required
                                            onValueChange={handleLandSelect}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tanah..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lands.map((land) => (
                                                    <SelectItem
                                                        key={land.id}
                                                        value={land.id.toString()}
                                                    >
                                                        {land.nomor_hak} -{' '}
                                                        {land.kelurahan},{' '}
                                                        {land.kecamatan}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.land_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_sertifikat">
                                            Nomor Sertifikat *
                                        </Label>
                                        <Input
                                            id="nomor_sertifikat"
                                            name="nomor_sertifikat"
                                            defaultValue={
                                                certificate.nomor_sertifikat
                                            }
                                            placeholder="Contoh: 12345/2023"
                                            required
                                        />
                                        <InputError
                                            message={errors.nomor_sertifikat}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                certificate.description || ''
                                            }
                                            placeholder="Keterangan tambahan (opsional)"
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>File Saat Ini</Label>
                                        <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {certificate.file_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {certificate.file_type} •{' '}
                                                    {(
                                                        certificate.file_size /
                                                        1024
                                                    ).toFixed(2)}{' '}
                                                    KB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file">
                                            Ganti File (Opsional)
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                id="file"
                                                name="file"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                            />
                                            <Upload className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Format: JPG, JPEG, PNG, PDF (Max
                                            5MB). Kosongkan jika tidak ingin
                                            mengganti file.
                                        </p>
                                        <InputError message={errors.file} />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                window.history.back()
                                            }
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Update Sertifikat'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </div>

                    {/* Map Preview di kanan */}
                    <div className="hidden lg:block">
                        {selectedLand &&
                        selectedLand.coordinates &&
                        selectedLand.coordinate ? (
                            <LandMapPreview
                                coordinates={selectedLand.coordinates as [number, number][]}
                                center={selectedLand.coordinate as [number, number]}
                                title={`${selectedLand.nomor_hak} - ${selectedLand.kelurahan}`}
                            />
                        ) : (
                            <Card className="flex h-[400px] items-center justify-center border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <p className="text-sm">
                                        Pilih tanah untuk melihat peta
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
