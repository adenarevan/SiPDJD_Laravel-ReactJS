<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function updateProfile(Request $request)
    {
        try {
            $userId = Auth::id(); // Ambil ID user yang sedang login
            $result = $this->userService->updateProfile($userId, $request->all());

            return response()->json($result);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan server.'], 500);
        }
    }

    public function uploadProfileImage(Request $request)
    {
        return $this->userService->uploadProfileImage($request);
    }

    public function changePassword(Request $request)
    {
        try {
            $result = $this->userService->changePassword($request);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
    
}    
