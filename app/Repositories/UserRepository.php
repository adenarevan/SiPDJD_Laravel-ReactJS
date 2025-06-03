<?php 

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    protected $model;

    public function __construct(User $user)
    {
        $this->model = $user;
    }

    // Ambil user berdasarkan ID dari tabel tuser
    public function getUserById($userId)
    {
        return DB::table('tuser as usr')
            ->select([
                'usr.userid',
                'usr.username',
                'usr.kdunit',
                'usr.kdsbidang',
                'usr.kdlokasi',
                'loc.nmlokasi',
                'usr.kdkabkota',
                'kab.nmkabkota',
                'usr.privilege',
                'priv.nmprivilege',
                'usr.images',
                'usr.sub_privilege',
                'usr.fullName',
                'usr.email',
                'usr.is_active'
            ])
            ->leftJoin('tprivilege as priv', 'usr.privilege', '=', 'priv.kdprivilege')
            ->leftJoin('tlokasi as loc', 'usr.kdlokasi', '=', 'loc.kdlokasi')
            ->leftJoin('tkabkota as kab', function ($join) {
                $join->on('usr.kdlokasi', '=', 'kab.kdlokasi')
                     ->on('usr.kdkabkota', '=', 'kab.kdkabkota');
            })
            ->where('usr.userid', '=', $userId)
            ->first();
    }

    // Cari user berdasarkan ID di tabel users
    public function findById($id)
    {
        return $this->model->where('userid', $id)->first();
    }

    // Update profil user di tabel tuser
    public function updateProfile($userId, array $data)
    {
        return DB::table('tuser')
            ->where('userid', $userId)
            ->update([
                'fullName' => $data['fullName'],
                'email' => $data['email'],
                'kdlokasi' => $data['provinsi'],
                'kdkabkota' => $data['kabkota'],
                'privilege' => $data['privilege'],
            ]);
    }

    public function updateProfileImage($userId, $imagePath)
    {
        return DB::table('tuser')
            ->where('userid', $userId)
            ->update(['images' => $imagePath]);
    }
  
    public function updatePassword($userId, $hashedPassword)
    {
        return $this->model->where('userid', $userId)->update(['password' => $hashedPassword]);
    }
    
}
