import {
    BookIcon,
    CalculatorIcon,
    ChartIcon,
    DocumentIcon,
    GlobeIcon,
    LocationIcon,
    PencilIcon,
    SearchIcon,
} from '@/components/icons';
import SiteHeader from '@/components/site-header';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function MainMenu() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-screen bg-cyan-400">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: 'url(/assets/background-2.png)',
                }}
            />

            <div className="relative z-10">
                {/* Header Navigation */}
                <div className="container mx-auto">
                    <SiteHeader />
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
                    {/* Page Title */}
                    <div>
                        <div className="inline-block rounded-t-2xl bg-cyan-500 px-8 py-4 lg:px-12 lg:py-6">
                            <h2 className="text-2xl font-bold text-white lg:text-4xl">
                                Main Menu
                            </h2>
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="rounded-3xl rounded-tl-none bg-white p-6 pt-10 shadow-2xl lg:p-12">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                            {/* Menu 1 - Pencarian Bidang Tanah */}
                            <Link
                                href="/pencarian-bidang-tanah"
                                className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105"
                            >
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <SearchIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Pencarian Bidang Tanah
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Menemukan informasi bidang tanah dengan data
                                    kepemilikan
                                </p>
                            </Link>

                            {/* Menu 2 - Pencarian Batas Administrasi */}
                            <Link
                                href="/pencarian-batas-administrasi"
                                className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105"
                            >
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <LocationIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Pencarian Batas Administrasi
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Akses data batas wilayah administratif untuk
                                    keperluan perencanaan
                                </p>
                            </Link>

                            {/* Menu 3 - Brankas Elektronik */}
                            <Link
                                href="/brankas-elektronik"
                                className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105"
                            >
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <DocumentIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Brankas Elektronik
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Akses dokumen digital dan peta wilayah untuk keperluan perencanaan
                                </p>
                            </Link>

                            {/* Menu 4 - Koleksi */}
                            <div className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <BookIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Koleksi
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Kumpulkan dan kelola data bidang tanah dalam
                                    satu tempat
                                </p>
                            </div>

                            {/* Menu 5 - Pengukuran */}
                            <div className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <CalculatorIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Pengukuran
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Teknologi presisi tinggi untuk survei dan
                                    pengukuran tanah.
                                </p>
                            </div>

                            {/* Menu 6 - Digitasi */}
                            <div className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <PencilIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Digitasi
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Konversi data fisik menjadi digital untuk
                                    efisiensi pengelolaan
                                </p>
                            </div>

                            {/* Menu 7 - Infografi */}
                            <div className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <ChartIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Infografi
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Sajikan data tanah dan spasia dalam bentuk
                                    visual menarik
                                </p>
                            </div>

                            {/* Menu 8 - Geonode Atlas */}
                            <div className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:scale-105">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 transition-colors group-hover:bg-cyan-500 lg:h-24 lg:w-24">
                                    <GlobeIcon className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-cyan-500 lg:text-xl">
                                    Geonode Atlas
                                </h3>
                                <p className="text-sm text-gray-700 lg:text-base">
                                    Eksplorasi peta dan informasi geospasial
                                    yang komprehensif
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
