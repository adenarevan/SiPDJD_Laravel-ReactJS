<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class UseDynamicDatabase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // ✅ Log session dan cookie untuk debugging
        Log::info('🧩 [Middleware] Cookies:', $request->cookies->all());
        Log::info('🧩 [Middleware] Session ID:', ['session_id' => $request->session()->getId()]);
        Log::info('🧩 [Middleware] Session Data:', $request->session()->all());

        // ✅ Cek jika session sudah ada
        if (!$request->session()->has('last_selected_menu')) {
            Log::warning("⚠️ Session tidak ada. Middleware dilewati.");
            return $next($request);
        }

        // ✅ Ambil menuId dan tahun dari session
        $menuId = $request->session()->get('last_selected_menu');
        $year = $menuId ? $request->session()->get("selected_year_{$menuId}") : null;

        // ⛔ Jika session kosong, jangan ubah database
        if (!$menuId || !$year) {
            Log::warning("⚠️ Session tidak lengkap. DB tidak diubah. menuId: {$menuId}, year: {$year}");
            return $next($request);
        }

        // ✅ Set database berdasarkan tahun
        $dbName = $year === '2022' ? 'dakjalanfix' : 'dakjalan' . $year;
        Config::set('database.connections.mysql.database', $dbName);
        Config::set('database.default', 'mysql');

        Log::info("📦 DB aktif: {$dbName} (Menu: {$menuId}, Year: {$year})");

 
            Log::info("🟢 [Debug Middleware] Session ID: " . session()->getId());
            Log::info("🟢 [Debug Middleware] Session Data: ", session()->all());
            Log::info("🟢 [Debug Middleware] Cookies: ", $request->cookies->all());
            Log::info("🟢 [Debug Middleware] Headers: ", $request->headers->all());

        return $next($request);
    }
}
