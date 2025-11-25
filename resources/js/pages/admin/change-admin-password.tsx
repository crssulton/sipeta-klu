import { Form, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { User } from '@/types';

interface Props {
    admin: User;
    [key: string]: unknown;
}

export default function ChangeAdminPassword() {
    const { admin } = usePage<Props>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Admin Management', href: '/admin' },
                { title: 'Change Password', href: `/admin/${admin.id}/change-password` },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Change Password</h1>
                    <p className="mt-2 text-muted-foreground">
                        Update password for {admin.name}
                    </p>
                </div>

                <div className="max-w-2xl rounded-lg border bg-card p-6">
                    <Form action={`/admin/${admin.id}/change-password`} method="put">
                        {({ processing, errors }) => (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password *</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password *
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors.password_confirmation} />
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
                                        {processing ? 'Saving...' : 'Update Password'}
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
