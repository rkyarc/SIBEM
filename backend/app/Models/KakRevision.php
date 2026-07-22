<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KakRevision extends Model
{
    protected $fillable = [
        'kak_id',
        'user_id',
        'status_sebelumnya',
        'status_baru',
        'catatan'
    ];

    public function kak()
    {
        return $this->belongsTo(Kak::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
