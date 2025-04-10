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
        Log::info('🧩 [Middleware] Cookies:', $request->cookies->all());
        Log::info('🧩 [Middleware] Session all:', Session::all());
    
        $menuId = Session::get('last_selected_menu', 'default');
        $year = Session::get("selected_year_{$menuId}", '2022');
    
        if (!$menuId || $menuId === 'default') {
            Log::warning("⚠️ DB belum disetel, session kosong");
        }
    
        $dbName = $year === '2022' ? 'dakjalanfix' : 'dakjalan' . $year;
        Config::set('database.connections.mysql.database', $dbName);
        Config::set('database.default', 'mysql');
    
        Log::info("📦 DB aktif: $dbName (Menu: $menuId, Year: $year)");
        return $next($request);
    }
    
    
}
