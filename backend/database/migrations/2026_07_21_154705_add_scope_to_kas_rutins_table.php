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
        Schema::table('kas_rutins', function (Blueprint $table) {
            $table->string('tingkatan')->default('Komunal')->after('periode');
            $table->string('kementerian')->nullable()->after('tingkatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kas_rutins', function (Blueprint $table) {
            $table->dropColumn(['tingkatan', 'kementerian']);
        });
    }
};
