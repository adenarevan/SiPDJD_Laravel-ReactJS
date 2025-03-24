<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    use HasFactory;

    protected $table = 'tlokasi'; // Nama tabel di database
    protected $primaryKey = 'kdlokasi';
    protected $fillable = ['nmlokasi'];
}
