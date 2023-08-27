<?php

namespace App\Http\Resources;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ArticleVenteCollection extends ResourceCollection
{
    public $collects = ArticleResource::class;

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


    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data'       => $this->collection,
            'pagination' => $this->pagination
        ];
    }
}