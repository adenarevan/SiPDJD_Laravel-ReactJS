<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Exception as PhpSpreadsheetException;

class TemplateController extends Controller
{
    public function downloadTemplate(Request $request, $ext)
    {
        try {
            $request->validate([
                'provinsi' => 'required|string|max:255',
                'kabupaten' => 'required|string|max:255',
            ]);

            $provinsi = strtoupper($request->query('provinsi'));
            $kabupaten = strtoupper($request->query('kabupaten'));

            if ($ext !== 'xlsx') {
                return response()->json(['error' => 'Ekstensi tidak didukung.'], 400);
            }

            $templatePath = storage_path('app/public/masterform/FormSK.xlsx');
            if (!file_exists($templatePath)) {
                return response()->json(['error' => 'Template tidak ditemukan.'], 404);
            }

            // Bersihkan buffer output sebelum stream
            if (ob_get_length()) {
                ob_end_clean();
            }

            $spreadsheet = IOFactory::load($templatePath);
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setCellValue('D1', $provinsi);
            $sheet->setCellValue('D2', $kabupaten);
            $sheet->setCellValue('D4', now()->format('Y'));

            Log::info("📤 Stream file: SK_Template_{$provinsi}_{$kabupaten}.xlsx");

            return response()->streamDownload(function () use ($spreadsheet) {
                $writer = new Xlsx($spreadsheet);
                $writer->save('php://output');
            }, "SK_Template_{$provinsi}_{$kabupaten}.xlsx", [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'max-age=0',
            ]);

        } catch (PhpSpreadsheetException $e) {
            Log::error("PhpSpreadsheetException: {$e->getMessage()}");
            return response()->json(['error' => 'Kesalahan saat memproses Excel.'], 500);
        } catch (\Exception $e) {
            Log::error("General Exception: {$e->getMessage()}");
            return response()->json(['error' => 'Terjadi kesalahan server.'], 500);
        }
    }
}
