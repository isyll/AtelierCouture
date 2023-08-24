<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    private $pagination;

    public function __construct($resource)
    {
        $this->pagination = [
            'total'        => $resource->total(),
            'per_page'     => $resource->perPage(),
            'current_page' => $resource->currentPage(),
            'last_page'    => $resource->lastPage()
        ];

        $resource = $resource->getCollection();

        parent::__construct($resource);
    }

    public function toArray($request)
    {
        return [
            'data'       => $this->collection,
            'pagination' => $this->pagination,
        ];
    }
}