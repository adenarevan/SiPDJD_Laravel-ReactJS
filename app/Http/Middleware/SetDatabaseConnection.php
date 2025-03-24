<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;

class SetDatabaseConnection
{
    public function handle(Request $request, Closure $next)
    {
        // Pastikan user login dengan Sanctum
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Ambil menu yang sedang diakses (misalnya dari request atau session)
        $menuId = $request->input('menu_id', Session::get('last_selected_menu', 'default'));

        // Ambil tahun dari session berdasarkan menuId
        $selectedYear = Session::get("selected_year_{$menuId}", "2022"); // Default ke 2022

        // Konversi angka pendek ke tahun penuh (24 -> 2024)
        if (is_numeric($selectedYear) && strlen($selectedYear) == 2) {
            $selectedYear = '20' . $selectedYear;
        }

        // Mapping database berdasarkan tahun
        $connections = [
            '2022' => 'mysql_2022',
            '2023' => 'mysql_2023',
            '2024' => 'mysql_2024',
            '2025' => 'mysql_2025',
        ];

        // Gunakan koneksi default jika tahun tidak ditemukan
        $selectedConnection = $connections[$selectedYear] ?? 'mysql';

        // Set database default di Laravel
        Config::set('database.default', $selectedConnection);

        return $next($request);
    }
}
