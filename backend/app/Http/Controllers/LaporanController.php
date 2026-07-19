<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proker;
use App\Models\Kak;
use App\Models\Anggaran;

class LaporanController extends Controller
{
    public function index()
    {
        $prokers = Proker::all();
        $laporanData = [];

        foreach ($prokers as $proker) {
            // Get KAK status (if any)
            $kak = Kak::where('nama_kegiatan', $proker->nama_proker)
                      ->where('tipe_pengajuan', 'kak')
                      ->first();
            $statusKak = $kak ? $kak->status : 'Belum Diajukan';

            // Get LPJ status (if any)
            $lpj = Kak::where('nama_kegiatan', $proker->nama_proker)
                      ->where('tipe_pengajuan', 'lpj')
                      ->first();
            $statusLaporan = $lpj ? $lpj->status : 'Belum Diajukan';

            // Get total Pengeluaran Anggaran
            $anggaran = Anggaran::where('nama_kegiatan', $proker->nama_proker)
                                ->where('jenis', 'pengeluaran')
                                ->sum('jumlah');

            $laporanData[] = [
                'id' => $proker->id,
                'namaKegiatan' => $proker->nama_proker,
                'kementerian' => $proker->divisi,
                'tanggal' => $proker->tanggal_pelaksanaan,
                'statusKak' => $statusKak,
                'anggaran' => (float) $anggaran,
                'statusLaporan' => $statusLaporan,
            ];
        }

        return response()->json([
            'laporanData' => $laporanData,
        ]);
    }
}
