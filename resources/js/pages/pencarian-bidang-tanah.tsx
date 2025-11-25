import { SearchIcon } from '@/components/icons';
import SiteHeader from '@/components/site-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Land, type SharedData, CustomFieldDefinition } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    Marker,
    Polygon,
    Popup,
    TileLayer,
    useMapEvents,
} from 'react-leaflet';
import { parseCoordinates, coordsToLeaflet, coordToLeaflet } from '@/lib/map-utils';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props extends SharedData {
    lands: Land[];
    customFields: CustomFieldDefinition[];
    filters: {
        nomor_sertifikat?: string;
        nama_pemilik?: string;
        lokasi?: string;
    };
}

export default function PencarianBidangTanah() {
    const props = usePage<Props>().props;
    const { lands, customFields, filters } = props;
    const [isMounted, setIsMounted] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [nomorSertifikat, setNomorSertifikat] = useState(
        filters.nomor_sertifikat || '',
    );
    const [namaPemilik, setNamaPemilik] = useState(filters.nama_pemilik || '');
    const [lokasi, setLokasi] = useState(filters.lokasi || '');
    const [selectedLand, setSelectedLand] = useState<Land | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    // Component to handle map click events
    function MapClickHandler() {
        useMapEvents({
            click: (e) => {
                // Check if click is not on a marker or polygon
                const target = e.originalEvent.target as HTMLElement;
                if (!target.closest('.leaflet-marker-icon') && 
                    !target.closest('.leaflet-popup')) {
                    setSelectedLand(null);
                }
            },
        });
        return null;
    }

    // Parse coordinates using helper from map-utils

    // Filter lands based on search criteria
    const filteredLands = lands.filter((land) => {
        let matches = true;

        if (nomorSertifikat) {
            // Check in nomor_hak or certificates
            const matchesNomor = land.nomor_hak?.toLowerCase().includes(nomorSertifikat.toLowerCase()) ?? false;
            const matchesCertificate = land.certificates?.some(cert => 
                cert.nomor_sertifikat?.toLowerCase().includes(nomorSertifikat.toLowerCase())
            ) ?? false;
            matches = matches && (matchesNomor || matchesCertificate);
        }

        if (namaPemilik) {
            const matchesPemilik = 
                (land.pemilik_pe?.toLowerCase().includes(namaPemilik.toLowerCase()) ?? false) ||
                (land.pemilik_ak?.toLowerCase().includes(namaPemilik.toLowerCase()) ?? false);
            matches = matches && matchesPemilik;
        }

        if (lokasi) {
            const matchesLokasi = 
                (land.kelurahan?.toLowerCase().includes(lokasi.toLowerCase()) ?? false) ||
                (land.kecamatan?.toLowerCase().includes(lokasi.toLowerCase()) ?? false);
            matches = matches && matchesLokasi;
        }

        return matches;
    });

    // Use filtered lands for display, or all lands if no filter
    const displayLands = nomorSertifikat || namaPemilik || lokasi ? filteredLands : lands;
    
    // Calculate map center based on filtered results
    const calculateMapCenter = (): [number, number] => {
        if (selectedLand?.coordinate) {
            const coord = parseCoordinates(selectedLand.coordinate) as [number, number];
            return [coord[1], coord[0]];
        }
        
        if (displayLands.length > 0) {
            const firstLand = displayLands[0];
            const coord = parseCoordinates(firstLand.coordinate) as [number, number];
            if (coord.length === 2) {
                return [coord[1], coord[0]];
            }
        }
        
        // Default center for Lombok
        return [-8.6529, 116.3249];
    };

    const mapCenter = calculateMapCenter();
    const mapZoom = selectedLand ? 16 : displayLands.length > 0 && (nomorSertifikat || namaPemilik || lokasi) ? 14 : 11;

    useEffect(() => {
        setIsMounted(true);
        
        // Add custom CSS to move zoom controls to bottom-right
        const style = document.createElement('style');
        style.textContent = `
            .leaflet-top.leaflet-left {
                top: auto !important;
                bottom: 20px !important;
                left: auto !important;
                right: 20px !important;
            }
            .leaflet-control-zoom {
                border: 2px solid rgba(0,0,0,0.2) !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
            }
            .leaflet-control-zoom a {
                width: 36px !important;
                height: 36px !important;
                line-height: 36px !important;
                font-size: 20px !important;
                font-weight: bold !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter akan dilakukan di client-side, tidak perlu router.get
        // Tapi tetap update URL untuk bookmark/sharing
        router.get(
            '/pencarian-bidang-tanah',
            {
                nomor_sertifikat: nomorSertifikat,
                nama_pemilik: namaPemilik,
                lokasi: lokasi,
            },
            { preserveState: true },
        );
    };

    const clearFilters = () => {
        setNomorSertifikat('');
        setNamaPemilik('');
        setLokasi('');
        setSelectedLand(null);
        router.get('/pencarian-bidang-tanah', {}, { preserveState: true });
    };

    const openInGoogleMaps = (land: Land) => {
        const coord = parseCoordinates(land.coordinate) as [number, number];
        if (coord.length === 2) {
            // Format: https://www.google.com/maps?q=latitude,longitude
            const url = `https://www.google.com/maps?q=${coord[1]},${coord[0]}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Header - Fixed at top */}
            <div className="pointer-events-auto absolute top-0 left-0 right-0 z-20 bg-cyan-500 shadow-md">
                <div className="container mx-auto">
                    <SiteHeader />
                </div>
            </div>

            {/* Full Screen Map */}
            {isMounted && (
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    scrollWheelZoom={true}
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                    }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />
                    
                    {/* Map click handler to deselect */}
                    <MapClickHandler />
                    
                    {/* Render all polygons from displayLands */}
                    {displayLands.map((land) => {
                        const coordinates = parseCoordinates(land.coordinates) as [number, number][];
                        const center = parseCoordinates(land.coordinate) as [number, number];
                        
                        if (coordinates.length === 0 || center.length !== 2) return null;
                        
                        const isSelected = selectedLand?.id === land.id;
                        
                        return (
                            <Polygon
                                key={land.id}
                                positions={coordsToLeaflet(coordinates)}
                                pathOptions={{
                                    color: isSelected ? '#f59e0b' : '#0ea5e9',
                                    fillColor: isSelected ? '#fbbf24' : '#06b6d4',
                                    fillOpacity: isSelected ? 0.6 : 0.4,
                                    weight: isSelected ? 4 : 2,
                                }}
                                eventHandlers={{
                                    click: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        setSelectedLand(land);
                                    },
                                }}
                            />
                        );
                    })}
                    
                    {/* Render markers */}
                    {displayLands.map((land) => {
                        const center = parseCoordinates(land.coordinate) as [number, number];
                        if (center.length !== 2) return null;
                        
                        const isSelected = selectedLand?.id === land.id;
                        
                        return (
                            <Marker
                                key={`marker-${land.id}`}
                                position={coordToLeaflet(center)}
                                eventHandlers={{
                                    click: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        setSelectedLand(land);
                                    },
                                }}
                            >
                                {isSelected && (
                                    <Popup
                                        closeButton={false}
                                        autoClose={false}
                                        closeOnClick={false}
                                    >
                                        <div className="text-sm">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="font-bold">
                                                    {land.nomor_hak || 'Tidak ada nomor'}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLand(null);
                                                    }}
                                                    className="ml-2 rounded p-1 hover:bg-gray-200"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <p>Pemilik: {land.pemilik_pe || land.pemilik_ak || '-'}</p>
                                            <p>Luas: {land.luas || '-'}</p>
                                        </div>
                                    </Popup>
                                )}
                            </Marker>
                        );
                    })}
                </MapContainer>
            )}

            {/* Filter Panel - Top Left (below header) */}
            <div className="pointer-events-none absolute top-0 left-0 z-10 p-4 sm:p-6 pt-20 sm:pt-36">
                <div className="pointer-events-auto flex items-start gap-2 md:w-[350px] w-[90vw]">
                    {/* Toggle Button */}
                    {!isFilterOpen && (
                        <Button
                            onClick={() => setIsFilterOpen(true)}
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-lg bg-white text-gray-700 shadow-lg hover:bg-gray-50"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    )}

                    {/* Filter Panel */}
                    {isFilterOpen && (
                        <div className="w-full max-w-sm rounded-lg bg-white shadow-2xl sm:max-w-md">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Pencarian Bidang Tanah
                                </h2>
                                <Button
                                    onClick={() => setIsFilterOpen(false)}
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 shrink-0"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="p-4">
                                <div className="space-y-3">
                                    {/* Nomor Sertifikat */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Nomor Sertifikat
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Cari nomor sertifikat..."
                                                value={nomorSertifikat}
                                                onChange={(e) =>
                                                    setNomorSertifikat(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                            />
                                            <SearchIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Nama Pemilik */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Nama Pemilik
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Cari nama pemilik..."
                                                value={namaPemilik}
                                                onChange={(e) =>
                                                    setNamaPemilik(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                            />
                                            <SearchIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Lokasi */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Lokasi
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Desa/Kecamatan..."
                                                value={lokasi}
                                                onChange={(e) =>
                                                    setLokasi(e.target.value)
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                            />
                                            <SearchIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                                        >
                                            Cari
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clearFilters}
                                            className="shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            {/* Filter Results Summary */}
                            {(nomorSertifikat || namaPemilik || lokasi) && (
                                <div className="border-t border-gray-200 bg-blue-50 p-4">
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                                        Hasil Pencarian
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        Ditemukan <span className="font-bold">{filteredLands.length}</span> bidang tanah
                                    </p>
                                    {filteredLands.length > 0 && (
                                        <p className="mt-1 text-xs text-gray-600">
                                            Klik pada peta untuk melihat detail
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedLand} onOpenChange={(open) => !open && setSelectedLand(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Bidang Tanah</DialogTitle>
                    </DialogHeader>
                    {selectedLand && (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Nomor Hak
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {selectedLand.nomor_hak || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Pemilik
                                        </p>
                                        <p className="text-base text-gray-900">
                                            {selectedLand.pemilik_pe || selectedLand.pemilik_ak || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Lokasi
                                        </p>
                                        <p className="text-base text-gray-900">
                                            {selectedLand.kelurahan || '-'},{' '}
                                            {selectedLand.kecamatan || '-'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Luas
                                            </p>
                                            <p className="text-base text-gray-900">
                                                {selectedLand.luas || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Tipe Hak
                                            </p>
                                            <p className="text-base text-gray-900">
                                                {selectedLand.tipe_hak || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Custom Fields */}
                                    {customFields.length > 0 && selectedLand.additional_data && Object.keys(selectedLand.additional_data).length > 0 && (
                                        <div className="border-t pt-3 space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-900">Data Tambahan</h3>
                                            {customFields.map((field) => {
                                                const value = selectedLand.additional_data?.[field.field_key];
                                                if (value === null || value === undefined || value === '') return null;
                                                
                                                let displayValue: string;
                                                if (Array.isArray(value)) {
                                                    displayValue = value.join(', ');
                                                } else if (field.field_type === 'date' && typeof value === 'string') {
                                                    displayValue = new Date(value).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    });
                                                } else {
                                                    displayValue = String(value);
                                                }
                                                
                                                return (
                                                    <div key={field.id}>
                                                        <p className="text-sm font-medium text-gray-500">
                                                            {field.field_label}
                                                        </p>
                                                        <p className="text-base text-gray-900">
                                                            {displayValue}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="border-t pt-4">
                                    <Button
                                        onClick={() => openInGoogleMaps(selectedLand)}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                                    >
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Buka di Google Maps
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
