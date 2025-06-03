<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dd1Ruas extends Model
{
    protected $table = 'truasjalan'; // pastikan sesuai dengan nama tabel di DB

    protected $fillable = [
        'kdlokasi',
        'kdkabkota',
        'nomorruas',
        'nmruas',
        'kecdilalui',
        'panjang',
        'lebar',
        'hotmix',
        'aspal',
        'beton',
        'kerikil',  
        'tanah',
        'baik',
        'baikper',
        'sedang',
        'sedangper',
        'rusakringan',
        'rusakringanper',
        'rusakberat',
        'rusakberatper',
        'lhr',
        'akses',
        'keterangan'
    ];
}
