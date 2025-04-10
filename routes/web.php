<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request; // ✅ Tambahkan ini
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SkController;
/*
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});



Route::middleware(['web'])->group(function () {

    // Set session tahun & menu
    Route::post('/set-year', function (Request $request) {
        $menuId = $request->input('menu_id');
        $year = $request->input('year');

        Session::put("selected_year_{$menuId}", $year);
        Session::put("last_selected_menu", $menuId);

        Log::info("✅ [WEB] Session setelah set-year:");
        Log::info(Session::all());

        return response()->json([
            'message' => 'Tahun berhasil disimpan',
            'menu_id' => $menuId,
            'selected_year' => $year,
        ]);
    });

    // Semua route ini pakai dynamic database berdasarkan session
    Route::middleware(['dynamicdb'])->group(function () {
        Route::get('/get-year/{menuId}', function ($menuId) {
            $year = Session::get("selected_year_{$menuId}", "2022");

            Log::info("📌 [WEB] Get Year: Menu = $menuId, Selected Year = $year");

            return response()->json([
                'selected_year' => $year,
                'menu_id' => $menuId
            ]);
        });

        // Ini pakai controller
        Route::get('/data-sk', [SkController::class, 'getSkData']);

        // Atau kalau langsung (sementara):
        // Route::get('/data-sk', function () {
        //     return DB::table('sk')->get();
        // });
    });
});



Route::get('/get-year/{menuId}', function ($menuId) {
    $year = Session::get("selected_year_{$menuId}", "2022");

    Log::info("📌 [WEB] Get Year: Menu = $menuId, Selected Year = $year");

    return response()->json([
        'selected_year' => $year,
        'menu_id' => $menuId
    ]);
})->middleware('web');



Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);

    Route::get('/provinsi', [DataController::class, 'getProvinsi']);
    Route::get('/kabkota', [DataController::class, 'getKabkota']);
    Route::get('/privilege', [DataController::class, 'getPrivilege']);

    Route::middleware('auth:sanctum')->post('/update-profile', [UserController::class, 'updateProfile']);

    Route::middleware('auth:sanctum')->post('/upload-profile-image', [UserController::class, 'uploadProfileImage']);
    Route::middleware('auth:sanctum')->post('/change-password', [UserController::class, 'changePassword']);


    Route::get('/debug-request', function (Request $request) {
        Log::info('🔍 Debug Request:', [
            'headers' => $request->headers->all(),
            'cookies' => $request->cookies->all(),
            'origin' => $request->headers->get('origin'),
        ]);
    
        return response()->json(['message' => 'Debug log created']);
    });





Route::view('/{any}', 'index')->where('any', '.*');

require __DIR__.'/auth.php';
