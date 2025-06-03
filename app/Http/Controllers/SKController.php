<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DokumenSk;
use App\Models\RuasJalan; //SK 
use App\Http\Resources\DokumenSkResource;
use App\Http\Resources\RuasJalanResource;
use App\Http\Resources\RuasJalanCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\HistoryDokumenSk;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Str;


class SkController extends Controller
{
    /**
     * Ambil data Dokumen SK (semua), dan data ruas jalan (paginated).
     */
    public function getSkData(Request $request)
{
    $request->validate([
        'kdlokasi' => 'required',
        'kdkabkota' => 'required',
    ]);

    $search = $request->input('search');
    $perPage = $request->input('perPage', 10); // default 10 item
    $ruasPage = $request->input('ruas_page', 1);

    // Ambil semua data dokumen SK (tanpa pagination)
    $dokumen = DokumenSk::with(['lokasi', 'kabupaten'])
        ->filterBy($request->kdlokasi, $request->kdkabkota)
        ->get();

    // Ruas Jalan + Search
    $ruasQuery = RuasJalan::where('kdlokasi', $request->kdlokasi)
        ->where('kdkabkota', $request->kdkabkota);
        
    if ($search) { // Jika ada search, tambahkan kondisi pencarian
        // ✅ PAKAI query builder untuk pencarian       
        $ruasQuery->where(function ($q) use ($search) {
            $q->where('nomorruas', 'like', "%$search%")
              ->orWhere('nmruas', 'like', "%$search%")
              ->orWhere('kecdilalui', 'like', "%$search%");
        });
    }
      
    // ✅ PAKAI query yang sudah dibangun
    $ruas = $ruasQuery
        ->orderBy('kdruas')
        ->paginate($perPage, ['*'], 'ruas_page', $ruasPage);

    return response()->json([
        'success' => true,
        'dokumen' => DokumenSkResource::collection($dokumen),
        'data_sk' => [
            'data' => RuasJalanResource::collection($ruas),
            'current_page' => $ruas->currentPage(),
            'last_page' => $ruas->lastPage(),
            'per_page' => $ruas->perPage(),
            'total' => $ruas->total(),
        ],
    ]);
}



