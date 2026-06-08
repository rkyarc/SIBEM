<?php

namespace App\Http\Controllers;

use App\Models\Proker;
use Illuminate\Http\Request;

class ProkerController extends Controller
{
    // Mengambil semua daftar proker
    public function index()
    {
        $prokers = Proker::all();
        return response()->json($prokers);
    }

    // Menambahkan proker baru ke database
    public function store(Request $request)
    {
        $request->validate([
            'nama_proker' => 'required|string',
            'divisi' => 'required|string',
            'deskripsi' => 'nullable|string',
            'status' => 'in:pending,disetujui,ditolak',
            'tanggal_pelaksanaan' => 'nullable|date'
        ]);

        $proker = Proker::create($request->all());

        return response()->json([
            'message' => 'Program kerja berhasil ditambahkan!', 
            'data' => $proker
        ], 201);
    }

    // --- FITUR BARU: EDIT (UPDATE) ---
    public function update(Request $request, $id)
    {
        $proker = Proker::find($id);
        
        if (!$proker) {
            return response()->json(['message' => 'Program kerja tidak ditemukan'], 404);
        }

        // Menyimpan perubahan yang dikirim dari Frontend
        $proker->update($request->all());

        return response()->json([
            'message' => 'Program kerja berhasil diperbarui!',
            'data' => $proker
        ]);
    }

    // --- FITUR BARU: HAPUS (DELETE) ---
    public function destroy($id)
    {
        $proker = Proker::find($id);

        if (!$proker) {
            return response()->json(['message' => 'Program kerja tidak ditemukan'], 404);
        }

        // Menghapus data dari database
        $proker->delete();

        return response()->json([
            'message' => 'Program kerja berhasil dihapus!'
        ]);
    }
}