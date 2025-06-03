<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ganti URL di bawah dengan URL React kamu (default: Vite)
        $origin = 'https://react.sipdjd-laravel.test/';

        return $response->header('Access-Control-Allow-Origin', $origin)
                        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                        ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, X-CSRF-TOKEN')
                        ->header('Access-Control-Allow-Credentials', 'true');
    }
}
