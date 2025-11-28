import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polygon, Popup, TileLayer, LayersControl } from 'react-leaflet';
import { coordsToLeaflet, coordToLeaflet } from '@/lib/map-utils';

const { BaseLayer } = LayersControl;

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coordinates: [number, number][];
    center: [number, number];
    title?: string;
}

export function MapModal({
    open,
    onOpenChange,
    coordinates,
    center,
    title = 'Land Map',
}: MapModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="h-[90vh] min-h-[90vh] w-[90vw] min-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        View land boundaries on the map
                    </DialogDescription>
                </DialogHeader>
                <div className="h-[calc(90vh-120px)] w-full overflow-hidden rounded-lg">
                    <MapContainer
                        center={coordToLeaflet(center)}
                        zoom={16}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
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
                        {coordinates && coordinates.length > 0 && (
                            <Polygon
                                positions={coordsToLeaflet(coordinates)}
                                pathOptions={{
                                    color: 'blue',
                                    fillColor: 'lightblue',
                                    fillOpacity: 0.5,
                                }}
                            />
                        )}
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
            </DialogContent>
        </Dialog>
    );
}
