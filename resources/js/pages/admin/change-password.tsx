import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function ChangePassword() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Change Password', href: '/admin/change-password' },
            ]}
        >
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Change Password</h1>
                    <p className="mt-2 text-muted-foreground">
                        Update your account password
                    </p>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
                    <Form
                        action="/admin/change-password"
                        method="put"
                        resetOnSuccess={['current_password', 'password', 'password_confirmation']}
                    >
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Current Password</Label>
                                    <Input
                                        id="current_password"
                                        name="current_password"
                                        type="password"
                                        required
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Change Password
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
