<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RuasJalan extends Model
{
    protected $table = 'truassk';
    protected $primaryKey = 'kdruas';
    protected $guarded = [];

    // Karena AUTO INCREMENT
    public $incrementing = true;

    // Kalau tidak ada created_at & updated_at di table
    public $timestamps = false;

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'kdlokasi', 'kdlokasi');
    }

    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'kdkabkota', 'kdkabkota');
    }

    // Optional: scope reusable untuk filter
    public function scopeFilterBy($query, $kdlokasi = null, $kdkabkota = null)
    {
        return $query
            ->when($kdlokasi, fn($q) => $q->where('kdlokasi', $kdlokasi))
            ->when($kdkabkota, fn($q) => $q->where('kdkabkota', $kdkabkota));

    }
}