 public function verifikasiPusat($id, Request $request)
{
    // 🧠 Validasi minimal
    $request->validate([
        'status' => 'required|in:0,1,2', // 0 = belum, 1 = setuju, 2 = revisi
        'keterangan' => 'nullable|string',
    ]);

    Log::info('🔍 VERIFIKASI PUSAT REQUEST:', [
        'id' => $id,
        'status' => $request->input('status'),
        'keterangan' => $request->input('keterangan'),
    ]);

    \Log::info('🧪 Token dari header:', [$request->header('X-CSRF-TOKEN')]);
    \Log::info('🔐 Token dari session:', [session('_token')]);

    try {
        $count = DB::table('tdoksk')
            ->where('id', $id)
            ->update([
                'verifikasi' => $request->input('status'),
                'keterangan' => $request->input('keterangan'),
                'tglVerifAtauRev' => now(),
            ]);

        Log::info("✅ Verifikasi berhasil, baris diubah: {$count}");

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi pusat berhasil disimpan.',
        ]);
    } catch (\Throwable $e) {
        Log::error("❌ Gagal verifikasi pusat:", [
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan verifikasi pusat.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function verifikasiBalai($id, Request $request)
{
    try {
        DB::table('tdoksk')
            ->where('id', $id)
            ->update([
                'verifikasibalai' => $request->input('status'),
                'keteranganbalai' => $request->input('keterangan'), // ✅ ini yang benar!
                'tglVerifAtauRev' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi balai berhasil disimpan.',
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan verifikasi balai.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


        public function upload(Request $request)
            {

     
                $request->validate([
                    'kdlokasi' => 'required|string',
                    'kdkabkota' => 'required|string',
                    'file_pdf' => 'required|file|mimes:pdf|max:20480', // 20 MB
                    'file_excel' => 'required|file|mimes:xls,xlsx|max:20480',
                ]);

                
                $kdsbidang = '01'; // ✅ Hardcode langsung
                $kdsatker = '33' . $request->kdlokasi . $request->kdkabkota . $kdsbidang;

                // Check if already verified
                $existing = DokumenSk::where([
                    'kdlokasi' => $request->kdlokasi,
                    'kdkabkota' => $request->kdkabkota,
                    'kdsbidang' => '01', // ✅ tambahkan ini
                ])->first();

                Log::info('🧾 Data dokumen existing:', $existing ? $existing->toArray() : ['null' => true]);
                Log::info('📦 DB aktif sekarang: ' . DB::connection()->getDatabaseName());


                if ($existing && $existing->verifikasi === 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Dokumen sudah diverifikasi dan tidak bisa diubah.',
                    ], 403);
                }

                try {
                    $timestamp = now()->format('ymdHis');

                    // Dapatkan ekstensi asli
                    $pdfExt = $request->file('file_pdf')->getClientOriginalExtension();
                    $excelExt = $request->file('file_excel')->getClientOriginalExtension();
                    
                    // Bangun nama file sendiri
                    $pdfName = "FormSKPDF-{$kdsatker}-{$timestamp}.{$pdfExt}";
                    $excelName = "FormSK-{$kdsatker}-{$timestamp}.{$excelExt}";
                    
                    // Simpan ke storage dengan nama yang kamu tentukan
                    $pdfPath = $request->file('file_pdf')->storeAs("formsk/{$kdsatker}", $pdfName, 'public');
                    $excelPath = $request->file('file_excel')->storeAs("formsk/{$kdsatker}", $excelName, 'public');
                    
                    $dokumenData = [
                        'kdsatker' => $kdsatker,
                        'kdlokasi' => $request->kdlokasi,
                        'kdkabkota' => $request->kdkabkota,
                        'kdsbidang' => '01', // ✅ tambahkan ini
                        'tglUpload' => now(),
                        'fileName' => basename($excelPath),
                        'filePDF' => basename($pdfPath),
                        'userid' => auth()->id(),
                    ];

                    if ($existing) {
                        // Hanya ambil kolom yang memang ada di tabel thistorydoksk
                        $allowed = [
                            'kdsatker', 'kdlokasi', 'kdkabkota', 'kdsbidang',
                            'tglUpload', 'fileName', 'filePDF', 'nomor',
                            'verifikasi', 'keterangan', 'tglVerifikasi', 'userVerifikator',
                            'kemantapanTahunLalu', 'userid', 'reason',
                        ];
                    
                        $historyData = collect($existing->toArray())->only($allowed)->toArray();
                        $historyData['reason'] = 'Update Dokumen';
                    
                        HistoryDokumenSk::create($historyData);
                    
                        $existing->update($dokumenData);
                    }
                    // Read Excel
                    $spreadsheet = IOFactory::load($request->file('file_excel')->getPathname());
                    $sheet = $spreadsheet->getActiveSheet();

                    if (
                        $sheet->getCell('A1')->getValue() !== 'PROVINSI' ||
                        $sheet->getCell('A2')->getValue() !== 'DAERAH'
                    ) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Template Excel tidak sesuai format.',
                        ], 422);
                    }

                    // Update nomor dokumen
                    DokumenSk::where('kdlokasi', $request->kdlokasi)
                        ->where('kdkabkota', $request->kdkabkota)
                
                        ->update(['nomor' => $sheet->getCell('D3')->getValue()]);

                    // Clear previous ruas
                    RuasJalan::where([
                        'kdlokasi' => $request->kdlokasi,
                        'kdkabkota' => $request->kdkabkota,
                 
                    ])->delete();

                    $dataBatch = [];

                    foreach ($sheet->getRowIterator() as $row) {
                        if ($row->getRowIndex() < 9) continue;

                        $temp = [
                            'tglcreate' => now(),
                            'tglupdate' => now(),
                            'kdlokasi' => $request->kdlokasi,
                            'kdkabkota' => $request->kdkabkota,
                            'kdsbidang' => '01', // ✅ tambahkan ini
                            'userid' => auth()->id(),
                        ];

                        $cells = $row->getCellIterator();
                        $cells->setIterateOnlyExistingCells(false);

                        foreach ($cells as $cell) {
                            switch ($cell->getColumn()) {
                                case 'A': $temp['nomorruas'] = $cell->getFormattedValue(); break;
                                case 'B': $temp['nomorruas'] .= '.' . $cell->getFormattedValue(); break;
                                case 'C': $temp['nomorruas'] .= '.' . $cell->getFormattedValue(); break;
                                case 'D': $temp['nmruas'] = $cell->getCalculatedValue(); break;
                                case 'E': $temp['kecdilalui'] = $cell->getCalculatedValue(); break;
                                case 'F': $temp['panjang'] = $cell->getCalculatedValue(); break;
                                case 'G': $temp['lebar'] = $cell->getCalculatedValue(); break;
                            }
                        }

                        $temp['nomorruas'] = $temp['nomorruas'] ?? Str::random(6);
                        $dataBatch[] = $temp;
                    }

                    RuasJalan::insert($dataBatch);

                    return response()->json([
                        'success' => true,
                        'message' => 'Upload dan parsing SK berhasil.',
                        'total_rows' => count($dataBatch),
                    ]);

                } catch (\Throwable $e) {
                    Log::error('Upload SK gagal', ['error' => $e->getMessage()]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Terjadi kesalahan saat upload.',
                        'error' => $e->getMessage(),
                    ], 500);
                }
            }


}
