<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class DokumenSkCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => DokumenSkResource::collection($this->collection),
        ];
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
}
