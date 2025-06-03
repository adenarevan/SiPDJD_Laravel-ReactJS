<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\DB;
use App\Services\UserService;

class AuthController extends Controller
{

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    
    public function login(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required',
            'cf-turnstile-response' => 'required'
        ]);

   
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        // Verifikasi Cloudflare Turnstile
        if (!$this->verifyCloudflareTurnstile($request->input('cf-turnstile-response'))) {
            return response()->json(['error' => 'Verifikasi Cloudflare gagal.'], 403);
        }
    
        // Cek user berdasarkan username
        $user = User::where('username', $request->username)->first();
    
        if (!$user || !password_verify($request->password, $user->password)) {
            return response()->json(['error' => 'Username atau password salah.'], 401);
        }
    
        if ($user->is_active == 0) {
            return response()->json(['error' => 'Akun belum diaktivasi.'], 403);
        }
    
        // Simpan user ke session auth Laravel
        Auth::login($user); // 🔐 pakai built-in login session Laravel
        $request->session()->regenerate(); // Hindari session fixation
    
        // Simpan data tambahan ke session
        $sessionData = [
            'user' => $user->username,
            'kdunit' => $user->kdunit,
            'kdsbidang' => $user->kdsbidang,
            'kdlokasi' => $user->kdlokasi,
            'kdkabkota' => $user->kdkabkota,
            'privilege' => $user->privilege,
            'fullName' => $user->fullName,
            'expiredDate' => $user->expiredDate,
            'sub_privilege' => $user->sub_privilege,
            'images' => $user->images,
            'menu_awal' => 99,
            'userid' => $user->userid,
            'force_update' => empty($user->updated_at),
            'last_activity' => time()
        ];
    
        session()->put('user', $sessionData);
    
        return response()->json([
            'message' => 'Login berhasil',
            'user' => $sessionData
        ], 200); // ⬅️ pastikan status code 200
        
    }
    

    
    private function verifyCloudflareTurnstile($cf_response)
{
    $secret = config('services.turnstile.secret'); 
 

    // Log apakah secret terbaca
    \Log::info('🔍 Turnstile Secret Key:', ['secret' => $secret]);

    if (!$secret) {
        \Log::error('❌ TURNSTILE_SECRET tidak ditemukan di .env!');
        return false;
    }

    $verify_url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    $response = Http::asForm()->post($verify_url, [
        'secret' => $secret,
        'response' => $cf_response,
        'remoteip' => request()->ip(),
    ]);

    $result = $response->json();
    \Log::info('🔍 Cloudflare Turnstile Response:', $result);

    return $result['success'] ?? false;
}



public function getUserProfile(Request $request)
{
   

    \Log::info('User ID dari Auth::id(): ', ['id' => Auth::id()]);

    $user = User::with(['kabupaten', 'lokasi', 'privilege'])
        ->where('userid', Auth::id()) // Menggunakan Auth::id()
        ->first();
    
    \Log::info('User yang diambil dari database: ', ['user' => $user]);
    

    

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $user->load(['privilege', 'kabupaten', 'lokasi']) // Langsung tanpa Resource
    ]);
    
}



        public function getUser()
                    {
                $userId = auth()->id();

                if (!$userId) {
                    return response()->json(['success' => false, 'message' => 'User belum login'], 401);
                }

                $user = $this->userService->fetchUserData($userId);

                if (!$user) {
                    return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
                }

                return response()->json(['success' => true, 'data' => $user]);
            }


    
}
