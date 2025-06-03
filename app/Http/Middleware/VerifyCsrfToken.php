<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //  
       
        'sanctum/csrf-cookie', // Wajib agar bisa login
        'api/*', // ✅ tambahkan ini supaya semua route /api tidak dicek CSRF
       //'verifikasi-pusat-simpan/*',
        // 'verifikasi-balai/*',
        // 'verifikasi-balai',
 
    ];
}
