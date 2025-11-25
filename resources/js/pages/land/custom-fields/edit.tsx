import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { CustomFieldDefinition } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    field: CustomFieldDefinition;
    [key: string]: unknown;
}

export default function CustomFieldEdit() {
    const { field, errors } = usePage<Props>().props;
    const [fieldType, setFieldType] = useState<string>(field.field_type);
    const [options, setOptions] = useState<string[]>(
        field.field_options || [''],
    );

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const needsOptions = ['select', 'radio', 'checkbox'].includes(fieldType);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Custom Fields', href: '/custom-fields' },
                {
                    title: 'Edit Field',
                    href: `/custom-fields/${field.id}/edit`,
                },
            ]}
        >
            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Custom Field</h1>
                    <p className="mt-2 text-muted-foreground">
                        Ubah pengaturan field dinamis
                    </p>
                </div>

                <Form
                    action={`/custom-fields/${field.id}`}
                    method="put"
                    className="space-y-6 rounded-lg border bg-card p-6"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="field_label">
                                    Label Field{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="field_label"
                                    name="field_label"
                                    defaultValue={field.field_label}
                                    required
                                />
                                <InputError
                                    message={errors.field_label as string}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="field_key">
                                    Field Key{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="field_key"
                                    name="field_key"
                                    defaultValue={field.field_key}
                                    pattern="[a-z_]+"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Hanya huruf kecil dan underscore (_)
                                </p>
                                <InputError
                                    message={errors.field_key as string}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="field_type">
                                    Tipe Field{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    name="field_type"
                                    value={fieldType}
                                    onValueChange={setFieldType}
                                    required
                                >
                                    <SelectTrigger id="field_type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">
                                            Text
                                        </SelectItem>
                                        <SelectItem value="textarea">
                                            Text Area
                                        </SelectItem>
                                        <SelectItem value="select">
                                            Dropdown (Select)
                                        </SelectItem>
                                        <SelectItem value="radio">
                                            Radio Button
                                        </SelectItem>
                                        <SelectItem value="checkbox">
                                            Checkbox
                                        </SelectItem>
                                        <SelectItem value="number">
                                            Number
                                        </SelectItem>
                                        <SelectItem value="date">
                                            Date
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.field_type as string}
                                />
                            </div>

                            {needsOptions && (
                                <div className="space-y-2">
                                    <Label>
                                        Pilihan (Options){' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="space-y-2">
                                        {options.map((option, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2"
                                            >
                                                <Input
                                                    name={`field_options[${index}]`}
                                                    value={option}
                                                    onChange={(e) =>
                                                        handleOptionChange(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={`Opsi ${index + 1}`}
                                                    required
                                                />
                                                {options.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleRemoveOption(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddOption}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Opsi
                                    </Button>
                                    <InputError
                                        message={
                                            (errors[
                                                'field_options.0'
                                            ] as string) ||
                                            (errors.field_options as string)
                                        }
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="order">Urutan</Label>
                                <Input
                                    id="order"
                                    name="order"
                                    type="number"
                                    defaultValue={field.order}
                                    min="0"
                                />
                                <InputError message={errors.order as string} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_required"
                                        name="is_required"
                                        value="1"
                                        defaultChecked={field.is_required}
                                    />
                                    <Label htmlFor="is_required">
                                        Field wajib diisi (Required)
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_visible_in_list"
                                        name="is_visible_in_list"
                                        value="1"
                                        defaultChecked={
                                            field.is_visible_in_list
                                        }
                                    />
                                    <Label htmlFor="is_visible_in_list">
                                        Tampilkan di tabel list tanah
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_visible_in_detail"
                                        name="is_visible_in_detail"
                                        value="1"
                                        defaultChecked={
                                            field.is_visible_in_detail
                                        }
                                    />
                                    <Label htmlFor="is_visible_in_detail">
                                        Tampilkan di detail tanah
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        value="1"
                                        defaultChecked={field.is_active}
                                    />
                                    <Label htmlFor="is_active">
                                        Field aktif dan dapat digunakan
                                    </Label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Batal
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
