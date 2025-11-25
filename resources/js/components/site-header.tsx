import {
    CloseIcon,
    DashboardIcon,
    HomeIcon,
    MenuIcon,
    SearchIcon,
} from '@/components/icons';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function SiteHeader() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Header Navigation */}
            <div className="relative flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12 lg:py-6">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 sm:gap-4">
                    <img
                        src="/assets/logo-klu.png"
                        alt="Logo Lombok Utara"
                        className="h-10 w-10 object-contain sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-sm leading-tight font-black text-white lg:text-2xl">
                            SIPETA
                        </h1>
                        <p className="text-[8px] font-semibold text-white uppercase sm:text-sm lg:text-base">
                            Lombok Utara
                        </p>
                    </div>
                </Link>

                {/* Navigation Menu - Hidden on mobile */}
                <nav className="hidden items-center gap-3 sm:flex lg:gap-6">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-white uppercase transition-colors hover:text-yellow-300 lg:text-base"
                    >
                        <HomeIcon />
                        Beranda
                    </a>

                    <a
                        href="/pencarian-bidang-tanah"
                        className="flex items-center gap-2 text-sm font-bold text-white uppercase transition-colors hover:text-yellow-300 lg:text-base"
                    >
                        <SearchIcon className="h-5 w-5" />
                        Pencarian Bidang Tanah
                    </a>

                    {/* <a
                        href="/main-menu"
                        className="flex items-center gap-2 text-sm font-bold text-white uppercase transition-colors hover:text-yellow-300 lg:text-base"
                    >
                        <MenuIcon className="h-5 w-5" />
                        Main Menu
                    </a> */}
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-cyan-600 transition-colors hover:bg-yellow-400 hover:text-white lg:text-base"
                        >
                            <DashboardIcon />
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="flex items-center gap-2 rounded-lg border border-white px-4 py-2 text-sm font-bold text-white transition-colors hover:border-yellow-400 hover:bg-yellow-400 hover:text-white lg:text-base"
                            >
                                Login
                            </Link>
                            <Link
                                href={register()}
                                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-cyan-600 transition-colors hover:bg-yellow-400 hover:text-white lg:text-base"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Icon */}
                <button
                    className="text-white sm:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Mobile Menu Sidebar */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50 sm:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Sidebar Menu */}
                    <div className="fixed top-0 right-0 z-50 h-full w-80 animate-in bg-cyan-600 shadow-2xl duration-300 slide-in-from-right sm:hidden">
                        {/* Close Button */}
                        <div className="flex justify-end p-4">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-yellow-300"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <nav className="flex flex-col gap-6 px-6 pt-8">
                            <a
                                href="/"
                                className="flex items-center gap-3 font-bold text-white uppercase transition-colors hover:text-yellow-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <HomeIcon className="h-6 w-6" />
                                Beranda
                            </a>
                            <a
                                href="/pencarian-bidang-tanah"
                                className="flex items-center gap-3 font-bold text-white uppercase transition-colors hover:text-yellow-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <SearchIcon className="h-6 w-6" />
                                Pencarian Bidang Tanah
                            </a>
                            {/* <a
                                href="/main-menu"
                                className="flex items-center gap-3  font-bold text-white uppercase transition-colors hover:text-yellow-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <MenuIcon />
                                Main Menu
                            </a> */}
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-bold text-cyan-600 transition-colors hover:bg-yellow-400 hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <DashboardIcon className="h-6 w-6" />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="flex items-center justify-center gap-3 rounded-lg border border-white px-4 py-3 font-bold text-white transition-colors hover:bg-yellow-400 hover:text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="flex items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-bold text-cyan-600 transition-colors hover:bg-yellow-400 hover:text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}
