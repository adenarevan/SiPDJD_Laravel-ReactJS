<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenSk extends Model
{
    protected $table = 'tdoksk';
    protected $guarded = [];

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'kdlokasi');
    }

    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'kdkabkota');
    }


    // Scope reusable untuk filter dinamis
    public function scopeFilterBy($query, $kdlokasi = null, $kdkabkota = null)
    {
        return $query
            ->when($kdlokasi, fn($q) => $q->where('tdoksk.kdlokasi', $kdlokasi))
            ->when($kdkabkota, fn($q) => $q->where('tdoksk.kdkabkota', $kdkabkota));
    }

    // Query builder Eloquent-style with join
    public static function withJoinInfo($kdlokasi = null, $kdkabkota = null)
    {
        return self::select(
                'tdoksk.*',
                'tlokasi.nmlokasi',
                'tkabkota.nmkabkota'
            )
            ->leftJoin('tlokasi', 'tdoksk.kdlokasi', '=', 'tlokasi.kdlokasi')
            ->leftJoin('tkabkota', function ($join) {
                $join->on('tdoksk.kdlokasi', '=', 'tkabkota.kdlokasi')
                     ->on('tdoksk.kdkabkota', '=', 'tkabkota.kdkabkota');
            })
            ->filterBy($kdlokasi, $kdkabkota);
    }
    
}
