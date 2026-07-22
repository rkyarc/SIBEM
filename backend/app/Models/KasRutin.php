<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KasRutin extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'nominal',
        'periode',
        'hari_mingguan',
        'tanggal_bulanan',
        'bulan_tahunan',
        'tanggal_tahunan',
        'tingkatan',
        'kementerian',
    ];
}
