<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kak extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama_kegiatan',
        'divisi',
        'link_drive',
        'status',
        'tipe_pengajuan',
        'catatan_revisi',
        'latar_belakang',
        'tujuan',
        'sasaran',
        'tempat',
        'tanggal_pelaksanaan',
        'anggaran_estimasi',
        'penanggung_jawab',
    ];

    public function revisions()
    {
        return $this->hasMany(KakRevision::class);
    }
}
