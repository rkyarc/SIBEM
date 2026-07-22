<?php

namespace App\Http\Controllers;

use App\Models\Kak;
use Illuminate\Http\Request;

class KakController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([]);
        }

        $role = strtolower($user->role);
        $isBPH = str_contains($role, 'presiden') || str_contains($role, 'wakil') || str_contains($role, 'bendahara') || str_contains($role, 'sekretaris');

        if ($isBPH) {
            $kaks = Kak::all();
        } else {
            // For Menteri and Staff, extract divisi from role (e.g., "Menteri PSDM" -> "psdm")
            $parts = explode(' ', $role);
            if (count($parts) > 1) {
                array_shift($parts); // Remove "Menteri" or "Staff"
                $divisi = strtolower(implode(' ', $parts));
                $kaks = Kak::whereRaw('LOWER(divisi) = ?', [$divisi])->get();
            } else {
                // Fallback: only their own
                $kaks = Kak::where('user_id', $user->id)->get();
            }
        }
        
        return response()->json($kaks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_kegiatan' => 'required|string',
            'divisi' => 'required|string',
            'link_drive' => 'nullable|string',
            'status' => 'nullable|string',
            'tipe_pengajuan' => 'required|string',
        ]);

        $data = $request->all();
        $data['user_id'] = auth()->id();
        $kak = Kak::create($data);

        return response()->json([
            'message' => 'Pengajuan berhasil ditambahkan!', 
            'data' => $kak
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $kak = Kak::find($id);
        
        if (!$kak) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        $statusSebelumnya = $kak->status;
        $statusBaru = $request->input('status', $kak->status);
        $catatan = $request->input('catatan_revisi', null);
        
        $kak->update($request->all());

        // Jika ada perubahan status atau ada catatan (berarti direview), ATAU 
        // Jika dokumen diupdate oleh pengaju setelah statusnya revisi
        if ($statusSebelumnya != $statusBaru || $catatan) {
            $catatanFinal = $catatan;
            if ($statusSebelumnya === 'revisi' && $statusBaru === 'pending' && !$catatan) {
                $catatanFinal = "Dokumen telah diperbarui oleh pengaju.";
            }

            \App\Models\KakRevision::create([
                'kak_id' => $kak->id,
                'user_id' => auth()->id(),
                'status_sebelumnya' => $statusSebelumnya,
                'status_baru' => $statusBaru,
                'catatan' => $catatanFinal
            ]);
        }

        return response()->json([
            'message' => 'Pengajuan berhasil diperbarui!',
            'data' => $kak
        ]);
    }

    public function getRevisions($id)
    {
        $revisions = \App\Models\KakRevision::with('user')
                        ->where('kak_id', $id)
                        ->orderBy('created_at', 'desc')
                        ->get();
        return response()->json($revisions);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kak = Kak::find($id);

        if (!$kak) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        $kak->delete();

        return response()->json([
            'message' => 'Pengajuan berhasil dihapus!'
        ]);
    }
}
