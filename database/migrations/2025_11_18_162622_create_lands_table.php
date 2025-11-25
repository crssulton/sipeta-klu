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
        Schema::create('lands', function (Blueprint $table) {
            $table->id();
            $table->string('kode_wilayah')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('tipe_hak')->nullable();
            $table->integer('tahun')->nullable();
            $table->string('nib')->nullable();
            $table->string('penggunaan')->nullable();
            $table->string('nomor_hak')->nullable();
            $table->string('surat_ukur')->nullable();
            $table->decimal('luas', 10, 2)->nullable();
            $table->string('produk')->nullable();
            $table->decimal('luas_peta', 10, 2)->nullable();
            $table->string('kw')->nullable();
            $table->string('pemilik_pe')->nullable();
            $table->string('pemilik_ak')->nullable();
            $table->json('coordinates')->nullable(); // Array of coordinate pairs
            $table->json('coordinate')->nullable(); // Single coordinate pair
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
