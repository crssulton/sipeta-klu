import { Form, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { User } from '@/types';

interface Props {
    admin: User;
    returnFilters?: Record<string, string>;
    [key: string]: unknown;
}

export default function AdminEdit() {
    const { admin, returnFilters } = usePage<Props>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Admin Management', href: '/admin' },
                { title: 'Edit Admin', href: `/admin/${admin.id}/edit` },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Admin</h1>
                    <p className="mt-2 text-muted-foreground">
                        Update administrator account details
                    </p>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
                    <Form action={`/admin/${admin.id}`} method="put">
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                {/* Hidden inputs to preserve filter params for redirect */}
                                {returnFilters && Object.entries(returnFilters).map(([key, value]) => 
                                    value ? <input key={key} type="hidden" name={`return_filter_${key}`} value={value} /> : null
                                )}
                                
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={admin.name}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={admin.email}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" defaultValue={admin.role} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="super_admin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Update Admin
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
