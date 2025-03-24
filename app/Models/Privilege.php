<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Privilege extends Model
{
    use HasFactory;

    protected $table = 'tprivilege';
    protected $primaryKey = 'kdprivilege';
    public $timestamps = false;
}
