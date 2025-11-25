import SiteHeader from '@/components/site-header';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PencarianBatasAdministrasi() {
    const { auth } = usePage<SharedData>().props;
    const [desa, setDesa] = useState(true);
    const [kecamatan1, setKecamatan1] = useState(false);
    const [kecamatan2, setKecamatan2] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResult(true);
    };

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
                        {/* Left Panel - Pengaturan */}
                        <div className="flex flex-col lg:col-span-1">
                            <div>
                                <div className="inline-block rounded-t-2xl bg-cyan-500 px-8 py-4 lg:px-12 lg:py-6">
                                    <h2 className="text-2xl font-bold text-white lg:text-3xl">
                                        Pengaturan
                                    </h2>
                                </div>
                            </div>
                            <div className="rounded-3xl rounded-tl-none bg-white p-6 shadow-2xl lg:p-8">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {/* Batas Desa */}
                                    <div className="flex items-center justify-between rounded-full bg-gray-300 px-6 py-4 lg:py-5">
                                        <span className="text-lg font-bold text-gray-400 lg:text-xl">
                                            Batas Desa
                                        </span>
                                        <button
                                            type="button"
                                            className={`flex h-8 w-8 items-center justify-center rounded bg-gray-400 ${desa ? '' : 'opacity-50'}`}
                                            onClick={() => setDesa(!desa)}
                                        >
                                            {desa ? (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="h-6 w-6 text-white"
                                                >
                                                    <path
                                                        d="M5 13l4 4L19 7"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <span className="block h-6 w-6 rounded bg-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    {/* Batas Kecamatan 1 */}
                                    <div className="flex items-center justify-between rounded-full bg-gray-300 px-6 py-4 lg:py-5">
                                        <span className="text-lg font-bold text-gray-400 lg:text-xl">
                                            Batas Kecamatan
                                        </span>
                                        <button
                                            type="button"
                                            className={`flex h-8 w-8 items-center justify-center rounded bg-gray-400 ${kecamatan1 ? '' : 'opacity-50'}`}
                                            onClick={() =>
                                                setKecamatan1(!kecamatan1)
                                            }
                                        >
                                            {kecamatan1 ? (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="h-6 w-6 text-white"
                                                >
                                                    <path
                                                        d="M5 13l4 4L19 7"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <span className="block h-6 w-6 rounded bg-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    {/* Batas Kecamatan 2 */}
                                    <div className="flex items-center justify-between rounded-full bg-gray-300 px-6 py-4 lg:py-5">
                                        <span className="text-lg font-bold text-gray-400 lg:text-xl">
                                            Batas Kecamatan
                                        </span>
                                        <button
                                            type="button"
                                            className={`flex h-8 w-8 items-center justify-center rounded bg-gray-400 ${kecamatan2 ? '' : 'opacity-50'}`}
                                            onClick={() =>
                                                setKecamatan2(!kecamatan2)
                                            }
                                        >
                                            {kecamatan2 ? (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="h-6 w-6 text-white"
                                                >
                                                    <path
                                                        d="M5 13l4 4L19 7"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <span className="block h-6 w-6 rounded bg-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    {/* Button ATRIBUT */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full cursor-pointer rounded-full bg-cyan-500 px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-cyan-600 lg:py-5 lg:text-2xl"
                                        >
                                            ATRIBUT
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* Right Panel - Map Preview */}
                        <div className="flex flex-col lg:col-span-2">
                            <div>
                                <div className="inline-block rounded-t-2xl bg-cyan-500 px-8 py-4 lg:px-12 lg:py-6">
                                    <h2 className="text-2xl font-bold text-white lg:text-3xl">
                                        Panel Hasil Cepat
                                    </h2>
                                </div>
                            </div>
                            <div className="flex-1 rounded-3xl rounded-tl-none bg-white p-6 shadow-2xl lg:p-8">
                                {showResult ? (
                                    <div className="relative flex h-full w-full flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                                        {/* Map Preview */}
                                        <div className="flex h-[calc(100vh-25rem)] flex-1 items-center justify-center text-gray-400">
                                            <p className="text-center text-lg">
                                                Ini adalah preview peta dengan
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-1 items-center justify-center text-gray-500">
                                        <p className="text-center text-lg">
                                            Hasil pencarian akan ditampilkan di
                                            sini
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
