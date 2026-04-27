import { Form, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { DrawMapModal } from '@/components/draw-map-modal';
import { DynamicField } from '@/components/dynamic-field';
import { CustomFieldDefinition } from '@/types';
import { Map } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Position = 'kiri' | 'kanan' | 'atas' | 'bawah';

interface Props {
    customFields: CustomFieldDefinition[];
    [key: string]: unknown;
}

export default function LandCreate() {
    const { customFields } = usePage<Props>().props;
    const [selectedImagePreviews, setSelectedImagePreviews] = useState<
        Partial<Record<Position, string>>
    >({});
    const previewRef = useRef<Partial<Record<Position, string>>>({});
    const [drawMapOpen, setDrawMapOpen] = useState(false);
    const [coordinatesValue, setCoordinatesValue] = useState('');
    const [coordinateValue, setCoordinateValue] = useState('');
    const [additionalData, setAdditionalData] = useState<
        Record<string, string | string[] | number | null>
    >({});

    // Safe JSON parse helper
    const safeJSONParse = (value: string): any => {
        if (!value || value.trim() === '') return undefined;
        try {
            return JSON.parse(value);
        } catch (e) {
            return undefined;
        }
    };

    // Auto-calculate center when coordinates change
    useEffect(() => {
        try {
            const coords = JSON.parse(coordinatesValue);
            if (Array.isArray(coords) && coords.length > 0) {
                const lngs = coords.map((c: [number, number]) => c[0]);
                const lats = coords.map((c: [number, number]) => c[1]);
                const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
                const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                setCoordinateValue(JSON.stringify([centerLng, centerLat]));
            }
        } catch (e) {
            // Invalid JSON, do nothing
        }
    }, [coordinatesValue]);

    const handleSaveArea = (
        coordinates: [number, number][],
        center: [number, number],
    ) => {
        setCoordinatesValue(JSON.stringify(coordinates));
        setCoordinateValue(JSON.stringify(center));
    };

    const handleImagePreview = (position: Position, file?: File | null) => {
        setSelectedImagePreviews((prev) => {
            if (prev[position]) {
                URL.revokeObjectURL(prev[position]);
            }

            if (!file) {
                const { [position]: _removed, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [position]: URL.createObjectURL(file),
            };
        });
    };

    useEffect(() => {
        previewRef.current = selectedImagePreviews;
    }, [selectedImagePreviews]);

    useEffect(() => {
        return () => {
            Object.values(previewRef.current).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Manajemen Tanah', href: '/land' },
                { title: 'Tambah Data Tanah', href: '/land/create' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Tambah Data Tanah</h1>
                    <p className="mt-2 text-muted-foreground">
                        Tambahkan data tanah baru ke sistem
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <Form action="/land" method="post" encType="multipart/form-data">
                        {({ processing, errors }) => (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_hak">Nomor Hak</Label>
                                        <Input id="nomor_hak" name="nomor_hak" />
                                        <InputError message={errors.nomor_hak} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="surat_ukur">Surat Ukur</Label>
                                        <Input id="surat_ukur" name="surat_ukur" />
                                        <InputError message={errors.surat_ukur} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kode_wilayah">Kode Wilayah</Label>
                                        <Input id="kode_wilayah" name="kode_wilayah" />
                                        <InputError message={errors.kode_wilayah} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kecamatan">Kecamatan</Label>
                                        <Input id="kecamatan" name="kecamatan" />
                                        <InputError message={errors.kecamatan} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kelurahan">Kelurahan</Label>
                                        <Input id="kelurahan" name="kelurahan" />
                                        <InputError message={errors.kelurahan} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tipe_hak">Tipe Hak</Label>
                                        <Input
                                            id="tipe_hak"
                                            name="tipe_hak"
                                            placeholder="e.g., Hak Pakai, Hak Milik"
                                        />
                                        <InputError message={errors.tipe_hak} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tahun">Tahun</Label>
                                        <Input
                                            id="tahun"
                                            name="tahun"
                                            type="number"
                                            placeholder="2024"
                                        />
                                        <InputError message={errors.tahun} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nib">NIB</Label>
                                        <Input id="nib" name="nib" />
                                        <InputError message={errors.nib} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="penggunaan">Penggunaan</Label>
                                        <Input
                                            id="penggunaan"
                                            name="penggunaan"
                                            placeholder="e.g., Kosong, Bangunan"
                                        />
                                        <InputError message={errors.penggunaan} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="luas">Luas (m²)</Label>
                                        <Input
                                            id="luas"
                                            name="luas"
                                            type="number"
                                            step="0.01"
                                        />
                                        <InputError message={errors.luas} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="produk">Produk</Label>
                                        <Input
                                            id="produk"
                                            name="produk"
                                            placeholder="e.g., BMN"
                                        />
                                        <InputError message={errors.produk} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="luas_peta">Luas Peta (m²)</Label>
                                        <Input
                                            id="luas_peta"
                                            name="luas_peta"
                                            type="number"
                                            step="0.01"
                                        />
                                        <InputError message={errors.luas_peta} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kw">KW</Label>
                                        <Input id="kw" name="kw" placeholder="e.g., KW1" />
                                        <InputError message={errors.kw} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pemilik_pe">Pemilik (PE)</Label>
                                        <Input id="pemilik_pe" name="pemilik_pe" />
                                        <InputError message={errors.pemilik_pe} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pemilik_ak">Pemilik (AK)</Label>
                                        <Input id="pemilik_ak" name="pemilik_ak" />
                                        <InputError message={errors.pemilik_ak} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="coordinates">
                                            Coordinates (JSON Array)
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDrawMapOpen(true)}
                                        >
                                            <Map className="mr-2 h-4 w-4" />
                                            Gambar Area
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="coordinates"
                                        name="coordinates"
                                        value={coordinatesValue}
                                        onChange={(e) => setCoordinatesValue(e.target.value)}
                                        rows={4}
                                        placeholder='[[116.243100355734, -8.27804586699235], [116.243755280032, -8.27763318680566], ...]'
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Format: Array of [longitude, latitude] pairs
                                    </p>
                                    <InputError message={errors.coordinates} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coordinate">
                                        Center Coordinate (JSON)
                                    </Label>
                                    <Input
                                        id="coordinate"
                                        name="coordinate"
                                        value={coordinateValue}
                                        onChange={(e) => setCoordinateValue(e.target.value)}
                                        placeholder='[116.235059064008, -8.27174304218052]'
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Format: [longitude, latitude]
                                    </p>
                                    <InputError message={errors.coordinate} />
                                </div>

                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="text-lg font-semibold">
                                        Foto Posisi Lahan
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="foto_posisi_kiri">
                                                Foto Posisi Kiri
                                            </Label>
                                            <Input
                                                id="foto_posisi_kiri"
                                                name="foto_posisi_kiri"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) =>
                                                    handleImagePreview(
                                                        'kiri',
                                                        e.target.files?.[0],
                                                    )
                                                }
                                            />
                                            {selectedImagePreviews.kiri && (
                                                <img
                                                    src={selectedImagePreviews.kiri}
                                                    alt="Preview foto posisi kiri"
                                                    className="h-28 w-full rounded-md border object-cover"
                                                />
                                            )}
                                            <InputError message={errors.foto_posisi_kiri} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="foto_posisi_kanan">
                                                Foto Posisi Kanan
                                            </Label>
                                            <Input
                                                id="foto_posisi_kanan"
                                                name="foto_posisi_kanan"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) =>
                                                    handleImagePreview(
                                                        'kanan',
                                                        e.target.files?.[0],
                                                    )
                                                }
                                            />
                                            {selectedImagePreviews.kanan && (
                                                <img
                                                    src={selectedImagePreviews.kanan}
                                                    alt="Preview foto posisi kanan"
                                                    className="h-28 w-full rounded-md border object-cover"
                                                />
                                            )}
                                            <InputError message={errors.foto_posisi_kanan} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="foto_posisi_atas">
                                                Foto Posisi Atas
                                            </Label>
                                            <Input
                                                id="foto_posisi_atas"
                                                name="foto_posisi_atas"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) =>
                                                    handleImagePreview(
                                                        'atas',
                                                        e.target.files?.[0],
                                                    )
                                                }
                                            />
                                            {selectedImagePreviews.atas && (
                                                <img
                                                    src={selectedImagePreviews.atas}
                                                    alt="Preview foto posisi atas"
                                                    className="h-28 w-full rounded-md border object-cover"
                                                />
                                            )}
                                            <InputError message={errors.foto_posisi_atas} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="foto_posisi_bawah">
                                                Foto Posisi Bawah
                                            </Label>
                                            <Input
                                                id="foto_posisi_bawah"
                                                name="foto_posisi_bawah"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) =>
                                                    handleImagePreview(
                                                        'bawah',
                                                        e.target.files?.[0],
                                                    )
                                                }
                                            />
                                            {selectedImagePreviews.bawah && (
                                                <img
                                                    src={selectedImagePreviews.bawah}
                                                    alt="Preview foto posisi bawah"
                                                    className="h-28 w-full rounded-md border object-cover"
                                                />
                                            )}
                                            <InputError message={errors.foto_posisi_bawah} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Format yang didukung: JPG, PNG, WEBP. Maksimal 5MB per file.
                                    </p>
                                </div>

                                {/* Dynamic Custom Fields */}
                                {customFields.length > 0 && (
                                    <div className="space-y-4 border-t pt-6">
                                        <h3 className="text-lg font-semibold">
                                            Data Tambahan
                                        </h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {customFields.map((field) => (
                                                <div key={field.id}>
                                                    <DynamicField
                                                        field={field}
                                                        value={
                                                            additionalData[
                                                                field.field_key
                                                            ]
                                                        }
                                                        onChange={(value) =>
                                                            setAdditionalData({
                                                                ...additionalData,
                                                                [field.field_key]:
                                                                    value,
                                                            })
                                                        }
                                                        error={
                                                            errors[
                                                                `additional_data.${field.field_key}`
                                                            ] as string
                                                        }
                                                    />
                                                    {Array.isArray(
                                                        additionalData[
                                                            field.field_key
                                                        ],
                                                    ) ? (
                                                        (additionalData[
                                                            field.field_key
                                                        ] as string[]).map(
                                                            (item, idx) => (
                                                                <input
                                                                    key={idx}
                                                                    type="hidden"
                                                                    name={`additional_data[${field.field_key}][]`}
                                                                    value={item}
                                                                />
                                                            ),
                                                        )
                                                    ) : (
                                                        <input
                                                            type="hidden"
                                                            name={`additional_data[${field.field_key}]`}
                                                            value={
                                                                (additionalData[
                                                                    field
                                                                        .field_key
                                                                ] as string) ||
                                                                ''
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Data Tanah'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>

            {/* Draw Map Modal */}
            <DrawMapModal
                open={drawMapOpen}
                onOpenChange={setDrawMapOpen}
                onSave={handleSaveArea}
                initialCoordinates={safeJSONParse(coordinatesValue)}
                initialCenter={safeJSONParse(coordinateValue)}
            />
        </AppLayout>
    );
}
