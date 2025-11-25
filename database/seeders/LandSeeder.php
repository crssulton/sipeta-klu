<?php

namespace Database\Seeders;

use App\Models\Land;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Read GeoJSON file
        $geojsonPath = database_path('seeders/data/geojson.json');
        
        if (!file_exists($geojsonPath)) {
            $this->command->error("File GeoJSON tidak ditemukan: {$geojsonPath}");
            return;
        }

        $geojsonContent = file_get_contents($geojsonPath);
        $geojson = json_decode($geojsonContent, true);

        if (!isset($geojson['features']) || !is_array($geojson['features'])) {
            $this->command->error("Format GeoJSON tidak valid");
            return;
        }

        $this->command->info("Memulai import " . count($geojson['features']) . " data tanah...");

        DB::beginTransaction();

        try {
            $imported = 0;
            $skipped = 0;
            $skippedList = [];

            foreach ($geojson['features'] as $index => $feature) {
                $properties = $feature['properties'];
                $geometry = $feature['geometry'];

                $nomorHak = $properties['Nomor_Hak'] ?? $properties['Sertifikat'] ?? '';

                // Skip jika nomor_hak sudah ada di database
                // if (Land::where('nomor_hak', $nomorHak)->exists()) {
                //     $skipped++;
                //     $skippedList[] = [
                //         'id' => $properties['ID'] ?? null,
                //         'nomor_hak' => $nomorHak,
                //         'kecamatan' => $properties['KECAMATAN'] ?? '',
                //         'kelurahan' => $properties['KELURAHAN'] ?? '',
                //     ];
                //     if (($index + 1) % 10 == 0) {
                //         $this->command->warn("Progress: " . ($index + 1) . "/" . count($geojson['features']) . " (Skipped: {$skipped})");
                //     }
                //     continue;
                // }

                $geometryType = $geometry['type'] ?? 'Polygon';
                
                // Handle berbagai tipe geometry
                if ($geometryType === 'MultiPolygon') {
                    // MultiPolygon: coordinates[0][0] untuk polygon pertama
                    $coordinates = $geometry['coordinates'][0][0] ?? [];
                } else {
                    // Polygon: coordinates[0]
                    $coordinates = $geometry['coordinates'][0] ?? [];
                }
                
                // Hitung centroid untuk coordinate tunggal
                $centroid = $this->calculateCentroid($coordinates);

                // Insert data ke tabel lands
                Land::create([
                    'kode_wilayah' => $properties['KODEWILAYA'] ?? '',
                    'kecamatan' => $properties['KECAMATAN'] ?? '',
                    'kelurahan' => $properties['KELURAHAN'] ?? '',
                    'tipe_hak' => $properties['TIPEHAK'] ?? $properties['Tipe_Hak'] ?? '',
                    'tahun' => $properties['TAHUN'] ?? 0,
                    'nib' => $properties['NIB'] ?? $properties['NIB_1'] ?? '',
                    'penggunaan' => $properties['PENGGUNAAN'] ?? $properties['Peruntukan'] ?? '',
                    'nomor_hak' => $nomorHak,
                    'surat_ukur' => $properties['Surat_Ukur'] ?? '',
                    'luas' => $properties['LUASTERTUL'] ?? $properties['Luas'] ?? 0,
                    'produk' => $properties['Produk'] ?? $properties['Penguasaan'] ?? '',
                    'luas_peta' => $properties['LUASPETA'] ?? $properties['Luas_Peta'] ?? null,
                    'kw' => $properties['KW'] ?? null,
                    'pemilik_pe' => $properties['Pemilik_Pe'] ?? $properties['Pemilik_Ak'] ?? '',
                    'pemilik_ak' => $properties['Pemilik_Ak'] ?? '',
                    'coordinates' => $coordinates, // Array of [lng, lat] pairs - Laravel auto-cast to JSON
                    'coordinate' => $centroid, // Single [lng, lat] for center point - Laravel auto-cast to JSON
                ]);

                $imported++;

                if (($index + 1) % 10 == 0) {
                    $this->command->info("Progress: " . ($index + 1) . "/" . count($geojson['features']) . " (Imported: {$imported}, Skipped: {$skipped})");
                }
            }

            DB::commit();
            $this->command->info("✓ Berhasil import {$imported} data tanah");
            
            if ($skipped > 0) {
                $this->command->warn("⊘ Melewati {$skipped} data (nomor_hak sudah ada)");
                $this->command->newLine();
                $this->command->warn("Daftar nomor_hak yang dilewati:");
                foreach ($skippedList as $item) {
                    $this->command->line("  - ID: {$item['id']}, Nomor Hak: {$item['nomor_hak']} ({$item['kecamatan']}, {$item['kelurahan']})");
                }
            }

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Calculate centroid from polygon coordinates
     */
    private function calculateCentroid(array $coordinates): array
    {
        if (empty($coordinates)) {
            return [0, 0];
        }

        $sumLat = 0;
        $sumLng = 0;
        $count = count($coordinates);

        foreach ($coordinates as $coord) {
            $sumLng += $coord[0]; // longitude
            $sumLat += $coord[1]; // latitude
        }

        return [
            $sumLng / $count, // longitude
            $sumLat / $count  // latitude
        ];
    }
}
