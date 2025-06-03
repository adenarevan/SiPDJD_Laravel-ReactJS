<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class DebugSession
{
    public function handle($request, Closure $next)
    {
        Log::info('🔍 [Debug Session] Session ID:', ['session_id' => Session::getId()]);
        Log::info('🔍 [Debug Session] Session Data:', Session::all());
        Log::info('🔍 [Debug Session] Cookies:', $request->cookies->all());

        return $next($request);
    }
}

// App\Http\Middleware\UseDynamicDatabase.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class UseDynamicDatabase
{
    public function handle($request, Closure $next)
    {
        Log::info('🔍 [UseDynamicDatabase] Session ID:', ['session_id' => Session::getId()]);
        Log::info('🔍 [UseDynamicDatabase] Session Data:', Session::all());

        return $next($request);
    }
}
