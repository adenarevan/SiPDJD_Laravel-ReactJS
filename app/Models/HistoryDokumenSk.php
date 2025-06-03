<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryDokumenSk extends Model
{
    use HasFactory;
    public $timestamps = false; // ⛔ Nonaktifkan auto created_at dan updated_at
    protected $table = 'thistorydoksk'; // <-- tambahkan ini
    protected $guarded = []; // <-- biar bisa create semua kolom langsung
}
