<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SkController;            
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\DD1Controller;



Route::get('/', fn() => ['Laravel' => app()->version()]);


   // download template
Route::get('/api/template/sk.{ext}', [TemplateController::class, 'downloadTemplate']);

Route::middleware(['web'])->group(function () {

    // ✅ Login & Logout (Session-based)
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logout berhasil']);
    });



    // ✅ Autentikasi dan user session
    Route::middleware('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'getUser']);
        
        Route::get('/me', fn(Request $request) => response()->json(['user' => $request->user()]));

        // ✅ Update profile, upload foto, dan ganti password
        Route::post('/update-profile', [UserController::class, 'updateProfile']);
        Route::post('/upload-profile-image', [UserController::class, 'uploadProfileImage']);
        Route::post('/change-password', [UserController::class, 'changePassword']);
    });

    // ✅ Session pilihan tahun & menu
    Route::middleware(['web', 'auth:sanctum'])->group(function () {
        Route::post('/set-year', function (Request $request) {
            $menuId = $request->input('menu_id');
            $year = $request->input('year');
    
            Session::put("selected_year_{$menuId}", $year);
            Session::put("last_selected_menu", $menuId);
            Session::save();
            Log::info('🧩 [GET YEAR] SESSION ID => ' . Session::getId());
            Log::info("🧩 [GET YEAR] Session data:", Session::all());
        
            Log::info("✅ [WEB] Session setelah set-year:", Session::all());
    
            return response()->json([
                'message' => 'Tahun berhasil disimpan',
                'menu_id' => $menuId,
                'selected_year' => $year,
            ]);
        });
    
        Route::get('/get-year/{menuId}', function ($menuId) {
            Log::info("🧾 [GET YEAR] Session:", Session::all());
            return response()->json([
                'selected_year' => Session::get("selected_year_{$menuId}", "2022"),
                'menu_id' => $menuId,
            ]);
        });
    });
    
            // ✅ Data dropdown
    Route::get('/provinsi', [DataController::class, 'getProvinsi']);
    Route::get('/kabkota', [DataController::class, 'getKabkota']);
    Route::get('/privilege', [DataController::class, 'getPrivilege']);


    // ✅ Data SK (dengan dynamic db switcher)
    Route::middleware(['dynamicdb', 'auth'])->group(function () {
        Route::post('/upload-sk', [SkController::class, 'upload']);
        Route::get('/data-sk', [SkController::class, 'getSkData']);
        Route::post('/verifikasi-pusat-simpan/{id}', [SkController::class, 'verifikasiPusat']);
        Route::post('/verifikasi-balai/{id}', [SkController::class, 'verifikasiBalai']);

        // API route untuk fetch data DD1 (dengan filter provinsi/kabupaten/search/pagination)
        Route::get('/dd1', [Dd1Controller::class, 'getDD1Data']);


    });

    // ✅ Optional: Ambil token CSRF
    Route::get('/get-csrf', fn() => response()->json(['token' => csrf_token()]));

    // ✅ Debugging routes
    Route::get('/debug-request', function (Request $request) {
        Log::info('🔍 Debug Request:', [
            'headers' => $request->headers->all(),
            'cookies' => $request->cookies->all(),
            'origin' => $request->headers->get('origin'),
        ]);
        return response()->json(['message' => 'Debug log created']);
    });

  
Route::get('/debug-session', function (Request $request) {
    return response()->json([
        'session_id' => session()->getId(),
        'session_data' => session()->all(),
        'cookies' => $request->cookies->all(),
        'headers' => $request->headers->all(),
    ]);
});





    // ✅ Fallback ke React frontend (SPA)
    Route::get('/{any}', fn() => view('index'))
        ->where('any', '^(dashboard|login|register|beranda|.*)$');
});
