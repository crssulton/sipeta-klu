<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Land extends Model
{
    protected $fillable = [
        'kode_wilayah',
        'kecamatan',
        'kelurahan',
        'tipe_hak',
        'tahun',
        'nib',
        'penggunaan',
        'nomor_hak',
        'surat_ukur',
        'luas',
        'produk',
        'luas_peta',
        'kw',
        'pemilik_pe',
        'pemilik_ak',
        'coordinates',
        'coordinate',
        'additional_data',
    ];

    protected function casts(): array
    {
        return [
            'coordinates' => 'array',
            'coordinate' => 'array',
            'additional_data' => 'array',
            'tahun' => 'integer',
            'luas' => 'decimal:2',
            'luas_peta' => 'decimal:2',
        ];
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
