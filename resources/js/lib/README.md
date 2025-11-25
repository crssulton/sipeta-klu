# Map Utilities

Helper functions untuk konversi koordinat UTM ke WGS84 dan manipulasi koordinat untuk Leaflet maps.

## Fungsi Utama

### `isUTMCoordinate(coord)`
Deteksi apakah koordinat dalam format UTM atau WGS84.

**UTM coordinates untuk area Lombok:**
- Easting: 400000-450000
- Northing: 9000000-9100000

### `convertUTMtoWGS84(coord)`
Konversi koordinat dari UTM Zone 50S (EPSG:32750) ke WGS84 (EPSG:4326).

**Input:** `[easting, northing]` atau `[lng, lat]`  
**Output:** `[lng, lat]` in WGS84

### `parseCoordinates(coordString)`
Parse koordinat dari berbagai format (JSON string, array) dan otomatis convert UTM ke WGS84.

**Support formats:**
- JSON string: `"[[116.23, -8.27], ...]"`
- Array of coords: `[[116.23, -8.27], ...]`
- Single coord: `[116.23, -8.27]`
- UTM coords: `[[405680, 9069871], ...]` → auto-convert ke WGS84

### `coordsToLeaflet(coords)`
Konversi array koordinat ke format Leaflet `[lat, lng]` dari `[lng, lat]`.  
Juga handle konversi UTM jika diperlukan.

### `coordToLeaflet(coord)`
Konversi single koordinat ke format Leaflet `[lat, lng]` dari `[lng, lat]`.  
Juga handle konversi UTM jika diperlukan.

## Penggunaan

```tsx
import { 
    parseCoordinates, 
    coordsToLeaflet, 
    coordToLeaflet 
} from '@/lib/map-utils';

// Parse dan convert koordinat dari database
const coordinates = parseCoordinates(land.coordinates);
const center = parseCoordinates(land.coordinate);

// Render polygon di Leaflet
<Polygon positions={coordsToLeaflet(coordinates)} />

// Render marker di Leaflet
<Marker position={coordToLeaflet(center)} />
```

## Data Sources

### WGS84 Data (Sambik Bangkol, Rempek, dll)
Format: `[116.235059, -8.271743]`  
✅ Langsung compatible dengan Leaflet

### UTM Data (Tanjung, Teniga, dll)
Format: `[405680.62, 9069871.94]`  
✅ Auto-convert ke WGS84 dengan proj4

## Technical Details

- **Projection System:** UTM Zone 50S (EPSG:32750) for Lombok
- **Output System:** WGS84 (EPSG:4326)
- **Library:** proj4 v2.x
- **Koordinat Range Lombok:** 
  - Longitude: ~116.0 - 116.8
  - Latitude: ~-8.9 - -8.0
