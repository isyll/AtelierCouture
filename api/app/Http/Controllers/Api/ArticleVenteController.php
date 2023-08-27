<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateArticleVenteRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleVenteCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class ArticleVenteController extends Controller
{
    public function create(CreateArticleVenteRequest $request)
    {
        $validated = $request->validated();
        $article   = Article::create($validated);
        $article->confection;
        return [
            'message' => 'Création réussie',
            'data'    => ArticleResource::make($article)
        ];
    }

    public function index(Request $request)
    {
        return [
            'categories_vente'    => CategoryResource::collection(Category::where('type', 'vente')->get()),
            'articles_confection' => ArticleResource::collection(Article::where('type', 'confection')->get()),
            'articles_vente'      => new ArticleVenteCollection(Article::with('confection')->where('type', 'vente')->paginate($request->input('size', 2))),
        ];
    }

    public function paginate(Request $request)
    {
        $size = $request->input('size', 2);
        return new ArticleVenteCollection(Article::with('confection')->where('type', 'vente')->paginate($size));
    }
}