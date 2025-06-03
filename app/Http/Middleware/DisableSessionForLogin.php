<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class DisableSessionForLogin
{
    public function handle(Request $request, Closure $next)
    {
        // ✅ Nonaktifkan session dan CSRF hanya jika halaman login (GET)
        if ($request->is('login') && $request->method() === 'GET') {
            Config::set('session.driver', 'array'); // Nonaktifkan session
            $request->session()->invalidate();
            $request->session()->regenerateToken(); // Hapus CSRF jika ada
            Log::info("🛑 Session dan CSRF Dinonaktifkan untuk /login (GET)");
        }

        return $next($request);
    }
}
