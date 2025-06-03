    <?php

    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Route;   
    use App\Http\Controllers\Auth\AuthController;
    use App\Http\Controllers\DataController;
    use App\Http\Controllers\UserController;
    use App\Http\Controllers\SkController;

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



    // Route::post('/login', [AuthController::class, 'login']);
    // Route::post('/register', [AuthController::class, 'register']);
    // Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    // Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

    // Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    //     return $request->user();
    // });



    // Not Use
    // Route::middleware('auth:sanctum')->get('/userprofile', [AuthController::class, 'getUserProfile']);

    // Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);

    // Route::get('/provinsi', [DataController::class, 'getProvinsi']);
    // Route::get('/kabkota', [DataController::class, 'getKabkota']);
    // Route::get('/privilege', [DataController::class, 'getPrivilege']);

    // Route::middleware('auth:sanctum')->post('/update-profile', [UserController::class, 'updateProfile']);

    // Route::middleware('auth:sanctum')->post('/upload-profile-image', [UserController::class, 'uploadProfileImage']);
    // Route::middleware('auth:sanctum')->post('/change-password', [UserController::class, 'changePassword']);


    // Route::get('/debug-request', function (Request $request) {
    //     Log::info('🔍 Debug Request:', [
    //         'headers' => $request->headers->all(),
    //         'cookies' => $request->cookies->all(),
    //         'origin' => $request->headers->get('origin'),
    //     ]);
    
    //     return response()->json(['message' => 'Debug log created']);
    // });

    // Route::get('/data-sk', [SkController::class, 'getSkData']);
    