import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, LayersControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

const { BaseLayer } = LayersControl;
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { coordsToLeaflet, coordToLeaflet } from '@/lib/map-utils';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface DrawMapModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (coordinates: [number, number][], center: [number, number]) => void;
    initialCoordinates?: [number, number][];
    initialCenter?: [number, number];
}

export function DrawMapModal({
    open,
    onOpenChange,
    onSave,
    initialCoordinates,
    initialCenter = [116.235059064008, -8.27174304218052], // Default to Lombok
}: DrawMapModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [drawnCoordinates, setDrawnCoordinates] = useState<[number, number][]>(
        initialCoordinates || [],
    );
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update drawnCoordinates when initialCoordinates changes
    useEffect(() => {
        if (initialCoordinates) {
            setDrawnCoordinates(initialCoordinates);
        }
    }, [initialCoordinates]);

    useEffect(() => {
        if (mapRef.current && isMounted) {
            const provider = new OpenStreetMapProvider();
            const searchControl = new (GeoSearchControl as any)({
                provider,
                style: 'bar',
                showMarker: true,
                showPopup: false,
                autoClose: true,
                retainZoomLevel: false,
                animateZoom: true,
                keepResult: false,
                searchLabel: 'Search location...',
            });

            mapRef.current.addControl(searchControl);

            return () => {
                if (mapRef.current) {
                    mapRef.current.removeControl(searchControl);
                }
            };
        }
    }, [isMounted]);

    const handleCreated = (e: any) => {
        const layer = e.layer;
        const latLngs = layer.getLatLngs()[0];
        const coords: [number, number][] = latLngs.map((latLng: L.LatLng) => [
            latLng.lng,
            latLng.lat,
        ]);
        setDrawnCoordinates(coords);
    };

    const handleEdited = (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
            const latLngs = layer.getLatLngs()[0];
            const coords: [number, number][] = latLngs.map((latLng: L.LatLng) => [
                latLng.lng,
                latLng.lat,
            ]);
            setDrawnCoordinates(coords);
        });
    };

    const handleDeleted = () => {
        setDrawnCoordinates([]);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim() || !mapRef.current) return;

        const provider = new OpenStreetMapProvider();
        try {
            const results = await provider.search({ query: searchQuery });
            if (results.length > 0) {
                const { x, y } = results[0];
                mapRef.current.setView([y, x], 16);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSave = () => {
        if (drawnCoordinates.length > 0) {
            // Calculate center
            const lngs = drawnCoordinates.map((c) => c[0]);
            const lats = drawnCoordinates.map((c) => c[1]);
            const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;

            onSave(drawnCoordinates, [centerLng, centerLat]);
            onOpenChange(false);
        }
    };

    if (!isMounted) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] max-h-[80vh] min-w-[90vw] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Gambar Area Tanah</DialogTitle>
                    <DialogDescription>
                        Gunakan pencarian untuk menemukan lokasi, kemudian gunakan tool
                        polygon untuk menggambar batas area tanah
                    </DialogDescription>
                </DialogHeader>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari lokasi (contoh: Mataram, Lombok)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" size="default">
                        Cari
                    </Button>
                </form>

                <div className="flex-1 w-full rounded-lg overflow-hidden">
                    <MapContainer
                        center={coordToLeaflet(initialCenter)}
                        zoom={16}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                        ref={mapRef}
                    >
                        <LayersControl position="bottomleft">
                            <BaseLayer name="Standar">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    maxZoom={19}
                                />
                            </BaseLayer>
                            <BaseLayer checked name="Satelit">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.google.com/maps">Google</a>'
                                    url="http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                                    maxZoom={22}
                                />
                            </BaseLayer>
                        </LayersControl>
                        <FeatureGroup>
                            <EditControl
                                position="topright"
                                onCreated={handleCreated}
                                onEdited={handleEdited}
                                onDeleted={handleDeleted}
                                draw={{
                                    rectangle: false,
                                    circle: false,
                                    circlemarker: false,
                                    marker: false,
                                    polyline: false,
                                    polygon: {
                                        allowIntersection: false,
                                        shapeOptions: {
                                            color: 'blue',
                                            fillColor: 'lightblue',
                                            fillOpacity: 0.5,
                                        },
                                    },
                                }}
                            />
                            {/* Render existing polygon */}
                            {drawnCoordinates.length > 0 && (
                                <Polygon
                                    positions={coordsToLeaflet(drawnCoordinates)}
                                    pathOptions={{
                                        color: 'blue',
                                        fillColor: 'lightblue',
                                        fillOpacity: 0.5,
                                    }}
                                />
                            )}
                        </FeatureGroup>
                    </MapContainer>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={drawnCoordinates.length === 0}
                    >
                        Simpan Area
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
