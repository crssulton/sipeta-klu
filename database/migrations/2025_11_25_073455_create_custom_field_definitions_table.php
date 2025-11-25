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
        Schema::create('custom_field_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('field_key')->unique()->comment('Unique identifier for the field (snake_case)');
            $table->string('field_label')->comment('Display name for the field');
            $table->enum('field_type', ['text', 'textarea', 'select', 'radio', 'checkbox', 'number', 'date'])->comment('Type of input field');
            $table->json('field_options')->nullable()->comment('Options for select/radio/checkbox fields');
            $table->boolean('is_visible_in_list')->default(true)->comment('Show in land list table');
            $table->boolean('is_visible_in_detail')->default(true)->comment('Show in land detail modal');
            $table->boolean('is_required')->default(false)->comment('Field is required');
            $table->boolean('is_active')->default(true)->comment('Field is active and can be used');
            $table->integer('order')->default(0)->comment('Sort order in forms');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_field_definitions');
    }
};
