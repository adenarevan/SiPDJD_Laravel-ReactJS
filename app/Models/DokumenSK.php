<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DokumenSk extends Model
{
    protected $table = 'tdoksk';
    protected $guarded = [];
    public $timestamps = false;

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'kdlokasi');
    }

    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'kdkabkota');
    }

    public function bidang()
    {
        return $this->belongsTo(Bidang::class, 'kdsbidang');
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

    public static function getDokRefByLoc($kdlokasi = null, $kdkabkota = null)
    {
        $query = self::with(['lokasi', 'kabupaten']);

        if ($kdlokasi) $query->where('kdlokasi', $kdlokasi);
        if ($kdkabkota) $query->where('kdkabkota', $kdkabkota);
    

        return $query->get();
    }

    public static function updateOnlyPDF($kdlokasi, $kdkabkota, array $data)
    {
        return self::where('kdlokasi', $kdlokasi)
            ->where('kdkabkota', $kdkabkota)
            ->orderByDesc('id')
            ->first()?->update($data);
    }
} 
