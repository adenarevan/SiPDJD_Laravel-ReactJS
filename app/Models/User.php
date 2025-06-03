<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'tuser';
    protected $primaryKey = 'userid';
    protected $fillable = [
        'username', 'kdunit', 'kdsbidang', 'kdlokasi', 'kdkabkota',
        'privilege', 'images', 'fullName', 'email', 'is_active', 'sub_privilege'
    ];
    protected $hidden = ['password'];

    public function privilege(): BelongsTo
    {
        return $this->belongsTo(Privilege::class, 'privilege', 'kdprivilege');
    }

    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(Lokasi::class, 'kdlokasi', 'KDLOKASI');
    }
    public function kabupaten(): HasOne
    {
        return $this->hasOne(Kabupaten::class, 'KDKABKOTA', 'kdkabkota')
            ->where('KDLOKASI', function ($query) {
                $query->select('kdlokasi')
                      ->from('tuser')
                      ->whereColumn('tuser.kdkabkota', 'tkabkota.KDKABKOTA')
                      ->limit(1);
            });
    }
       
    
}
