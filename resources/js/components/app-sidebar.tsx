import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileText, LayoutGrid, MapPin, Shield, MapIcon } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const mainNavItems: NavItem[] = useMemo(() => {
        const items: NavItem[] = [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ];

        // Super Admin only menus
        if (user?.role === 'super_admin') {
            items.push({
                title: 'Manajemen Admin',
                href: '/admin',
                icon: Shield,
            });
        }

        // All verified users can access these
        items.push(
            {
                title: 'Manajemen Tanah',
                href: '/land',
                icon: MapPin,
            },
            {
                title: 'Manajemen Sertifikat',
                href: '/certificate',
                icon: FileText,
            },
            {
                title: 'Pencarian Bidang Tanah',
                href: '/pencarian-bidang-tanah',
                icon: MapIcon,
            },
        );

        return items;
    }, [user?.role]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
