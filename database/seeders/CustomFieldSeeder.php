<?php

namespace Database\Seeders;

use App\Models\CustomFieldDefinition;
use Illuminate\Database\Seeder;

class CustomFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            [
                'field_key' => 'sumber_data',
                'field_label' => 'Sumber Data',
                'field_type' => 'select',
                'field_options' => ['BPN', 'Desa', 'Survey', 'Lainnya'],
                'is_visible_in_list' => true,
                'is_visible_in_detail' => true,
                'is_required' => true,
                'is_active' => true,
                'order' => 10,
            ],
            [
                'field_key' => 'status_pembayaran',
                'field_label' => 'Status Pembayaran',
                'field_type' => 'radio',
                'field_options' => ['Lunas', 'Belum Lunas', 'Cicilan'],
                'is_visible_in_list' => true,
                'is_visible_in_detail' => true,
                'is_required' => false,
                'is_active' => true,
                'order' => 20,
            ],
            [
                'field_key' => 'tahun_terbit',
                'field_label' => 'Tahun Terbit',
                'field_type' => 'number',
                'field_options' => null,
                'is_visible_in_list' => false,
                'is_visible_in_detail' => true,
                'is_required' => false,
                'is_active' => true,
                'order' => 30,
            ],
            [
                'field_key' => 'dokumen_pendukung',
                'field_label' => 'Dokumen Pendukung',
                'field_type' => 'checkbox',
                'field_options' => ['KTP', 'KK', 'Surat Kuasa', 'Akta', 'PBB'],
                'is_visible_in_list' => false,
                'is_visible_in_detail' => true,
                'is_required' => false,
                'is_active' => true,
                'order' => 40,
            ],
            [
                'field_key' => 'tanggal_survey',
                'field_label' => 'Tanggal Survey',
                'field_type' => 'date',
                'field_options' => null,
                'is_visible_in_list' => false,
                'is_visible_in_detail' => true,
                'is_required' => false,
                'is_active' => true,
                'order' => 50,
            ],
            [
                'field_key' => 'keterangan_tambahan',
                'field_label' => 'Keterangan Tambahan',
                'field_type' => 'textarea',
                'field_options' => null,
                'is_visible_in_list' => false,
                'is_visible_in_detail' => true,
                'is_required' => false,
                'is_active' => true,
                'order' => 60,
            ],
        ];

        foreach ($fields as $field) {
            CustomFieldDefinition::create($field);
        }
    }
}
