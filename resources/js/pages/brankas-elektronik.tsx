import { DocumentIcon, SearchIcon } from '@/components/icons';
import DownloadIcon from '@/components/icons/download-1-icon';
import SiteHeader from '@/components/site-header';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function BrankasElektronik() {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');

    // Dummy data
    const totalDokumen = 450;
    const dokumenTerbaru = 12;
    const hasil = Array(4).fill({
        nama: 'Peta Desa Tanjung.pdf',
        url: '#',
    });

    return (
        <div className="relative min-h-screen bg-cyan-400">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: 'url(/assets/background-2.png)' }}
            />
            <div className="relative z-10">
                <div className="container mx-auto">
                    <SiteHeader />
                </div>
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                        {/* Left Panel - Filters & Info */}
                        <div className="flex flex-col lg:col-span-1">
                            <div>
                                <div className="inline-block rounded-t-2xl bg-cyan-500 px-8 py-4 lg:px-12 lg:py-6">
                                    <h2 className="text-2xl font-bold text-white lg:text-3xl">
                                        Pencarian Dokumen
                                    </h2>
                                </div>
                            </div>
                            <div className="rounded-3xl rounded-tl-none bg-white p-6 shadow-2xl lg:p-8">
                                {/* Info */}
                                <div className="mb-6 space-y-4">
                                    <div className="flex w-full items-center justify-between rounded-2xl bg-cyan-500 px-8 py-4 text-center">
                                        <div className="text-lg font-bold text-white">
                                            Total Dokumen
                                        </div>
                                        <div className="text-3xl font-bold text-white">
                                            {totalDokumen}
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between rounded-2xl bg-cyan-500 px-8 py-4 text-center">
                                        <div className="text-lg font-bold text-white">
                                            Dokumen Terbaru
                                        </div>
                                        <div className="text-3xl font-bold text-white">
                                            {dokumenTerbaru}
                                        </div>
                                    </div>
                                </div>
                                {/* Filters */}
                                <div className="mb-6">
                                    <h3 className="mb-2 text-xl font-bold text-gray-700">
                                        Filters
                                    </h3>
                                    <div className="rounded-3xl bg-gray-100 p-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-2xl font-bold text-gray-500">
                                                Jenis Dokumen
                                            </span>
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                placeholder="Jenis Dokumen (SK)"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                className="focus:ring-cybg-cyan-500 w-full rounded-full border-0 bg-white px-6 py-4 text-gray-600 placeholder-gray-500 focus:ring-2 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1/2 right-4 -translate-y-1/2"
                                            >
                                                <SearchIcon className="h-6 w-6 text-gray-500" />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className="w-full cursor-pointer rounded-full bg-cyan-500 py-4 text-xl font-bold text-white hover:bg-cyan-600"
                                        >
                                            Cari Dokumen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Panel - Hasil Pencarian */}
                        <div className="flex flex-col lg:col-span-2">
                            <div>
                                <div className="inline-block rounded-t-2xl bg-cyan-500 px-8 py-4 lg:px-12 lg:py-6">
                                    <h2 className="text-2xl font-bold text-white lg:text-3xl">
                                        Hasil Pencarian
                                    </h2>
                                </div>
                            </div>
                            <div className="flex-1 rounded-3xl rounded-tl-none bg-white p-6 shadow-2xl lg:p-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                    {hasil.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center space-x-4 rounded-xl border border-cyan-500 px-3 py-2 text-cyan-500 md:px-3 md:py-3"
                                        >
                                            <DocumentIcon className="h-6 w-6 md:h-10 md:w-10" />
                                            <div className="flex-1 text-sm font-bold md:text-lg">
                                                {item.nama}
                                            </div>
                                            <a
                                                href={item.url}
                                                className="ml-4"
                                                download
                                            >
                                                <DownloadIcon className="h-4 w-4 md:h-6 md:w-6" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
