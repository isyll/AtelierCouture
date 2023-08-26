<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleVenteRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleVenteController extends Controller
{
    public function create(ArticleVenteRequest $request)
    {
        $validated = $request->validated();

        $article = Article::find($validated['id']);
        $article->confection()->sync($validated['confection']);
        $article = Article::with('confection')->find($validated['id']);

        return ArticleResource::make($article);
    }
}
