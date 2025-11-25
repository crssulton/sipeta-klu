import proj4 from 'proj4';

// Define UTM Zone 50S projection (for Lombok area)
proj4.defs('EPSG:32750', '+proj=utm +zone=50 +south +datum=WGS84 +units=m +no_defs');

/**
 * Helper function to detect if coordinates are in UTM format
 * UTM coordinates for Lombok are typically:
 * - Easting: 400000-450000
 * - Northing: 9000000-9100000
 */
export const isUTMCoordinate = (coord: [number, number]): boolean => {
    return coord[0] > 1000 && coord[1] > 1000000;
};

/**
 * Convert UTM Zone 50S coordinates to WGS84 (standard lat/lng)
 * @param coord - [easting, northing] in UTM or [lng, lat] in WGS84
 * @returns [lng, lat] in WGS84
 */
export const convertUTMtoWGS84 = (coord: [number, number]): [number, number] => {
    if (!isUTMCoordinate(coord)) {
        return coord; // Already in WGS84
    }
    
    try {
        // Convert from UTM Zone 50S (EPSG:32750) to WGS84 (EPSG:4326)
        const [lng, lat] = proj4('EPSG:32750', 'EPSG:4326', [coord[0], coord[1]]);
        return [lng, lat];
    } catch (error) {
        console.error('Error converting UTM to WGS84:', error, coord);
        return coord;
    }
};

/**
 * Parse coordinates from various formats and convert UTM to WGS84 if needed
 * @param coordString - Can be JSON string, array of coordinates, or single coordinate
 * @returns Parsed and converted coordinates
 */
export const parseCoordinates = (
    coordString: string | [number, number][] | [number, number] | null | undefined,
): [number, number][] | [number, number] | [] => {
    if (!coordString) return [];
    
    if (typeof coordString !== 'string') {
        // Convert UTM coordinates if needed
        if (Array.isArray(coordString[0])) {
            // Array of coordinates (polygon)
            return (coordString as [number, number][]).map(coord => convertUTMtoWGS84(coord));
        } else {
            // Single coordinate (point)
            return convertUTMtoWGS84(coordString as [number, number]);
        }
    }
    
    try {
        const parsed = JSON.parse(coordString);
        // Convert UTM coordinates if needed
        if (Array.isArray(parsed[0])) {
            // Array of coordinates (polygon)
            return parsed.map((coord: [number, number]) => convertUTMtoWGS84(coord));
        } else {
            // Single coordinate (point)
            return convertUTMtoWGS84(parsed);
        }
    } catch {
        return [];
    }
};

/**
 * Convert coordinates to Leaflet format [lat, lng] from [lng, lat]
 * Also handles UTM conversion if needed
 * @param coords - Array of [lng, lat] coordinates
 * @returns Array of [lat, lng] for Leaflet
 */
export const coordsToLeaflet = (coords: [number, number][]): [number, number][] => {
    return coords.map(coord => {
        const [lng, lat] = convertUTMtoWGS84(coord);
        return [lat, lng];
    });
};

/**
 * Convert single coordinate to Leaflet format [lat, lng] from [lng, lat]
 * Also handles UTM conversion if needed
 * @param coord - [lng, lat] coordinate
 * @returns [lat, lng] for Leaflet
 */
export const coordToLeaflet = (coord: [number, number]): [number, number] => {
    const [lng, lat] = convertUTMtoWGS84(coord);
    return [lat, lng];
};
