import InputError from '@/components/input-error';
import { LandMapPreview } from '@/components/land-map-preview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { parseCoordinates } from '@/lib/map-utils';
import { Land } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { Upload } from 'lucide-react';

interface Props {
    land: Land;
    [key: string]: unknown;
}

export default function LandCertificateCreate() {
    const { land } = usePage<Props>().props;

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
                    title: 'Add Certificate',
                    href: `/land/${land.id}/certificates/create`,
                },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Tambah Sertifikat</h1>
                    <p className="mt-2 text-muted-foreground">
                        Upload sertifikat untuk {land.nomor_hak} -{' '}
                        {land.kelurahan}, {land.kecamatan}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form di kiri */}
                    <div className="rounded-lg border bg-card p-6">
                        <Form
                            action={`/land/${land.id}/certificates`}
                            method="post"
                            encType="multipart/form-data"
                        >
                            {({ processing, errors }) => (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_sertifikat">
                                            Nomor Sertifikat *
                                        </Label>
                                        <Input
                                            id="nomor_sertifikat"
                                            name="nomor_sertifikat"
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
                                            placeholder="Keterangan tambahan (opsional)"
                                            rows={3}
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file">
                                            File Sertifikat *
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                id="file"
                                                name="file"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                required
                                            />
                                            <Upload className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Format: JPG, JPEG, PNG, PDF (Max
                                            5MB)
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
                                                ? 'Mengupload...'
                                                : 'Upload Sertifikat'}
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
