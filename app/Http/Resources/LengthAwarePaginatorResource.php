<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LengthAwarePaginatorResource extends JsonResource
{
    protected $resourceClass;

    public function __construct($resource, $resourceClass)
    {
        parent::__construct($resource);
        $this->resourceClass = $resourceClass;
    }

    public function toArray($request)
    {
        return [
            'data' => $this->resourceClass::collection($this->collection),
            'current_page' => $this->currentPage(),
            'last_page' => $this->lastPage(),
            'per_page' => $this->perPage(),
            'total' => $this->total(),
        ];
    }
}
