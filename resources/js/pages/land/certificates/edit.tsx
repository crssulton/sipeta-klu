import InputError from '@/components/input-error';
import { LandMapPreview } from '@/components/land-map-preview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { parseCoordinates } from '@/lib/map-utils';
import { Certificate, Land } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { FileText, Upload } from 'lucide-react';

interface Props {
    land: Land;
    certificate: Certificate;
    [key: string]: unknown;
}

export default function LandCertificateEdit() {
    const { land, certificate } = usePage<Props>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Land Management', href: '/land' },
                {
                    title: land.nomor_hak ?? '',
                    href: `/land/${land.id}/certificates`,
                },
                {
                    title: 'Edit Certificate',
                    href: `/land/${land.id}/certificates/${certificate.id}/edit`,
                },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Sertifikat</h1>
                    <p className="mt-2 text-muted-foreground">
                        Update sertifikat untuk {land.nomor_hak}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form di kiri */}
                    <div className="rounded-lg border bg-card p-6">
                        <Form
                            action={`/land/${land.id}/certificates/${certificate.id}`}
                            method="post"
                            encType="multipart/form-data"
                        >
                            {({ processing, errors }) => (
                                <div className="space-y-6">
                                    {/* Method spoofing untuk PUT */}
                                    <input
                                        type="hidden"
                                        name="_method"
                                        value="PUT"
                                    />

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
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                certificate.description || ''
                                            }
                                            placeholder="Keterangan tambahan (opsional)"
                                            rows={3}
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
                        {land.coordinates && land.coordinate ? (
                            <LandMapPreview
                                coordinates={
                                    parseCoordinates(land.coordinates) as [
                                        number,
                                        number,
                                    ][]
                                }
                                center={
                                    parseCoordinates(land.coordinate) as [
                                        number,
                                        number,
                                    ]
                                }
                                title={`${land.nomor_hak} - ${land.kelurahan}`}
                            />
                        ) : (
                            <Card className="flex h-[400px] items-center justify-center border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <p className="text-sm">
                                        Data koordinat tidak tersedia
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
