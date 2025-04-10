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
  'api/*',                // untuk semua route dari api.php
  'set-year',             // ⬅️ ini baru di web.php, jadi perlu didaftarkan
  'get-year/*',           // ⬅️ kalau kamu ambil tahun juga
  'sanctum/csrf-cookie',  // wajib untuk login/session
  'data-sk',
  'provinsi',
  'kabkota',
  'privilege',
  'update-profile',
  'upload-profile-image',
  'change-password',
],

    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173','http://localhost:8000'], // ✅ HARUS ada
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['X-XSRF-TOKEN'],
    'max_age' => 0,
    'supports_credentials' => true, // ✅ Wajib agar cookie dikirim
];
