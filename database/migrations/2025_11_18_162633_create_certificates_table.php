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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('land_id')->constrained()->onDelete('cascade');
            $table->string('nomor_sertifikat'); // Certificate number
            $table->text('description')->nullable(); // Optional description
            $table->string('file_path'); // Store uploaded certificate file path
            $table->string('file_name'); // Original file name
            $table->string('file_type'); // mime type
            $table->integer('file_size'); // in bytes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
