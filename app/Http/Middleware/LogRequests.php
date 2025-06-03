<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogRequests
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('📩 Middleware HIT:', [
            'method' => $request->method(),
            'path' => $request->path(),
        ]);

        return $next($request);
    }
}
