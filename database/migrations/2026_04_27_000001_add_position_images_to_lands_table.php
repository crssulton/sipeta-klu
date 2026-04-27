<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lands', function (Blueprint $table) {
            $table->string('foto_posisi_kiri')->nullable()->after('additional_data');
            $table->string('foto_posisi_kanan')->nullable()->after('foto_posisi_kiri');
            $table->string('foto_posisi_atas')->nullable()->after('foto_posisi_kanan');
            $table->string('foto_posisi_bawah')->nullable()->after('foto_posisi_atas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lands', function (Blueprint $table) {
            $table->dropColumn([
                'foto_posisi_kiri',
                'foto_posisi_kanan',
                'foto_posisi_atas',
                'foto_posisi_bawah',
            ]);
        });
    }
};
