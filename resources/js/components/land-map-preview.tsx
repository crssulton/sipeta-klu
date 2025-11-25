import { Card } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { coordsToLeaflet, coordToLeaflet } from '@/lib/map-utils';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LandMapPreviewProps {
    coordinates: [number, number][];
    center: [number, number];
    title?: string;
}

export function LandMapPreview({
    coordinates,
    center,
    title,
}: LandMapPreviewProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Card className="overflow-hidden">
            <div className="border-b bg-muted p-4">
                <h3 className="text-sm font-semibold">
                    {title || 'Peta Lokasi Tanah'}
                </h3>
            </div>
            <div className="h-[400px] w-full">
                <MapContainer
                    center={coordToLeaflet(center)}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polygon
                        positions={coordsToLeaflet(coordinates)}
                        pathOptions={{
                            color: 'blue',
                            fillColor: 'lightblue',
                            fillOpacity: 0.5,
                        }}
                    />
                    <Marker position={coordToLeaflet(center)}>
                        <Popup>
                            <a
                                href={`https://www.google.com/maps?q=${center[1]},${center[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-600 underline"
                            >
                                Lihat di Google Maps
                            </a>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </Card>
    );
}
