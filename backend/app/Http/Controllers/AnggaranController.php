<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use Illuminate\Http\Request;

class AnggaranController extends Controller
{
    public function index()
    {
        // For now, return all records. Later this can be filtered based on role.
        $anggarans = Anggaran::all();
        return response()->json($anggarans);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kegiatan' => 'required|string',
            'divisi' => 'required|string',
            'jenis' => 'required|in:pemasukan,pengeluaran',
            'jumlah' => 'required|numeric',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string',
            'bukti_file' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120', // Max 5MB
        ]);

        $data = $request->all();
        $data['user_id'] = auth()->id();
        if (!isset($data['status'])) $data['status'] = 'pending';
        
        if ($request->jenis === 'pengeluaran') {
            $pagu = \App\Models\Pagu::where('kementerian', $request->divisi)->first();
            if (!$pagu) {
                return response()->json([
                    'message' => 'Gagal: Pagu anggaran untuk kementerian ini belum diatur.'
                ], 400);
            }

            $totalTerpakai = Anggaran::where('divisi', $request->divisi)
                ->where('jenis', 'pengeluaran')
                ->whereIn('status', ['pending', 'verifikasi_sekjen', 'disetujui'])
                ->sum('jumlah');

            $sisaPagu = $pagu->pagu_awal - $totalTerpakai;

            if ($request->jumlah > $sisaPagu) {
                return response()->json([
                    'message' => 'Gagal: Nominal melebihi sisa pagu kementerian (Sisa: Rp ' . number_format($sisaPagu, 0, ',', '.') . ')'
                ], 400);
            }
        }

        if ($request->hasFile('bukti_file')) {
            $path = $request->file('bukti_file')->store('kuitansi', 'public');
            $data['bukti_file'] = url('storage/' . $path);
        }

        $anggaran = Anggaran::create($data);

        return response()->json([
            'message' => 'Anggaran berhasil diajukan!', 
            'data' => $anggaran
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $anggaran = Anggaran::find($id);
        
        if (!$anggaran) {
            return response()->json(['message' => 'Anggaran tidak ditemukan'], 404);
        }

        $data = $request->all();
        
        // Cek jika Bendahara ACC dan nominal > 5.000.000
        if (isset($data['status']) && $data['status'] === 'disetujui') {
            $user = auth()->user();
            if ($user && str_contains(strtolower($user->role), 'bendahara') && $anggaran->jumlah > 5000000) {
                $data['status'] = 'menunggu_presiden';
            }
        }
        
        if ($request->hasFile('bukti_file')) {
            $path = $request->file('bukti_file')->store('kuitansi', 'public');
            $data['bukti_file'] = url('storage/' . $path);
        }

        $anggaran->update($data);

        return response()->json([
            'message' => 'Anggaran berhasil diperbarui!',
            'data' => $anggaran
        ]);
    }

    public function destroy($id)
    {
        $anggaran = Anggaran::find($id);

        if (!$anggaran) {
            return response()->json(['message' => 'Anggaran tidak ditemukan'], 404);
        }

        $anggaran->delete();

        return response()->json([
            'message' => 'Anggaran berhasil dihapus!'
        ]);
    }
}
