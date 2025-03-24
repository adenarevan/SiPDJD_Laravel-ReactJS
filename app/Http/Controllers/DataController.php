<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataController extends Controller
{
    // ✅ Ambil Data Provinsi
    public function getProvinsi()
    {
        $provinsi = DB::table('tlokasi')
            ->select('KDLOKASI', 'NMLOKASI')
            ->where('KDLOKASI', '<', 50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $provinsi
        ]);
    }

    // ✅ Ambil Data Kabupaten/Kota
    public function getKabkota(Request $request)
    {
        $query = DB::table('tkabkota')->select('KDLOKASI', 'KDKABKOTA', 'NMKABKOTA');

        if ($request->has('kdlokasi')) {
            $query->where('KDLOKASI', $request->kdlokasi);
        }
        if ($request->has('kdkabkota')) {
            $query->where('KDKABKOTA', $request->kdkabkota);
        }

        $kabkota = $query->get();

        return response()->json([
            'success' => true,
            'data' => $kabkota
        ]);
    }

    // ✅ Ambil Data Privilege
    public function getPrivilege(Request $request)
    {
        $query = DB::table('tprivilege')->select('kdprivilege', 'nmprivilege');

        if ($request->has('kdprivilege') && $request->kdprivilege != "00") {
            $query->where('kdprivilege', $request->kdprivilege);
        }

        $privilege = $query->get();

        return response()->json([
            'success' => true,
            'data' => $privilege
        ]);
    }
}
