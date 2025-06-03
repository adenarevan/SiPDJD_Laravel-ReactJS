<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RuasJalanCollection extends ResourceCollection
{
    /**
     * Secara default Laravel akan otomatis apply resource pada tiap item.
     * Jadi cukup return $this->collection saja untuk preserve pagination.
     */
    public function toArray($request)
    {
        return $this->collection; // ✅ FIXED: biarkan bentuk paginated utuh
    }

    public function with($request)
    {
        return [
            'current_page' => $this->currentPage(),
            'last_page' => $this->lastPage(),
            'per_page' => $this->perPage(),
            'total' => $this->total(),
        ];
    }

    // (optional) auto apply RuasJalanResource
    public $collects = RuasJalanResource::class; // ✅ BENAR

}
