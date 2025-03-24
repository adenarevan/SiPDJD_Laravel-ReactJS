<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kabupaten extends Model
{
    use HasFactory;

    protected $table = 'tkabkota'; // Nama tabel di database
    protected $primaryKey = 'kdkabkota';
    protected $fillable = ['nmkabkota', 'kdlokasi'];
}
