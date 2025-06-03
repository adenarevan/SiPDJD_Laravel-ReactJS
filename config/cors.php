<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */
 
'paths' => [
    'api/*',
    'sanctum/csrf-cookie',
    'login',
    'logout',
    'me',
    'set-year',
    'get-year/*',
    'data-sk',
    'provinsi',
    'kabkota',
    'privilege',
    'update-profile',
    'upload-profile-image',
    'change-password',
    'debug-request',
    'get-csrf',
    'user',
    'verifikasi-pusat-simpan/*',
    'verifikasi-balai/*',
    'get-sk-data',
    'data-sk/*',
    'upload-sk',
    'upload-sk/*',
    'dd1',
    'dd1/*'
],


    // 'paths' => ['*'],
    'allowed_methods' => ['*'],
        'allowed_origins' => [
        'https://react.sipdjd-laravel.test:5173',
        'https://sipdjd-laravel.test',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [
        'X-XSRF-TOKEN',         // ✅ Untuk CSRF
        'Authorization',        // ✅ Untuk Bearer Token jika dibutuhkan
        'Content-Type',         // ✅ Untuk JSON dan Form Data
        'Set-Cookie'            // ✅ Untuk Cookie Session
    ],
    'max_age' => 0,
    'supports_credentials' => true, // ✅ Wajib agar cookie dikirim
];
