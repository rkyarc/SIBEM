<?php

namespace App\Http\Controllers;

use App\Models\KasRutin;
use Illuminate\Http\Request;

class KasRutinController extends Controller
{
    public function index()
    {
        $kasRutins = KasRutin::all();
        return response()->json($kasRutins);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'nominal' => 'required|numeric',
            'periode' => 'required|in:mingguan,bulanan,tahunan',
            'hari_mingguan' => 'nullable|integer|between:1,7',
            'tanggal_bulanan' => 'nullable|integer|between:1,31',
            'bulan_tahunan' => 'nullable|integer|between:1,12',
            'tanggal_tahunan' => 'nullable|integer|between:1,31',
            'tingkatan' => 'required|in:Komunal,Kementerian',
            'kementerian' => 'nullable|string',
        ]);

        $kasRutin = KasRutin::create($request->all());

        return response()->json([
            'message' => 'Aturan Kas Rutin berhasil dibuat!',
            'data' => $kasRutin
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $kasRutin = KasRutin::find($id);
        
        if (!$kasRutin) {
            return response()->json(['message' => 'Kas Rutin tidak ditemukan'], 404);
        }

        $request->validate([
            'nama' => 'sometimes|string',
            'nominal' => 'sometimes|numeric',
            'periode' => 'sometimes|in:mingguan,bulanan,tahunan',
            'tingkatan' => 'sometimes|in:Komunal,Kementerian',
            'kementerian' => 'nullable|string',
        ]);

        $kasRutin->update($request->all());

        return response()->json([
            'message' => 'Aturan Kas Rutin berhasil diperbarui!',
            'data' => $kasRutin
        ]);
    }

    public function destroy($id)
    {
        $kasRutin = KasRutin::find($id);

        if (!$kasRutin) {
            return response()->json(['message' => 'Kas Rutin tidak ditemukan'], 404);
        }

        $kasRutin->delete();

        return response()->json([
            'message' => 'Aturan Kas Rutin berhasil dihapus!'
        ]);
    }
}
