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
        Schema::create('pagus', function (Blueprint $table) {
            $table->id();
            $table->string('kementerian');
            $table->decimal('pagu_awal', 15, 2)->default(0);
            $table->string('tahun_periode')->default('2026');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagus');
    }
};
