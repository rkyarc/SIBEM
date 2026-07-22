<?php

namespace App\Http\Controllers;

use App\Models\Pagu;
use Illuminate\Http\Request;

class PaguController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pagus = Pagu::all();
        return response()->json($pagus);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kementerian' => 'required|string',
            'pagu_awal' => 'required|numeric',
            'tahun_periode' => 'required|string'
        ]);

        $pagu = Pagu::updateOrCreate(
            [
                'kementerian' => $request->kementerian,
                'tahun_periode' => $request->tahun_periode
            ],
            [
                'pagu_awal' => $request->pagu_awal
            ]
        );

        return response()->json([
            'message' => 'Pagu berhasil disimpan',
            'data' => $pagu
        ], 200);
    }
}
