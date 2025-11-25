import SiteHeader from '@/components/site-header';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-screen overflow-hidden bg-cyan-400">
            {/* Background Image with Gradient Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/assets/backgroud-1.png)',
                }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/90 to-transparent" />

            <div className="container mx-auto">
                {/* Header Navigation */}
                <SiteHeader />

                {/* Main Content */}
                <div className="relative flex min-h-[calc(100vh-185px)] flex-col justify-between md:min-h-[calc(100vh-285px)] lg:min-h-[calc(100vh-380px)]">
                    {/* Title - Center on mobile, left on desktop */}
                    <div className="mt-[10vh] flex-1 px-4 pt-8 pb-6 text-center sm:px-8 sm:pb-6 sm:text-left md:pl-20 lg:mt-10 lg:pl-40">
                        <div className="text-7xl font-extrabold text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-9xl">
                            SIPETA
                        </div>
                        <div className="text-4xl font-extrabold text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                            LOMBOK UTARA
                        </div>
                    </div>

                    {/* Mobile Layout: Maskot left, Officials right */}
                    <div className="relative px-4 sm:hidden">
                        <div className="flex items-end justify-between">
                            {/* Maskot - Left side, smaller */}
                            <div className="relative z-30 -mb-10 flex-shrink-0">
                                <img
                                    src="/assets/maskot.png"
                                    alt="Maskot SIPETA"
                                    className="h-28 w-auto object-contain drop-shadow-2xl"
                                />
                            </div>

                            {/* Bupati & Wakil - Right side, larger */}
                            <div className="relative -mr-3 -mb-5 flex items-end">
                                <img
                                    src="/assets/user-1.png"
                                    alt="Bupati"
                                    className="h-44 w-auto object-contain drop-shadow-2xl"
                                />
                                <img
                                    src="/assets/user-2.png"
                                    alt="Wakil Bupati"
                                    className="h-44 w-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop/Tablet Layout */}
                    <div className="hidden gap-8 px-8 sm:grid md:grid-cols-2 md:px-12 lg:gap-12 lg:px-16">
                        {/* Left Side - Maskot & Tagline */}
                        <div className="z-30 -mb-44 flex flex-row items-end gap-4">
                            <div className="relative">
                                <img
                                    src="/assets/maskot.png"
                                    alt="Maskot SIPETA"
                                    className="max-h-60 min-h-60 max-w-60 min-w-60 drop-shadow-2xl lg:max-h-96 lg:min-h-96 lg:max-w-96 lg:min-w-96"
                                />
                            </div>
                            <div className="mb-10 w-full space-y-1 text-left text-lg font-bold text-white md:space-y-2 md:text-xl lg:text-2xl xl:text-4xl">
                                <div className="text-nowrap">Mau cari apa?</div>
                                <div>SIPETA aja!</div>
                            </div>
                        </div>

                        {/* Right Side - Bupati & Wakil Bupati */}
                        <div className="flex items-end justify-center">
                            <div className="z-10 -mr-20 -mb-5 flex flex-row items-end justify-center">
                                <img
                                    src="/assets/user-1.png"
                                    alt="Bupati Lombok Utara"
                                    className="h-64 w-auto object-contain drop-shadow-2xl md:h-80 lg:h-96 xl:h-[32rem]"
                                />
                                <img
                                    src="/assets/user-2.png"
                                    alt="Wakil Bupati Lombok Utara"
                                    className="h-64 w-auto object-contain drop-shadow-2xl md:h-80 lg:h-96 xl:h-[32rem]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar with Tagline & Website */}
            <div className="relative bottom-0 z-20 flex h-28 w-full flex-col items-center justify-center gap-1 bg-cyan-400 text-center sm:h-40 md:h-48 lg:h-56 lg:flex-row">
                <div className="text-lg font-bold text-white sm:hidden">
                    <div>Mau cari apa?</div>
                    <div>SIPETA aja!</div>
                </div>
                <div className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-cyan-600 sm:hidden sm:text-base">
                    www.sipetalombokutara.id
                </div>
            </div>
        </div>
    );
}
