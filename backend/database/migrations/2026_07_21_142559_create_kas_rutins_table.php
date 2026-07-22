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
        Schema::create('kas_rutins', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->decimal('nominal', 15, 2);
            $table->enum('periode', ['mingguan', 'bulanan', 'tahunan']);
            $table->integer('hari_mingguan')->nullable(); // 1 = Senin, 7 = Minggu
            $table->integer('tanggal_bulanan')->nullable(); // 1 - 31
            $table->integer('bulan_tahunan')->nullable(); // 1 - 12
            $table->integer('tanggal_tahunan')->nullable(); // 1 - 31
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kas_rutins');
    }
};
