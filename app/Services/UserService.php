<?php
namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request; // ✅ Pastikan ini yang diimport
use Illuminate\Support\Facades\Storage; // ✅ Tambahkan ini!
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function fetchUserData($userId)
    {
        return $this->userRepository->getUserById($userId);
    }

    public function updateProfile($userId, array $data)
    {
        // Validasi input
        $validator = Validator::make($data, [
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'provinsi' => 'required|string',
            'kabkota' => 'required|string',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Update profil via Repository
        $updatedUser = $this->userRepository->updateProfile($userId, $data);

        if (!$updatedUser) {
            return ['success' => false, 'message' => 'User tidak ditemukan.'];
        }

        return ['success' => true, 'message' => 'Profil berhasil diperbarui.', 'user' => $updatedUser];
    }

    public function uploadProfileImage(Request $request)
    {
        // Validasi request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Maksimal 2MB
        ]);

        // Ambil user yang sedang login
        $user = auth()->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan!'], 404);
        }

        // Hapus gambar lama jika ada
        if ($user->images) {
            Storage::delete('public/profile_images/' . $user->images);
        }

        // Simpan file dengan nama username_timestamp.ext
        $file = $request->file('image');
        $fileName = $user->username . '_' . time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('public/profile_images', $fileName);

        // **Update gambar di database via Repository**
        $this->userRepository->updateProfileImage($user->userid, $fileName);

        return response()->json([
            'success' => true,
            'message' => 'Upload berhasil!',
            'imagePath' => asset('storage/profile_images/' . $fileName), // Akses gambar
        ], 200);
    }


    public function changePassword(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed', // Harus dikonfirmasi
        ]);

        // Ambil user yang sedang login
        $user = Auth::user();

        // Cek apakah password lama benar
        if (!Hash::check($validatedData['current_password'], $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Password lama salah!']);
        }

        // Hash password baru
        $hashedPassword = Hash::make($validatedData['new_password']);

        // Update password di database via Repository
        $this->userRepository->updatePassword($user->userid, $hashedPassword);

        return ['success' => true, 'message' => 'Password berhasil diubah!'];
    }
}
