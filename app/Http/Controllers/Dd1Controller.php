<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dd1Ruas;
use App\Http\Resources\Dd1RuasjalanResources;
use Illuminate\Support\Facades\Log;

class Dd1Controller extends Controller
{
    /**
     * Ambil data ruas DD1 berdasarkan lokasi dan kabupaten (plus search & pagination)
     */
    public function getDD1Data(Request $request)
    {
        $request->validate([
            'provinsi' => 'required|string',
            'kabupaten' => 'required|string',
        ]);

        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

   $query = Dd1Ruas::where('kdlokasi', $request->provinsi)
      ->where('kdkabkota', $request->kabupaten)
        ->whereNotNull('nomorruas')
        ->where('nomorruas', '!=', '')
        ->whereNotNull('nmruas')
        ->where('nmruas', '!=', '');    

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nomorruas', 'like', "%$search%")
                  ->orWhere('nmruas', 'like', "%$search%")
                  ->orWhere('kecdilalui', 'like', "%$search%");
            });
        }

        $result = $query->orderBy('nomorruas')->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => Dd1RuasjalanResources::collection($result),
            'current_page' => $result->currentPage(),
            'last_page' => $result->lastPage(),
            'per_page' => $result->perPage(),
            'total' => $result->total(),
        ]);
    }
}
