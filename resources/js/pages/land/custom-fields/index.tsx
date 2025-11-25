import { Badge } from '@/components/ui/badge';
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
import { CustomFieldDefinition } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Eye,
    EyeOff,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';

interface Props {
    fields: CustomFieldDefinition[];
    [key: string]: unknown;
}

export default function CustomFieldsIndex() {
    const { fields } = usePage<Props>().props;

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus field ini?')) {
            router.delete(`/custom-fields/${id}`);
        }
    };

    const getFieldTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            text: 'Text',
            textarea: 'Text Area',
            select: 'Dropdown',
            radio: 'Radio Button',
            checkbox: 'Checkbox',
            number: 'Number',
            date: 'Date',
        };
        return types[type] || type;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Custom Fields', href: '/custom-fields' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Custom Fields</h1>
                        <p className="mt-2 text-muted-foreground">
                            Kelola field dinamis untuk form tanah
                        </p>
                    </div>
                    <Button
                        onClick={() => router.visit('/custom-fields/create')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Field
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-x">
                                    Field Key
                                </TableHead>
                                <TableHead className="border-x">
                                    Label
                                </TableHead>
                                <TableHead className="border-x">
                                    Tipe
                                </TableHead>
                                <TableHead className="border-x text-center">
                                    Required
                                </TableHead>
                                <TableHead className="border-x text-center">
                                    Di List
                                </TableHead>
                                <TableHead className="border-x text-center">
                                    Di Detail
                                </TableHead>
                                <TableHead className="border-x text-center">
                                    Status
                                </TableHead>
                                <TableHead className="border-x text-center">
                                    Urutan
                                </TableHead>
                                <TableHead className="border-x">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="border-x text-center text-muted-foreground"
                                    >
                                        Belum ada custom field
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fields.map((field) => (
                                    <TableRow key={field.id}>
                                        <TableCell className="border-x font-mono text-sm">
                                            {field.field_key}
                                        </TableCell>
                                        <TableCell className="border-x font-medium">
                                            {field.field_label}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            <Badge variant="secondary">
                                                {getFieldTypeLabel(
                                                    field.field_type,
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="border-x text-center">
                                            {field.is_required ? (
                                                <Badge variant="destructive">
                                                    Ya
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Tidak
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="border-x text-center">
                                            {field.is_visible_in_list ? (
                                                <Eye className="mx-auto h-4 w-4 text-green-600" />
                                            ) : (
                                                <EyeOff className="mx-auto h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell className="border-x text-center">
                                            {field.is_visible_in_detail ? (
                                                <Eye className="mx-auto h-4 w-4 text-green-600" />
                                            ) : (
                                                <EyeOff className="mx-auto h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell className="border-x text-center">
                                            {field.is_active ? (
                                                <Badge>Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="border-x text-center">
                                            {field.order}
                                        </TableCell>
                                        <TableCell className="border-x">
                                            <div className="flex">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/custom-fields/${field.id}/edit`,
                                                        )
                                                    }
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleDelete(field.id)
                                                    }
                                                    title="Hapus"
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
            </div>
        </AppLayout>
    );
}
