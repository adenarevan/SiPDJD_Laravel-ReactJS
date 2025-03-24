    <?php

    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Route;   
    use App\Http\Controllers\Auth\AuthController;
    use App\Http\Controllers\DataController;
    use App\Http\Controllers\UserController;

    /*
    |--------------------------------------------------------------------------
    | API Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register API routes for your application. These
    | routes are loaded by the RouteServiceProvider within a group which
    | is assigned the "api" middleware group. Enjoy building your API!
    |
    */



    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

    Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
        return $request->user();
    });



    Route::middleware('auth:sanctum')->post('/set-year', function (Request $request) {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $menuId = $request->input('menu_id');
        $year = $request->input('year');
    
        Log::info("📌 [API] Request Set Year: Menu = $menuId, Year = $year"); // 🔍 Debug
    
        if (!in_array($year, ['2022', '2023', '2024', '2025'])) {
            Log::error("❌ [API] Tahun tidak valid: $year");
            return response()->json(['error' => 'Invalid year'], 400);
        }
    
        // Simpan tahun ke session
        Session::put("selected_year_{$menuId}", $year);
        Session::put("last_selected_menu", $menuId);
    
        Log::info("✅ [API] Tahun berhasil disimpan: " . Session::get("selected_year_{$menuId}")); // 🔍 Debug
    
        return response()->json([
            'message' => 'Tahun berhasil disimpan',
            'selected_year' => $year,
            'menu_id' => $menuId
        ]);
    });
    
    
    Route::middleware('auth:sanctum')->get('/get-year/{menuId}', function ($menuId) {
        $year = Session::get("selected_year_{$menuId}", "2022");
    
        Log::info("📌 [API] Get Year: Menu = $menuId, Selected Year = $year"); // 🔍 Debug
    
        return response()->json([
            'selected_year' => $year,
            'menu_id' => $menuId
        ]);
    });
    
    


    // Not Use
    // Route::middleware('auth:sanctum')->get('/userprofile', [AuthController::class, 'getUserProfile']);

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
 