<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Hanya untuk uji coba
Route::get('/test-koneksi', function () {
    return response()->json([
        'status' => 'Sukses!',
        'message' => 'Backend Laravel siap melayani Frontend React TypeScript. HAHAHA',
    ]);
});