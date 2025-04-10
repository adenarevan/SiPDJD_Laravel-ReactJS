<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DokumenSk;
use App\Http\Resources\DokumenSkResource;
use App\Models\RuasJalan;
use App\Http\Resources\RuasJalanResource;


class SkController extends Controller
{
    /**
     * Ambil data Dokumen SK berdasarkan lokasi, kabupaten, dan bidang (opsional).
     */
    public function getSkData(Request $request)
    {
        $request->validate([
            'kdlokasi' => 'required',
            'kdkabkota' => 'required',
        ]);
    
        // Ambil data dokumen SK
        $dokumen = DokumenSk::with(['lokasi', 'kabupaten'])
        ->filterBy($request->kdlokasi, $request->kdkabkota)
        ->get();
    
    
        // Ambil data ruas jalan
        $ruas = RuasJalan::where('kdlokasi', $request->kdlokasi)
            ->where('kdkabkota', $request->kdkabkota)
            ->orderBy('kdruas')
            ->get();
    
        return response()->json([
            'success' => true,
            'dokumen' => DokumenSkResource::collection($dokumen),
            'data_sk' => RuasJalanResource::collection($ruas),
        ]);
    }
    
}
