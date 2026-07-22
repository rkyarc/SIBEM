<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagu extends Model
{
    protected $fillable = [
        'kementerian',
        'pagu_awal',
        'tahun_periode'
    ];
}
